package com.example.novalogistica.viewmodel

import androidx.lifecycle.ViewModel
import com.example.novalogistica.model.SessionResponse

class SharedViewModel : ViewModel() {
    // Guarda los datos del empleado autenticado para compartirlos entre pantallas
    var session: SessionResponse? = null
    // Guarda el token de Firebase para enviarlo en cada peticion al backend
    var token: String = ""
}