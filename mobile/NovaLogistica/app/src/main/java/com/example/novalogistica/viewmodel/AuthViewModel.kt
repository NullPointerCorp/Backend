package com.example.novalogistica.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.novalogistica.repository.AuthRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class AuthViewModel : ViewModel() {
    private val repository = AuthRepository()
    private val firebaseAuth = FirebaseAuth.getInstance()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun login(
        correo: String,
        password: String,
        sharedViewModel: SharedViewModel,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null

            // Paso 1: prelogin (verificar correo y estado de la cuenta)
            val prelogin = repository.prelogin(correo)
            if (prelogin == null) {
                _error.value = "Credenciales inválidas o cuenta bloqueada"
                _isLoading.value = false
                return@launch
            }

            // Paso 2: autenticar con Firebase
            try {
                val result = firebaseAuth
                    .signInWithEmailAndPassword(correo, password)
                    .await()

                val firebaseToken = result.user
                    ?.getIdToken(false)
                    ?.await()
                    ?.token

                if (firebaseToken == null) {
                    repository.loginFailed(correo)
                    _error.value = "Error al obtener token"
                    _isLoading.value = false
                    return@launch
                }

                // Paso 3: obtener sesión del backend
                val session = repository.getSession(firebaseToken)
                if (session == null) {
                    repository.loginFailed(correo)
                    _error.value = "No autorizado"
                    _isLoading.value = false
                    return@launch
                }

                // Verificar que sea transportista (rol_id = 4)
                if (session.rol_id != 4) {
                    _error.value = "Acceso solo para transportistas"
                    _isLoading.value = false
                    return@launch
                }

                // Guardar sesión
                sharedViewModel.session = session
                sharedViewModel.token = firebaseToken

                _isLoading.value = false
                onSuccess()

            } catch (e: Exception) {
                repository.loginFailed(correo)
                _error.value = "Correo o contraseña incorrectos"
                _isLoading.value = false
            }
        }
    }
}