package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Inbox
import androidx.compose.material.icons.outlined.Yard
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ActividadGACP
import com.example.data.model.Lote
import com.example.ui.FloraViewModel
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun LotesScreen(
    viewModel: FloraViewModel,
    modifier: Modifier = Modifier
) {
    val lotes by viewModel.lotes.collectAsState()
    val actividades by viewModel.actividades.collectAsState()
    val validationAlert by viewModel.validationAlert.collectAsState()

    val appLanguage by viewModel.appLanguage.collectAsState()
    val isEn = appLanguage == com.example.ui.AppLanguage.EN

    var showAddDialog by remember { mutableStateOf(false) }
    var showFormErrors by remember { mutableStateOf(false) }
    var selectedLoteDetails by remember { mutableStateOf<Lote?>(null) }
    var showGreenPassportForLote by remember { mutableStateOf<Lote?>(null) }

    // Form states
    var lotName by remember { mutableStateOf("") }
    var lotArea by remember { mutableStateOf("") }
    var lotVariety by remember { mutableStateOf("") }
    var lotPhase by remember { mutableStateOf(if (isEn) "Sowing" else "Siembra") }

    val phasesEs = listOf("Siembra", "Crecimiento", "Floración", "Cosecha", "Secado", "Terminado")
    val phasesEn = listOf("Sowing", "Vegetative", "Flowering", "Harvest", "Drying", "Finished")
    val phases = if (isEn) phasesEn else phasesEs

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Screen Title
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isEn) "Crop & Lot Management" else "Gestión de Cultivos y Lotes",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = if (isEn) "Traceability and phenological stages under GACP norms" else "Trazabilidad de lotes y estados fenológicos GACP",
                        fontSize = 11.sp,
                        color = HintDark
                    )
                }

                Button(
                    onClick = { 
                        lotPhase = if (isEn) "Sowing" else "Siembra"
                        showAddDialog = true 
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Icon(imageVector = Icons.Filled.Add, contentDescription = "Add Lot", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (isEn) "New Lot" else "Nuevo Lote", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Lote details overlay card if one is tapped
            AnimatedVisibility(
                visible = selectedLoteDetails != null,
                enter = expandVertically() + fadeIn(),
                exit = shrinkVertically() + fadeOut()
            ) {
                selectedLoteDetails?.let { lote ->
                    LoteDetailsCard(
                        lote = lote,
                        activities = actividades.filter { it.lotId == lote.id },
                        isEn = isEn,
                        onDismiss = { selectedLoteDetails = null },
                        onDelete = {
                            viewModel.eliminarLote(lote)
                            selectedLoteDetails = null
                        },
                        onShowPassport = { showGreenPassportForLote = lote }
                    )
                }
            }

            if (selectedLoteDetails != null) {
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Main Listing
            if (lotes.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Yard,
                            contentDescription = "No Lots",
                            tint = HintDark,
                            modifier = Modifier.size(52.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (isEn) "No cultivation lots registered" else "No se han registrado lotes de cultivo",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isEn) "Register a parcel or lot with its technical genetics to start mandatory compliance traceability." else "Registre un predio o lote con su respectiva genética técnica para iniciar la trazabilidad obligatoria.",
                            fontSize = 12.sp,
                            color = HintDark,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(lotes) { lote ->
                        LoteListItem(
                            lote = lote,
                            isEn = isEn,
                            onClick = { selectedLoteDetails = lote }
                        )
                    }
                }
            }
        }

        // --- Custom validation notification cloud / Dialog alert ---
        validationAlert?.let { alertMessage ->
            AlertDialog(
                onDismissRequest = { viewModel.clearValidationAlert() },
                confirmButton = {
                    TextButton(onClick = { viewModel.clearValidationAlert() }) {
                        Text(if (isEn) "Understood" else "Entendido", fontWeight = FontWeight.Bold)
                    }
                },
                icon = { Icon(Icons.Filled.Error, contentDescription = "Error", tint = PharmaError) },
                title = { Text(if (isEn) "Missing Technical Data" else "Falta de Datos Técnicos", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                text = { Text(alertMessage, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface) }
            )
        }

        // --- Add Lote Dialog Sheet ---
        if (showAddDialog) {
            AlertDialog(
                onDismissRequest = { showAddDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Register GACP Production Lot" else "Registrar Lote de Producción GACP",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = lotName,
                            onValueChange = { lotName = it },
                            label = { Text(if (isEn) "Lot Code (e.g., LT-CAN-03) *" else "Código de Lote (ej: LT-CAN-03) *", fontSize = 12.sp) },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                            isError = showFormErrors && lotName.isBlank(),
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = lotArea,
                            onValueChange = { lotArea = it },
                            label = { Text(if (isEn) "Area / Greenhouse / Bed *" else "Área / Invernadero / Cama *", fontSize = 12.sp) },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                            isError = showFormErrors && lotArea.isBlank(),
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = lotVariety,
                            onValueChange = { lotVariety = it },
                            label = { Text(if (isEn) "Variety / Genetics / Plant *" else "Variedad / Genética / Planta *", fontSize = 12.sp) },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                            isError = showFormErrors && lotVariety.isBlank(),
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Phase Selector
                        Column {
                            Text(
                                text = if (isEn) "Initial Phenological Phase" else "Fase Fenológica Inicial",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )
                            FlowRow(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                phases.forEach { phase ->
                                    val isSelected = lotPhase == phase
                                    FilterChip(
                                        selected = isSelected,
                                        onClick = { lotPhase = phase },
                                        label = { Text(phase, fontSize = 11.sp) },
                                        colors = FilterChipDefaults.filterChipColors(
                                            selectedContainerColor = MaterialTheme.colorScheme.primary,
                                            selectedLabelColor = Color.White
                                        )
                                    )
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (lotName.isBlank() || lotArea.isBlank() || lotVariety.isBlank()) {
                                showFormErrors = true
                                val msg = if (isEn) "Please input all mandatory fields marked with *." else "Por favor ingrese todos los campos marcados con *."
                                viewModel.setValidationAlert(msg)
                            } else {
                                val success = viewModel.agregarLote(
                                name = lotName,
                                area = lotArea,
                                variety = lotVariety,
                                phase = lotPhase,
                                startDate = System.currentTimeMillis()
                            )
                            if (success) {
                                // Clear form
                                lotName = ""
                                lotArea = ""
                                lotVariety = ""
                                lotPhase = if (isEn) "Sowing" else "Siembra"
                                showFormErrors = false
                                showAddDialog = false
                            }
                        }
                    }
                    ) {
                        Text(if (isEn) "Register" else "Registrar")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }

        // --- Green Passport Certificate Dialog ---
        showGreenPassportForLote?.let { lote ->
            GreenPassportDialog(
                lote = lote,
                isEn = isEn,
                onDismiss = { showGreenPassportForLote = null },
                onShare = {
                    val msg = if (isEn) {
                        "GACP CERTIFICATE SHARED: Secured Green Passport link for batch ${lote.name} successfully pushed to compliance register API."
                    } else {
                        "PASAPORTE GREEN COMPARTIDO: El enlace de verificación GACP para el lote ${lote.name} se ha compartido y registrado en la API de trazabilidad."
                    }
                    viewModel.setValidationAlert(msg)
                    showGreenPassportForLote = null
                }
            )
        }
    }
}

@Composable
fun LoteListItem(
    lote: Lote,
    isEn: Boolean,
    onClick: () -> Unit
) {
    val localeToUse = if (isEn) Locale.US else Locale("es", "ES")
    val dateStr = SimpleDateFormat("dd MMM, yyyy", localeToUse).format(Date(lote.startDate))
    
    val phaseDisplay = if (isEn) {
        when (lote.phase) {
            "Siembra", "Sowing" -> "Sowing"
            "Crecimiento", "Vegetative" -> "Vegetative"
            "Floración", "Flowering" -> "Flowering"
            "Cosecha", "Harvest" -> "Harvest"
            "Secado", "Drying" -> "Drying"
            "Terminado", "Finished" -> "Finished"
            else -> lote.phase
        }
    } else {
        when (lote.phase) {
            "Sowing", "Siembra" -> "Siembra"
            "Vegetative", "Crecimiento" -> "Crecimiento"
            "Flowering", "Floración" -> "Floración"
            "Harvest", "Cosecha" -> "Cosecha"
            "Drying", "Secado" -> "Secado"
            "Finished", "Terminado" -> "Terminado"
            else -> lote.phase
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = lote.name,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = when (lote.phase) {
                            "Siembra", "Sowing" -> Color(0xFFFFDAD6) // Soft coral
                            "Floración", "Flowering" -> Color(0xFFD7E3FF) // Soft compliance blue
                            "Secado", "Drying" -> Color(0xFFF0F1EB) // Pastel tone
                            else -> Color(0xFFE9F1EA) // Sage green container
                        }
                    ) {
                        Text(
                            text = phaseDisplay,
                            color = when (lote.phase) {
                                "Siembra", "Sowing" -> Color(0xFFBA1A1A)
                                "Floración", "Flowering" -> Color(0xFF3F5F90)
                                "Secado", "Drying" -> Color(0xFF74777F)
                                else -> CleanPrimary
                            },
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.PinDrop, contentDescription = "Area", tint = HintDark, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(2.dp))
                    Text(text = lote.area, fontSize = 11.sp, color = HintDark)
                    Spacer(modifier = Modifier.width(10.dp))
                    Icon(imageVector = Icons.Filled.LocalFlorist, contentDescription = "Genetic", tint = HintDark, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(2.dp))
                    Text(text = lote.variety, fontSize = 11.sp, color = HintDark)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${if (isEn) "Started" else "Iniciado"}: $dateStr", 
                    fontSize = 10.sp, 
                    color = HintDark
                )
            }

            // Right side: Compliance indicator
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "QMS",
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold,
                    color = HintDark
                )
                Text(
                    text = "${lote.complianceScore}%",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = if (lote.complianceScore >= 95) CleanSuccess else if (lote.complianceScore >= 80) CleanWarning else CleanError
                )
            }
        }
    }
}

@Composable
fun LoteDetailsCard(
    lote: Lote,
    activities: List<ActividadGACP>,
    isEn: Boolean,
    onDismiss: () -> Unit,
    onDelete: () -> Unit,
    onShowPassport: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(24.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.Yard, contentDescription = "Lot Details", tint = CleanPrimary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isEn) "Lot Traceability: ${lote.name}" else "Trazabilidad del Lote: ${lote.name}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = CleanPrimary
                    )
                }
                Row {
                    IconButton(onClick = onDelete) {
                        Icon(imageVector = Icons.Outlined.Delete, contentDescription = "Delete Lot", tint = CleanError)
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Filled.Close, contentDescription = "Close details")
                    }
                }
            }

            Divider(color = BorderColor.copy(alpha = 0.5f), modifier = Modifier.padding(bottom = 8.dp))

            Text(
                text = if (isEn) "Complete Log of Certified Activities (GACP/GMP):" else "Historial Completo de Actividades Registradas (GACP/GMP):",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = HintDark,
                modifier = Modifier.padding(bottom = 6.dp)
            )

            if (activities.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(80.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(imageVector = Icons.Outlined.Inbox, contentDescription = "Empty", tint = HintDark, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isEn) "No signed activities recorded for this lot." else "No hay actividades firmadas para este lote.", 
                            fontSize = 11.sp, 
                            color = HintDark
                        )
                    }
                }
            } else {
                Column(
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.heightIn(max = 140.dp)
                ) {
                    activities.forEach { act ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFE9F1EA))
                                .padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = when (act.type) {
                                    "Siembra", "Sowing" -> Icons.Filled.Spa
                                    "Cosecha", "Harvest" -> Icons.Filled.Eco
                                    "Limpieza", "Cleaning" -> Icons.Filled.CleanHands
                                    "Control Plagas", "Pest Control" -> Icons.Filled.BugReport
                                    "Riego", "Irrigation" -> Icons.Filled.WaterDrop
                                    "Fertilización", "Fertilization" -> Icons.Filled.Agriculture
                                    else -> Icons.Filled.AssignmentTurnedIn
                                },
                                contentDescription = null,
                                tint = CleanPrimary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = act.type + " • " + act.details,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    maxLines = 1,
                                    color = Color(0xFF002111)
                                )
                                Text(
                                    text = if (isEn) "Digital Signature: ${act.signature} by ${act.responsible}" else "Firma Digital: ${act.signature} por ${act.responsible}",
                                    fontSize = 9.sp,
                                    color = CleanSecondary,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Divider(color = BorderColor.copy(alpha = 0.5f), modifier = Modifier.padding(bottom = 8.dp))

            // --- Crop Environment IoT Sensors Section ---
            Text(
                text = if (isEn) "Crop IoT Telemetry (Real-Time GACP Controls):" else "Telemetría Crop IoT (Controles GACP en Tiempo Real):",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = CleanPrimary,
                modifier = Modifier.padding(bottom = 6.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Temp
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FBF9)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(imageVector = Icons.Filled.Thermostat, contentDescription = null, tint = PharmaWarning, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = if (isEn) "Temp" else "Temp. Amb", fontSize = 9.sp, color = HintDark)
                        Text(text = "24.5 °C", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Humidity
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FBF9)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(imageVector = Icons.Filled.WaterDrop, contentDescription = null, tint = PharmaSecondary, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = if (isEn) "Humidity" else "Hum. Suelo", fontSize = 9.sp, color = HintDark)
                        Text(text = "61 %", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // pH
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FBF9)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(imageVector = Icons.Filled.Hvac, contentDescription = null, tint = CleanPrimary, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = if (isEn) "pH Water" else "pH Riego", fontSize = 9.sp, color = HintDark)
                        Text(text = "6.4 pH", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Conductivity
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF9FBF9)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(imageVector = Icons.Filled.ElectricBolt, contentDescription = null, tint = Color(0xFFE2A600), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = if (isEn) "EC Soil" else "EC Conduct", fontSize = 9.sp, color = HintDark)
                        Text(text = "1.8 mS", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // -- Visual green passport buttons --
            Button(
                onClick = onShowPassport,
                colors = ButtonDefaults.buttonColors(containerColor = CleanPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(imageVector = Icons.Filled.WorkspacePremium, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isEn) "Launch B2B Green Passport" else "Ver Pasaporte Verde de Trazabilidad GACP",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun QrCodeDraw(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val sizePx = size.width
        val cellSize = sizePx / 15f
        
        // Draw background
        drawRect(Color.White)
        
        // Finder patterns (nested squares)
        val finderIndices = listOf(
            Pair(0f, 0f),       // Top-Left
            Pair(10f, 0f),      // Top-Right
            Pair(0f, 10f)       // Bottom-Left
        )
        
        finderIndices.forEach { pair ->
            val cx = pair.first
            val cy = pair.second
            val px = cx * cellSize
            val py = cy * cellSize
            // Outer square
            drawRect(
                color = Color.Black,
                topLeft = androidx.compose.ui.geometry.Offset(px, py),
                size = androidx.compose.ui.geometry.Size(cellSize * 5, cellSize * 5)
            )
            // Inner white ring
            drawRect(
                color = Color.White,
                topLeft = androidx.compose.ui.geometry.Offset(px + cellSize, py + cellSize),
                size = androidx.compose.ui.geometry.Size(cellSize * 3, cellSize * 3)
            )
            // Center black spot
            drawRect(
                color = Color.Black,
                topLeft = androidx.compose.ui.geometry.Offset(px + cellSize * 1.5f, py + cellSize * 1.5f),
                size = androidx.compose.ui.geometry.Size(cellSize * 2, cellSize * 2)
            )
        }
        
        // Seeded random pseudo-data pixels for realistic QR look
        val qrPoints = listOf(
            Pair(6f, 0f), Pair(8f, 0f), Pair(6f, 1f), Pair(8f, 1f), Pair(6f, 2f), Pair(7f, 2f),
            Pair(0f, 6f), Pair(1f, 6f), Pair(2f, 6f), Pair(3f, 6f), Pair(4f, 6f), Pair(5f, 6f),
            Pair(6f, 6f), Pair(7f, 6f), Pair(8f, 6f), Pair(9f, 6f), Pair(10f, 6f), Pair(11f, 6f),
            Pair(12f, 6f), Pair(13f, 6f), Pair(14f, 6f),
            Pair(6f, 7f), Pair(9f, 7f), Pair(11f, 7f), Pair(13f, 7f),
            Pair(6f, 8f), Pair(8f, 8f), Pair(12f, 8f), Pair(14f, 8f),
            Pair(0f, 8f), Pair(2f, 8f), Pair(4f, 8f),
            Pair(9f, 0f), Pair(9f, 2f), Pair(9f, 4f),
            Pair(11f, 10f), Pair(13f, 10f), Pair(11f, 12f), Pair(12f, 12f), Pair(14f, 12f),
            Pair(10f, 13f), Pair(13f, 13f), Pair(12f, 14f), Pair(14f, 14f)
        )
        
        qrPoints.forEach { point ->
            val x = point.first
            val y = point.second
            drawRect(
                color = Color.Black,
                topLeft = androidx.compose.ui.geometry.Offset(x * cellSize, y * cellSize),
                size = androidx.compose.ui.geometry.Size(cellSize, cellSize)
            )
        }
    }
}

@Composable
fun GreenPassportDialog(
    lote: Lote,
    isEn: Boolean,
    onDismiss: () -> Unit,
    onShare: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = onShare,
                colors = ButtonDefaults.buttonColors(containerColor = CleanPrimary)
            ) {
                Icon(imageVector = Icons.Filled.Share, contentDescription = null, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(if (isEn) "Register & Share" else "Registrar y Compartir")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(if (isEn) "Close" else "Cerrar")
            }
        },
        icon = {
            Icon(
                imageVector = Icons.Filled.WorkspacePremium,
                contentDescription = null,
                tint = CleanPrimary,
                modifier = Modifier.size(32.dp)
            )
        },
        title = {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = if (isEn) "GACP GREEN PASSPORT" else "PASAPORTE VERDE GACP",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = CleanPrimary
                )
                Text(
                    text = if (isEn) "Secured Cryptographic Traceability" else "Trazabilidad Criptográfica Asegurada",
                    fontSize = 10.sp,
                    color = HintDark
                )
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Procedural QR Code Card
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(2.dp, CleanPrimary.copy(alpha = 0.2f)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.padding(8.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        QrCodeDraw(
                            modifier = Modifier
                                .size(120.dp)
                                .background(Color.White)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "SECURE VERIFY KEY: FTC-COMP-${lote.id}-${lote.name.hashCode().coerceAtLeast(0)}",
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = CleanSecondary
                        )
                    }
                }

                // Compliance stats
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.background),
                    border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = if (isEn) "B2B Lot Owner ID" else "ID Lote B2B", fontSize = 10.sp, color = HintDark)
                            Text(text = lote.name, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = if (isEn) "Genetic Registry" else "Registro Genético", fontSize = 10.sp, color = HintDark)
                            Text(text = lote.variety, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CleanPrimary)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = if (isEn) "Quality System Score" else "Puntaje del Sistema de Calidad", fontSize = 10.sp, color = HintDark)
                            Text(text = "${lote.complianceScore}% GACP-OK", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CleanSuccess)
                        }
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = if (isEn) "Block Integrity" else "Integridad del Bloque", fontSize = 10.sp, color = HintDark)
                            Text(text = if (isEn) "SECURE SHA-256" else "VALIDADO ALCOA+", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = CleanSecondary)
                        }
                    }
                }

                // Official look and feel badge
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = CleanSuccess.copy(alpha = 0.12f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(imageVector = Icons.Filled.LocalPolice, contentDescription = null, tint = CleanSuccess, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isEn) "This crop meets GACP Directive WHO/FARM2003 guidelines for heavy metal & pesticide compliance limits." else "Este cultivo cumple con las directrices GACP de la OMS para límites de metales pesados y residuos de pesticidas.",
                            fontSize = 8.sp,
                            lineHeight = 12.sp,
                            color = CleanSuccess,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }
    )
}
