package com.example.ui.screens

import android.graphics.Bitmap
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.foundation.background
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.clickable
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.style.TextAlign
import com.example.ui.FloraViewModel
import com.example.data.model.Lote
import com.example.ui.theme.PharmaPrimary
import com.example.ui.theme.PharmaWarning

@Composable
fun AuditorDashboardScreen(viewModel: FloraViewModel) {
    val lotes by viewModel.lotes.collectAsState()

    var filterStatus by remember { mutableStateOf("ALL") }
    var filterDateRange by remember { mutableStateOf("ALL") }
    var selectedLote by remember { mutableStateOf<Lote?>(null) }
    var showNotifications by remember { mutableStateOf(false) }
    var showConfigDialog by remember { mutableStateOf(false) }
    var alertThreshold by remember { mutableStateOf(7) }

    val filteredLotes = lotes.filter { lote ->
        val randomFactor = lote.id.hashCode() % 10

        val status = when {
            randomFactor < 3 -> ComplianceStatus.CRITICAL
            randomFactor < 6 -> ComplianceStatus.WARNING
            else -> ComplianceStatus.COMPLIANT
        }

        val statusMatch = when (filterStatus) {
            "PENDING" -> status == ComplianceStatus.WARNING
            "APPROVED" -> status == ComplianceStatus.COMPLIANT
            "REJECTED" -> status == ComplianceStatus.CRITICAL
            else -> true
        }

        // Mock date match logic
        val dateMatch = when (filterDateRange) {
            "LAST_7" -> Math.random() > 0.2
            "LAST_30" -> Math.random() > 0.1
            else -> true
        }

        statusMatch && dateMatch
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A1128))
            .padding(16.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column {
                Text(
                    text = "Panel de Auditoría GACP/GMP",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Validación regulatoria de insumos y progreso documental",
                    fontSize = 12.sp,
                    color = Color(0xFF94A3B8)
                )
            }
            
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val context = androidx.compose.ui.platform.LocalContext.current
                IconButton(
                    onClick = { 
                        try {
                            val fileContent = StringBuilder()
                            fileContent.append("Lote,Fase,Variedad,Score\n")
                            filteredLotes.forEach { lote ->
                                fileContent.append("${lote.name},${lote.phase},${lote.variety},${lote.complianceScore}\n")
                            }
                            
                            val sendIntent: android.content.Intent = android.content.Intent().apply {
                                action = android.content.Intent.ACTION_SEND
                                putExtra(android.content.Intent.EXTRA_TEXT, fileContent.toString())
                                putExtra(android.content.Intent.EXTRA_SUBJECT, "Reporte_GACP_Lotes.csv")
                                type = "text/csv"
                            }
                            val shareIntent = android.content.Intent.createChooser(sendIntent, "Exportar Reporte GACP")
                            context.startActivity(shareIntent)
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    },
                    modifier = Modifier
                        .background(Color(0xFF111A3A), RoundedCornerShape(8.dp))
                        .border(1.dp, Color(0xFF1A2642), RoundedCornerShape(8.dp))
                ) {
                    Icon(imageVector = androidx.compose.material.icons.Icons.Default.Share, contentDescription = "Exportar CSV", tint = Color(0xFF94A3B8))
                }
                
                IconButton(
                    onClick = { showConfigDialog = true },
                    modifier = Modifier
                        .background(Color(0xFF111A3A), RoundedCornerShape(8.dp))
                        .border(1.dp, Color(0xFF1A2642), RoundedCornerShape(8.dp))
                ) {
                    Icon(imageVector = Icons.Default.Settings, contentDescription = "Configuración", tint = Color(0xFF94A3B8))
                }
                
                Box {
                    IconButton(
                        onClick = { showNotifications = !showNotifications },
                        modifier = Modifier
                            .background(Color(0xFF111A3A), RoundedCornerShape(8.dp))
                            .border(1.dp, Color(0xFF1A2642), RoundedCornerShape(8.dp))
                    ) {
                        Box(contentAlignment = Alignment.TopEnd) {
                            Icon(imageVector = Icons.Default.Notifications, contentDescription = "Notificaciones", tint = Color(0xFF94A3B8))
                            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(Color(0xFFE11D48)))
                        }
                    }
                    
                    DropdownMenu(
                    expanded = showNotifications,
                    onDismissRequest = { showNotifications = false },
                    modifier = Modifier.background(Color(0xFF0A1128)).border(1.dp, Color(0xFF1A2642)).width(300.dp)
                ) {
                    Text("Notificaciones GACP", color = Color.White, fontWeight = FontWeight.Bold, modifier = Modifier.padding(16.dp))
                    HorizontalDivider(color = Color(0xFF1A2642))
                    DropdownMenuItem(
                        text = {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFE11D48)))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Lote L-2023-A requiere firma digital urgente.", color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                }
                                Text("Hace 5 min", color = Color(0xFF64748B), fontSize = 10.sp, modifier = Modifier.padding(start = 14.dp, top = 4.dp))
                            }
                        },
                        onClick = { showNotifications = false }
                    )
                    HorizontalDivider(color = Color(0xFF1A2642))
                    DropdownMenuItem(
                        text = {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFF59E0B)))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Documento 'Certificación de Semillas' próximo a vencer.", color = Color(0xFFCBD5E1), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                }
                                Text("Hace 2 horas", color = Color(0xFF64748B), fontSize = 10.sp, modifier = Modifier.padding(start = 14.dp, top = 4.dp))
                            }
                        },
                        onClick = { showNotifications = false }
                    )
                }
            }
        }
    }

    Spacer(modifier = Modifier.height(16.dp))
        
        // Módulo Estadístico Mock (Representación visual)
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            // Tasa de cumplimiento
            Column(modifier = Modifier.weight(1f).background(Color(0xFF111A3A), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFF1A2642), RoundedCornerShape(12.dp)).padding(12.dp)) {
                Text("Tasa de Cumplimiento", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth().height(60.dp), horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.Bottom) {
                    Box(modifier = Modifier.width(16.dp).fillMaxHeight(0.9f).background(Color(0xFF3B82F6), RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)))
                    Box(modifier = Modifier.width(16.dp).fillMaxHeight(0.6f).background(Color(0xFF3B82F6), RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)))
                    Box(modifier = Modifier.width(16.dp).fillMaxHeight(0.85f).background(Color(0xFF3B82F6), RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)))
                    Box(modifier = Modifier.width(16.dp).fillMaxHeight(0.5f).background(Color(0xFF3B82F6), RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)))
                }
            }
            // Proyección de cosecha
            Column(modifier = Modifier.weight(1f).background(Color(0xFF111A3A), RoundedCornerShape(12.dp)).border(1.dp, Color(0xFF1A2642), RoundedCornerShape(12.dp)).padding(12.dp)) {
                Text("Cosecha x Fechas", fontSize = 12.sp, color = Color.White, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth().height(60.dp), horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.Bottom) {
                    Box(modifier = Modifier.width(8.dp).size(8.dp).clip(CircleShape).background(Color(0xFF10B981)))
                    Box(modifier = Modifier.width(8.dp).size(8.dp).clip(CircleShape).background(Color(0xFF10B981)).offset(y = (-20).dp))
                    Box(modifier = Modifier.width(8.dp).size(8.dp).clip(CircleShape).background(Color(0xFF10B981)).offset(y = (-10).dp))
                    Box(modifier = Modifier.width(8.dp).size(8.dp).clip(CircleShape).background(Color(0xFF10B981)).offset(y = (-35).dp))
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Filtros Dashboard
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF111A3A), shape = RoundedCornerShape(12.dp))
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text("ESTADO DE CERTIFICACIÓN", fontSize = 10.sp, color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                var expandedStatus by remember { mutableStateOf(false) }
                Box {
                    OutlinedButton(
                        onClick = { expandedStatus = true },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.outlinedButtonColors(containerColor = Color(0xFF060B19), contentColor = Color(0xFFCBD5E1)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            when(filterStatus) {
                                "PENDING" -> "Pendiente de Aprobación"
                                "APPROVED" -> "Aprobado / Conforme"
                                "REJECTED" -> "Rechazado / Crítico"
                                else -> "Todos los Estados"
                            },
                            fontSize = 12.sp
                        )
                    }
                    DropdownMenu(
                        expanded = expandedStatus,
                        onDismissRequest = { expandedStatus = false },
                        modifier = Modifier.background(Color(0xFF131D3B))
                    ) {
                        DropdownMenuItem({ Text("Todos los Estados", color = Color.White) }, onClick = { filterStatus = "ALL"; expandedStatus = false })
                        DropdownMenuItem({ Text("Pendiente de Aprobación", color = Color.White) }, onClick = { filterStatus = "PENDING"; expandedStatus = false })
                        DropdownMenuItem({ Text("Aprobado / Conforme", color = Color.White) }, onClick = { filterStatus = "APPROVED"; expandedStatus = false })
                        DropdownMenuItem({ Text("Rechazado / Crítico", color = Color.White) }, onClick = { filterStatus = "REJECTED"; expandedStatus = false })
                    }
                }
            }
            Column(modifier = Modifier.weight(1f)) {
                Text("FECHA DE COSECHA", fontSize = 10.sp, color = Color(0xFF94A3B8), fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                var expandedDate by remember { mutableStateOf(false) }
                Box {
                    OutlinedButton(
                        onClick = { expandedDate = true },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.outlinedButtonColors(containerColor = Color(0xFF060B19), contentColor = Color(0xFFCBD5E1)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            when(filterDateRange) {
                                "LAST_7" -> "Últimos 7 días"
                                "LAST_30" -> "Últimos 30 días"
                                "THIS_YEAR" -> "Este año"
                                else -> "Cualquier Fecha"
                            },
                            fontSize = 12.sp
                        )
                    }
                    DropdownMenu(
                        expanded = expandedDate,
                        onDismissRequest = { expandedDate = false },
                        modifier = Modifier.background(Color(0xFF131D3B))
                    ) {
                        DropdownMenuItem({ Text("Cualquier Fecha", color = Color.White) }, onClick = { filterDateRange = "ALL"; expandedDate = false })
                        DropdownMenuItem({ Text("Últimos 7 días", color = Color.White) }, onClick = { filterDateRange = "LAST_7"; expandedDate = false })
                        DropdownMenuItem({ Text("Últimos 30 días", color = Color.White) }, onClick = { filterDateRange = "LAST_30"; expandedDate = false })
                        DropdownMenuItem({ Text("Este año", color = Color.White) }, onClick = { filterDateRange = "THIS_YEAR"; expandedDate = false })
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (filteredLotes.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No hay lotes disponibles para auditar.", color = Color(0xFF94A3B8))
            }
        } else {
            AuditorDashboardTable(lotes = filteredLotes, onClickLote = { selectedLote = it })
        }
    }

    if (selectedLote != null) {
        AuditDetailView(lote = selectedLote!!, onDismiss = { selectedLote = null })
    }

    if (showConfigDialog) {
        AlertDialog(
            onDismissRequest = { showConfigDialog = false },
            containerColor = Color(0xFF0A1128),
            textContentColor = Color.White,
            titleContentColor = Color.White,
            title = {
                Text(text = "Configuración de Alertas", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Notificar vencimiento documental antes de:", color = Color(0xFF94A3B8), fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf(3, 7, 15).forEach { days ->
                            Button(
                                onClick = { alertThreshold = days },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (alertThreshold == days) Color(0xFF2563EB) else Color(0xFF111A3A),
                                    contentColor = if (alertThreshold == days) Color.White else Color(0xFF94A3B8)
                                ),
                                shape = RoundedCornerShape(8.dp),
                                border = if (alertThreshold != days) androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1A2642)) else null
                            ) {
                                Text("${days}d", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Se enviará una notificación a todos los responsables técnicos y auditores $alertThreshold días antes de que cualquier certificación caduque.", color = Color(0xFF64748B), fontSize = 12.sp)
                }
            },
            confirmButton = {
                Button(
                    onClick = { showConfigDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Guardar", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfigDialog = false }) {
                    Text("Cancelar", color = Color(0xFF94A3B8))
                }
            }
        )
    }
}

@Composable
fun AuditorDashboardTable(lotes: List<Lote>, onClickLote: (Lote) -> Unit) {
    val scrollState = rememberScrollState()
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF060B19))
            .border(1.dp, Color(0xFF1A2642), RoundedCornerShape(12.dp))
    ) {
        Column(modifier = Modifier.horizontalScroll(scrollState).widthIn(min = 900.dp)) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF060B19))
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("LOTE / CEPA", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1.5f))
                Text("SCORE", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(0.8f), textAlign = TextAlign.Center)
                Text("FASE ACTUAL", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1f))
                Text("INSUMOS APLICADOS", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1.5f))
                Text("DOCUMENTACIÓN", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                Text("ANÁLISIS LAB", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1f), textAlign = TextAlign.Center)
                Text("CUMPLIMIENTO", fontSize = 10.sp, fontWeight = FontWeight.Black, color = Color(0xFF94A3B8), modifier = Modifier.weight(1.2f))
            }
            HorizontalDivider(color = Color(0xFF1A2642))
            
            LazyColumn(modifier = Modifier.fillMaxSize()) {
                items(lotes) { lote ->
                    LoteAuditoriaTableRow(lote, onClick = { onClickLote(lote) })
                    HorizontalDivider(color = Color(0xFF1A2642))
                }
            }
        }
    }
}

@Composable
fun LoteAuditoriaTableRow(lote: Lote, onClick: () -> Unit) {
    val randomFactor = lote.id.hashCode() % 10
    val status = when {
        randomFactor < 3 -> ComplianceStatus.CRITICAL
        randomFactor < 6 -> ComplianceStatus.WARNING
        else -> ComplianceStatus.COMPLIANT
    }

    val (statusColor, statusIcon, statusText, statusBg) = when(status) {
        ComplianceStatus.CRITICAL -> listOf(
            Color(0xFFE11D48), Icons.Filled.Error, "Crítico", Color(0xFFE11D48).copy(alpha = 0.1f)
        )
        ComplianceStatus.WARNING -> listOf(
            Color(0xFFD97706), Icons.Filled.Warning, "Advertencia", Color(0xFFD97706).copy(alpha = 0.1f)
        )
        ComplianceStatus.COMPLIANT -> listOf(
            Color(0xFF10B981), Icons.Filled.CheckCircle, "Conforme", Color(0xFF10B981).copy(alpha = 0.1f)
        )
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .background(Color(0xFF111A3A))
            .padding(horizontal = 16.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1.5f)) {
            Text(text = lote.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
            Text(text = lote.variety, fontSize = 11.sp, color = Color(0xFF94A3B8))
        }

        Box(modifier = Modifier.weight(0.8f), contentAlignment = Alignment.Center) {
            val scoreText = if (status == ComplianceStatus.COMPLIANT) "100" else if (status == ComplianceStatus.WARNING) "85" else "45"
            val scoreColor = if (status == ComplianceStatus.COMPLIANT) Color(0xFF10B981) else if (status == ComplianceStatus.WARNING) Color(0xFFD97706) else Color(0xFFE11D48)
            Row(
                modifier = Modifier
                    .background(Color(0xFF1A2642), RoundedCornerShape(6.dp))
                    .border(1.dp, Color(0xFF2A3B5C), RoundedCornerShape(6.dp))
                    .padding(horizontal = 6.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = statusIcon as androidx.compose.ui.graphics.vector.ImageVector, 
                    contentDescription = null, 
                    tint = scoreColor, 
                    modifier = Modifier.size(10.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(scoreText, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
            }
        }

        Box(modifier = Modifier.weight(1f)) {
            Text(
                text = "Floración",
                fontSize = 10.sp, 
                fontWeight = FontWeight.Bold, 
                color = Color(0xFFCBD5E1),
                modifier = Modifier
                    .background(Color(0xFF1A2642), RoundedCornerShape(4.dp))
                    .border(1.dp, Color(0xFF2A3B5C), RoundedCornerShape(4.dp))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }

        Column(modifier = Modifier.weight(1.5f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(if (status == ComplianceStatus.CRITICAL) Color(0xFFE11D48) else Color(0xFF10B981)))
                Spacer(modifier = Modifier.width(6.dp))
                Text("NeemXtract 500", fontSize = 11.sp, color = Color(0xFFCBD5E1))
            }
        }

        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
            Text(
                if (status == ComplianceStatus.COMPLIANT) "✓" else "Pendiente", 
                fontSize = 12.sp, 
                fontWeight = FontWeight.Bold,
                color = if (status == ComplianceStatus.COMPLIANT) Color(0xFF10B981) else Color(0xFFD97706)
            )
        }

        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
             Text(
                 if (randomFactor > 4) "Aprobado" else "N/A", 
                 fontSize = 12.sp, 
                 fontWeight = FontWeight.Bold,
                 color = if (randomFactor > 4) Color(0xFF10B981) else Color(0xFFD97706)
             )
        }

        Box(modifier = Modifier.weight(1.2f)) {
            Row(
                modifier = Modifier
                    .background(statusBg as Color, shape = RoundedCornerShape(12.dp))
                    .border(1.dp, (statusColor as Color).copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(imageVector = statusIcon as androidx.compose.ui.graphics.vector.ImageVector, contentDescription = null, tint = statusColor as Color, modifier = Modifier.size(12.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = statusText as String, color = statusColor, fontWeight = FontWeight.Bold, fontSize = 10.sp)
            }
        }
    }
}

enum class ComplianceStatus {
    CRITICAL, WARNING, COMPLIANT
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuditDetailView(lote: Lote, onDismiss: () -> Unit) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    
    var isSigned by remember { mutableStateOf(false) }
    var showPinDialog by remember { mutableStateOf(false) }
    var pinText by remember { mutableStateOf("") }
    
    val photos = remember { mutableStateListOf<Bitmap>() }
    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap ->
        bitmap?.let { photos.add(it) }
    }
    
    val randomFactor = lote.id.hashCode() % 10
    val status = when {
        randomFactor < 3 -> ComplianceStatus.CRITICAL
        randomFactor < 6 -> ComplianceStatus.WARNING
        else -> ComplianceStatus.COMPLIANT
    }
    
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = Color(0xFF0A1128)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text("Desglose de Auditoría", fontSize = 12.sp, color = Color(0xFF60A5FA), fontWeight = FontWeight.ExtraBold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(lote.name, fontSize = 24.sp, color = Color.White, fontWeight = FontWeight.Black)
            Text(lote.variety, fontSize = 14.sp, color = Color(0xFF94A3B8))
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text("Historial de Insumos", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF111A3A), shape = RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(if (status == ComplianceStatus.CRITICAL) Color(0xFFE11D48) else Color(0xFF10B981)))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("NeemXtract 500", fontSize = 14.sp, color = Color(0xFFCBD5E1), fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Aplicado el: 10 de Oct, 2025", fontSize = 12.sp, color = Color(0xFF94A3B8), modifier = Modifier.padding(start = 16.dp))
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text("Documentos de Cumplimiento", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF111A3A), shape = RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Column {
                        Text("BPA / GACP Checklist", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Medium)
                        Text(if (status == ComplianceStatus.COMPLIANT) "Anexo completo" else "Pendiente", fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }
                    Text(if (status == ComplianceStatus.COMPLIANT) "✓" else "PENDIENTE", color = if (status == ComplianceStatus.COMPLIANT) Color(0xFF10B981) else Color(0xFFD97706), fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text("Fotografías del Cultivo", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedButton(
                onClick = { cameraLauncher.launch(null) },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFCBD5E1), containerColor = Color(0xFF111A3A)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1A2642)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.PhotoCamera, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Capturar Fotografía", fontWeight = FontWeight.Bold)
            }
            if (photos.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    photos.forEach { bitmap ->
                        Image(
                            bitmap = bitmap.asImageBitmap(),
                            contentDescription = "Foto capturada",
                            modifier = Modifier.size(80.dp).clip(RoundedCornerShape(8.dp)),
                            contentScale = androidx.compose.ui.layout.ContentScale.Crop
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text("Responsable Técnico", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            if (isSigned) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF060B19), shape = RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF10B981).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(16.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Firmado digitalmente - TÉC-048-AG", fontSize = 12.sp, color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(40.dp).clip(CircleShape).background(Color(0xFF1E293B)), contentAlignment = Alignment.Center) {
                                Text("JS", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("Javier Santos", fontSize = 14.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                Text("Agrónomo Jefe", fontSize = 12.sp, color = Color(0xFF94A3B8))
                            }
                        }
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF111A3A), shape = RoundedCornerShape(12.dp))
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Requiere firma digital", fontSize = 12.sp, color = Color(0xFF94A3B8))
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { showPinDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Firmar Electrónicamente", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(
                    onClick = { /* Generar PDF acción simulada */ },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.Description, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Generar Reporte PDF", fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = { /* Generar QR acción simulada */ },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF60A5FA), containerColor = Color.Transparent),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1E3A8A)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Generar Código QR", fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A2642)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Cerrar Expediente", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    if (showPinDialog) {
        AlertDialog(
            onDismissRequest = { showPinDialog = false },
            containerColor = Color(0xFF0A1128),
            textContentColor = Color.White,
            titleContentColor = Color.White,
            title = {
                Text(text = "Firma Digital", fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    Text("Ingrese su PIN de 4 dígitos para certificar el lote según el estándar GACP.", color = Color(0xFF94A3B8), fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    OutlinedTextField(
                        value = pinText,
                        onValueChange = { if (it.length <= 4) pinText = it },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Color(0xFF111A3A),
                            unfocusedContainerColor = Color(0xFF111A3A),
                            focusedBorderColor = Color(0xFF2563EB),
                            unfocusedBorderColor = Color(0xFF1A2642),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        placeholder = { Text("••••", color = Color.Gray) }
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (pinText.length == 4) {
                            isSigned = true
                            showPinDialog = false
                            pinText = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB)),
                    enabled = pinText.length == 4
                ) {
                    Text("Autorizar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPinDialog = false }) {
                    Text("Cancelar", color = Color(0xFF94A3B8))
                }
            }
        )
    }
}
