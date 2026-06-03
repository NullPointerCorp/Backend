package com.example.novalogistica.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.novalogistica.model.ViajeResponse
import com.example.novalogistica.repository.ViajeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class ViajeViewModel : ViewModel() {
    private val repository = ViajeRepository()

    private val _viajes = MutableStateFlow<List<ViajeResponse>>(emptyList())
    val viajes: StateFlow<List<ViajeResponse>> = _viajes

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    // Carga los viajes del transportista al entrar a la pantalla
    fun cargarViajes(token: String, empleadoId: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            val lista = repository.getViajesTransportista(token, empleadoId)
            _viajes.value = lista
            _isLoading.value = false
        }
    }

    // Actualiza el estado localmente sin recargar toda la lista
    fun iniciarViaje(token: String, viajeId: Int) {
        viewModelScope.launch {
            val exito = repository.iniciarViaje(token, viajeId)
            if (exito) {
                _viajes.value = _viajes.value.map { viaje ->
                    if (viaje.viaje_id == viajeId) viaje.copy(estado = "en_camino")
                    else viaje
                }
            } else {
                _error.value = "Ya tienes un viaje en curso. Finalízalo antes de iniciar otro."
            }
        }
    }

    fun finalizarViaje(token: String, viajeId: Int) {
        viewModelScope.launch {
            val exito = repository.finalizarViaje(token, viajeId)
            if (exito) {
                _viajes.value = _viajes.value.map { viaje ->
                    if (viaje.viaje_id == viajeId) viaje.copy(estado = "entregado")
                    else viaje
                }
            } else {
                _error.value = "No se pudo finalizar el viaje"
            }
        }
    }

    fun iniciarRegreso(token: String, viajeId: Int) {
        viewModelScope.launch {
            val exito = repository.iniciarRegreso(token, viajeId)
            if (exito) {
                _viajes.value = _viajes.value.map { viaje ->
                    if (viaje.viaje_id == viajeId) viaje.copy(estado = "regresando")
                    else viaje
                }
            } else {
                _error.value = "No se pudo iniciar el regreso"
            }
        }
    }

    fun confirmarRegreso(token: String, viajeId: Int) {
        viewModelScope.launch {
            val exito = repository.confirmarRegreso(token, viajeId)
            if (exito) {
                _viajes.value = _viajes.value.map { viaje ->
                    if (viaje.viaje_id == viajeId) viaje.copy(estado = "finalizado")
                    else viaje
                }
            } else {
                _error.value = "No se pudo confirmar el regreso"
            }
        }
    }

    fun limpiarError() {
        _error.value = null
    }
}