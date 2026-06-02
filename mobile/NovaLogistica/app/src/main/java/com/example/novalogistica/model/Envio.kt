package com.example.novalogistica.model

//Datos del empleado autenticado(respuesta del login)
data class SessionResponse(
    val id: Int,
    val nombre: String,
    val rol: String,
    val rol_id: Int
)

//Datos de un viaje que ve el transportista
data class ViajeResponse(
    val viaje_id: Int,
    val origen: String,
    val destino: String,
    val fecha_salida: String,
    val fecha_llegada: String,
    val estado: String,
    val total_envios: Int
)

//Respuesta generica del backend (ej: viaje iniciado correctamente)
data class MessageResponse(
    val message: String
)