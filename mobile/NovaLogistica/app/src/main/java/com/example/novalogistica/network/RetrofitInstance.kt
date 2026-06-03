package com.example.novalogistica.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

//Se aplica el patron Singleton para la instancia de retrofit
object RetrofitInstance {
    // URL base del backend desplegado en Railway
    private const val BASE_URL = "https://backend-production-28da.up.railway.app/"

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create()) //JSON a kotlin
            .build()
            .create(ApiService::class.java)
    }
}