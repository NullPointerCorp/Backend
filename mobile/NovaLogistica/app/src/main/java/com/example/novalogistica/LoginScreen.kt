package com.example.novalogistica

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.novalogistica.ui.theme.*
import com.example.novalogistica.viewmodel.AuthViewModel
import com.example.novalogistica.viewmodel.SharedViewModel

@Composable
fun LoginScreen(
    navController: NavController,
    sharedViewModel: SharedViewModel
) {
    val authViewModel: AuthViewModel = viewModel()
    val isLoading by authViewModel.isLoading.collectAsState()
    val error by authViewModel.error.collectAsState()

    var correo by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(AzulOscuro),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Blanco),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "NovaLogística",
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    color = AzulOscuro
                )
                Text(
                    text = "Portal del Transportista",
                    fontSize = 14.sp,
                    color = TextoSecundario
                )

                Spacer(modifier = Modifier.height(32.dp))

                OutlinedTextField(
                    value = correo,
                    onValueChange = { correo = it },
                    label = { Text("Correo") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    shape = RoundedCornerShape(8.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Contraseña") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    shape = RoundedCornerShape(8.dp)
                )

                if (error != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = error!!,
                        color = EstadoCancelado,
                        fontSize = 13.sp
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                if (isLoading) {
                    CircularProgressIndicator(color = AzulBrillante)
                } else {
                    Button(
                        onClick = {
                            authViewModel.login(
                                correo = correo,
                                password = password,
                                sharedViewModel = sharedViewModel,
                                onSuccess = {
                                    navController.navigate("viajes") {
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = AzulBrillante)
                    ) {
                        Text(
                            text = "Iniciar sesión",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }
    }
}