package com.example.novalogistica.repository

import com.example.novalogistica.model.MessageResponse
import com.example.novalogistica.model.SessionResponse
import com.example.novalogistica.network.RetrofitInstance

class AuthRepository {

    // Verificar correo antes del login
    suspend fun prelogin(correo: String): MessageResponse? {
        return try {
            RetrofitInstance.api.prelogin(mapOf("correo" to correo))
        } catch (e: Exception) {
            null
        }
    }

    // Obtener sesión con token Firebase
    suspend fun getSession(token: String): SessionResponse? {
        return try {
            val session = RetrofitInstance.api.getSession("Bearer $token")
            session
        } catch (e: Exception) {
            null
        }
    }

    // Registrar intento fallido
    suspend fun loginFailed(correo: String) {
        try {
            RetrofitInstance.api.loginFailed(mapOf("correo" to correo))
        } catch (e: Exception) {
            // ignorar
        }
    }
}