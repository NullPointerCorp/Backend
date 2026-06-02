package com.example.novalogistica.repository

import com.example.novalogistica.model.ViajeResponse
import com.example.novalogistica.network.RetrofitInstance

class ViajeRepository {

    // Obtener viajes del transportista
    suspend fun getViajesTransportista(token: String, empleadoId: Int): List<ViajeResponse> {
        return try {
            RetrofitInstance.api.getViajesTransportista("Bearer $token", empleadoId)
        } catch (e: Exception) {
            emptyList()
        }
    }

    // Iniciar viaje
    suspend fun iniciarViaje(token: String, viajeId: Int): Boolean {
        return try {
            RetrofitInstance.api.iniciarViaje("Bearer $token", viajeId)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Finalizar viaje
    suspend fun finalizarViaje(token: String, viajeId: Int): Boolean {
        return try {
            RetrofitInstance.api.finalizarViaje("Bearer $token", viajeId)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Iniciar regreso
    suspend fun iniciarRegreso(token: String, viajeId: Int): Boolean {
        return try {
            RetrofitInstance.api.iniciarRegreso("Bearer $token", viajeId)
            true
        } catch (e: Exception) {
            false
        }
    }

    // Confirmar regreso
    suspend fun confirmarRegreso(token: String, viajeId: Int): Boolean {
        return try {
            RetrofitInstance.api.confirmarRegreso("Bearer $token", viajeId)
            true
        } catch (e: Exception) {
            false
        }
    }
}