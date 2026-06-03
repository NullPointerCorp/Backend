package com.example.novalogistica.network

import com.example.novalogistica.model.MessageResponse
import com.example.novalogistica.model.SessionResponse
import com.example.novalogistica.model.ViajeResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {

    // Verificar si el correo existe y no esta bloqueado
    @POST("auth/prelogin")
    suspend fun prelogin(
        @Body body: Map<String, String>
    ): MessageResponse

    // Obtener datos del empleado (sesion) con token Firebase
    @GET("auth/me")
    suspend fun getSession(
        @Header("Authorization") token: String
    ): SessionResponse

    // Registrar intento fallido
    @POST("auth/login-failed")
    suspend fun loginFailed(
        @Body body: Map<String, String>
    ): MessageResponse

    // Obtener viajes del transportista de acuerdo al id del empleado
    @GET("viajes/transportista/{empleadoId}")
    suspend fun getViajesTransportista(
        @Header("Authorization") token: String,
        @Path("empleadoId") empleadoId: Int
    ): List<ViajeResponse>

    // Iniciar viaje (Cambia el estado del viaje a "en_camino" y sus envios a "en_camino")
    @PATCH("viajes/{viajeId}/iniciar")
    suspend fun iniciarViaje(
        @Header("Authorization") token: String,
        @Path("viajeId") viajeId: Int
    ): MessageResponse

    // Finalizar viaje (Cambia el estado del viaje a "entregado" y sus envios a "entregado")
    @PATCH("viajes/{viajeId}/finalizar")
    suspend fun finalizarViaje(
        @Header("Authorization") token: String,
        @Path("viajeId") viajeId: Int
    ): MessageResponse

    // Iniciar regreso (Cambia el estado del viaje a "regresando", los envios no cambian)
    @PATCH("viajes/{viajeId}/regresar")
    suspend fun iniciarRegreso(
        @Header("Authorization") token: String,
        @Path("viajeId") viajeId: Int
    ): MessageResponse

    // Confirmar regreso (Cambia el estado del viaje a "finalizado")
    @PATCH("viajes/{viajeId}/confirmar-regreso")
    suspend fun confirmarRegreso(
        @Header("Authorization") token: String,
        @Path("viajeId") viajeId: Int
    ): MessageResponse
}