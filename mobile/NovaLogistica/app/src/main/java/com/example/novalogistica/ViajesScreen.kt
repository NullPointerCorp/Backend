package com.example.novalogistica

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.novalogistica.model.ViajeResponse
import com.example.novalogistica.ui.theme.*
import com.example.novalogistica.viewmodel.SharedViewModel
import com.example.novalogistica.viewmodel.ViajeViewModel
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

@Composable
fun ViajesScreen(
    navController: NavController,
    sharedViewModel: SharedViewModel
) {
    val viajeViewModel: ViajeViewModel = viewModel()
    val viajes by viajeViewModel.viajes.collectAsState()
    val isLoading by viajeViewModel.isLoading.collectAsState()
    val error by viajeViewModel.error.collectAsState()

    var mostrarDialogo by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(error) {
        if (error != null) {
            scope.launch {
                snackbarHostState.showSnackbar(error!!)
                viajeViewModel.limpiarError()
            }
        }
    }

    LaunchedEffect(Unit) {
        val session = sharedViewModel.session
        if (session != null) {
            viajeViewModel.cargarViajes(sharedViewModel.token, session.id)
        }
    }

    if (mostrarDialogo) {
        AlertDialog(
            onDismissRequest = { mostrarDialogo = false },
            title = { Text("Cerrar sesión") },
            text = { Text("¿Deseas cerrar sesión?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        mostrarDialogo = false
                        FirebaseAuth.getInstance().signOut()
                        sharedViewModel.session = null
                        sharedViewModel.token = ""
                        navController.navigate("login") {
                            popUpTo("viajes") { inclusive = true }
                        }
                    }
                ) {
                    Text("Sí, cerrar sesión", color = EstadoCancelado)
                }
            },
            dismissButton = {
                TextButton(onClick = { mostrarDialogo = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Encabezado
            Surface(
                color = AzulOscuro,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 20.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "Mis Viajes",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = Blanco
                        )
                        Text(
                            text = sharedViewModel.session?.nombre ?: "",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Blanco.copy(alpha = 0.7f)
                        )
                    }
                    IconButton(onClick = { mostrarDialogo = true }) {
                        Icon(
                            imageVector = Icons.Default.ExitToApp,
                            contentDescription = "Cerrar sesión",
                            tint = Blanco
                        )
                    }
                }
            }

            // Contenido
            when {
                isLoading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(color = AzulBrillante)
                    }
                }
                viajes.isEmpty() -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No tienes viajes asignados",
                            color = TextoSecundario
                        )
                    }
                }
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(viajes) { viaje ->
                            ViajeItem(
                                viaje = viaje,
                                onIniciarViaje = {
                                    viajeViewModel.iniciarViaje(sharedViewModel.token, viaje.viaje_id)
                                },
                                onFinalizarViaje = {
                                    viajeViewModel.finalizarViaje(sharedViewModel.token, viaje.viaje_id)
                                },
                                onIniciarRegreso = {
                                    viajeViewModel.iniciarRegreso(sharedViewModel.token, viaje.viaje_id)
                                },
                                onConfirmarRegreso = {
                                    viajeViewModel.confirmarRegreso(sharedViewModel.token, viaje.viaje_id)
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EstadoBadge(estado: String) {
    val (color, label) = when (estado) {
        "programado"  -> Pair(EstadoProgramado, "Programado")
        "en_camino"   -> Pair(EstadoEnCamino, "En Camino")
        "entregado"   -> Pair(EstadoEntregado, "Entregado")
        "regresando"  -> Pair(EstadoRegresando, "Regresando")
        "finalizado"  -> Pair(EstadoFinalizado, "Finalizado")
        else          -> Pair(EstadoCancelado, "Cancelado")
    }

    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(50),
    ) {
        Text(
            text = label,
            color = color,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun ViajeItem(
    viaje: ViajeResponse,
    onIniciarViaje: () -> Unit,
    onFinalizarViaje: () -> Unit,
    onIniciarRegreso: () -> Unit,
    onConfirmarRegreso: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Blanco),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {

            // Header de la card
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Viaje #${viaje.viaje_id}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextoPrimario
                )
                EstadoBadge(estado = viaje.estado)
            }

            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = GrisMedio)
            Spacer(modifier = Modifier.height(8.dp))

            // Ruta
            Text(
                text = "Origen",
                style = MaterialTheme.typography.labelSmall,
                color = TextoSecundario
            )
            Text(
                text = viaje.origen,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = TextoPrimario
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Destino",
                style = MaterialTheme.typography.labelSmall,
                color = TextoSecundario
            )
            Text(
                text = viaje.destino,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = TextoPrimario
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Envíos: ${viaje.total_envios}",
                style = MaterialTheme.typography.bodySmall,
                color = TextoSecundario
            )

            // Botón según estado
            val accion = when (viaje.estado) {
                "programado" -> Pair("Iniciar viaje", onIniciarViaje)
                "en_camino"  -> Pair("Finalizar viaje", onFinalizarViaje)
                "entregado"  -> Pair("Iniciar regreso", onIniciarRegreso)
                "regresando" -> Pair("Confirmar llegada", onConfirmarRegreso)
                else         -> null
            }

            if (accion != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = accion.second,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AzulBrillante)
                ) {
                    Text(
                        text = accion.first,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}