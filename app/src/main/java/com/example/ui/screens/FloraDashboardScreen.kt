package com.example.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.FloraViewModel

import com.example.ui.components.VirtualGuideDialog
import com.example.ui.components.VirtualGuideFloatingButton

@Composable
fun FloraDashboardScreen(
    viewModel: FloraViewModel,
    onLogout: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var showGuide by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            VirtualGuideFloatingButton(onClick = { showGuide = true })
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Filled.Yard, contentDescription = "Lotes") },
                    label = { Text("Lotes") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Filled.ListAlt, contentDescription = "Actividades") },
                    label = { Text("Actividades") }
                )
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Filled.MenuBook, contentDescription = "SOPs") },
                    label = { Text("SOPs") }
                )
                NavigationBarItem(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    icon = { Icon(Icons.Filled.FactCheck, contentDescription = "Auditorías") },
                    label = { Text("Aprobar") }
                )
                NavigationBarItem(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    icon = { Icon(Icons.Filled.Dashboard, contentDescription = "Dashboard Auditor") },
                    label = { Text("Auditor") }
                )
            }
        }
    ) { innerPadding ->
        Column(modifier = Modifier.padding(innerPadding).fillMaxSize()) {
            val pendingSyncCount by viewModel.pendingSyncCount.collectAsState()
            
            // Offline sync indicator
            Surface(
                color = MaterialTheme.colorScheme.tertiaryContainer,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(8.dp),
                    verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                ) {
                    Icon(Icons.Filled.SyncProblem, contentDescription = "Offline", tint = MaterialTheme.colorScheme.onTertiaryContainer)
                    Spacer(Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Modo Campo Sin Conexión", fontWeight = androidx.compose.ui.text.font.FontWeight.Bold, color = MaterialTheme.colorScheme.onTertiaryContainer, fontSize = 12.sp)
                        Text("$pendingSyncCount registros esperando sincronización.", color = MaterialTheme.colorScheme.onTertiaryContainer, fontSize = 10.sp)
                    }
                    OutlinedButton(
                        onClick = { viewModel.syncWithFirebase() },
                        modifier = Modifier.height(32.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp)
                    ) {
                        Text("Sincronizar", fontSize = 10.sp)
                    }
                }
            }

            Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
                when (selectedTab) {
                    0 -> LotesScreen(viewModel)
                    1 -> ActividadesScreen(viewModel)
                    2 -> SopsScreen(viewModel)
                    3 -> AuditoriasScreen(viewModel)
                    4 -> AuditorDashboardScreen(viewModel)
                }
            }
        }

        if (showGuide) {
            val (guideTitle, guideDesc, guideSteps) = when (selectedTab) {
                0 -> Triple("Gestión de Lotes", "Aprende a registrar y monitorear los lotes de cultivo agrícola.", listOf("Toca el botón 'Agregar Lote' para iniciar", "Ingresa los atributos como Variedad, Área y Fase actual", "Revisa el Índice de Cumplimiento GACP asignado automáticamente"))
                1 -> Triple("Registro de Actividades", "Mantén la trazabilidad de las labores culturales diarias.", listOf("Selecciona un lote activo", "Registra pesticidas, abonos o fases fenológicas", "Sincroniza cuando tengas internet"))
                2 -> Triple("Procedimientos (SOPs)", "Procedimientos Operativos Estándar normados.", listOf("Revisa los códigos oficiales documentales", "Verifica fechas de efectividad", "Consulta con el equipo de calidad si hay dudas"))
                3 -> Triple("Auditorías", "Validación y Checklists de métricas requeridas.", listOf("Genera auditorías Internas o Externas", "Puntuación en tiempo real de cumplimiento", "Exportable para certificaciones"))
                else -> Triple("Dashboard Auditor", "Analítica integral GACP", listOf("Revisa el progreso general de la finca", "Verifica lotes en riesgo", "Exporta métricas de cumplimiento"))
            }

            VirtualGuideDialog(
                moduleName = guideTitle,
                description = guideDesc,
                steps = guideSteps,
                onDismissRequest = { showGuide = false }
            )
        }
    }
}
