package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.HistoryToggleOff
import androidx.compose.material.icons.outlined.HistoryEdu
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ActividadGACP
import com.example.data.model.Lote
import com.example.ui.FloraViewModel
import com.example.ui.theme.*

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun ActividadesScreen(
    viewModel: FloraViewModel,
    modifier: Modifier = Modifier
) {
    val lotes by viewModel.lotes.collectAsState()
    val actividades by viewModel.actividades.collectAsState()
    val validationAlert by viewModel.validationAlert.collectAsState()

    val appLanguage by viewModel.appLanguage.collectAsState()
    val isEn = appLanguage == com.example.ui.AppLanguage.EN

    var showFormDialog by remember { mutableStateOf(false) }
    var showFormErrors by remember { mutableStateOf(false) }

    // Form attributes
    var selectedLotItem by remember { mutableStateOf<Lote?>(null) }
    var activityType by remember { mutableStateOf(if (isEn) "Irrigation" else "Riego") }
    var activityDetails by remember { mutableStateOf("") }
    var inputUsed by remember { mutableStateOf("") }
    var quantity by remember { mutableStateOf("") }
    var responsibleName by remember { mutableStateOf("") }
    var auditSignature by remember { mutableStateOf("") }

    val activityTypesEs = listOf(
        "Siembra", "Riego", "Fertilización", "Aplicación Bioinsumo",
        "Control Plagas", "Poda", "Monitoreo", "Cosecha", "Secado", "Limpieza"
    )
    val activityTypesEn = listOf(
        "Sowing", "Irrigation", "Fertilization", "Bio-input Application",
        "Pest Control", "Pruning", "Monitoring", "Harvest", "Drying", "Cleaning"
    )
    val activityTypes = if (isEn) activityTypesEn else activityTypesEs

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
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isEn) "GACP Agricultural Activities" else "Actividades Agrícolas GACP",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = if (isEn) "Signed historical records of sowing, watering, inputs, and biosafety" else "Registro histórico firmado de siembra, riego, fertilización y bioseguridad",
                        fontSize = 11.sp,
                        color = HintDark
                    )
                }

                Button(
                    onClick = {
                        // De-select lot initially or choose first as default
                        selectedLotItem = lotes.firstOrNull()
                        activityType = if (isEn) "Irrigation" else "Riego"
                        showFormDialog = true
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Filled.HistoryEdu, contentDescription = "Sign Log", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (isEn) "Sign Log" else "Firmar Log", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Activities List View
            if (actividades.isEmpty()) {
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
                            imageVector = Icons.Outlined.HistoryToggleOff,
                            contentDescription = "No Operations",
                            tint = HintDark,
                            modifier = Modifier.size(52.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (isEn) "No historical logs captured yet" else "Aun no hay registros de actividades",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isEn) "Press the 'Sign Log' button to certify treatments, precision watering, or customized organic soil fertilization." else "Presione el botón 'Firmar Log' para certificar un tratamiento, riego de precisión o fertilización GACP.",
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
                    items(actividades) { activity ->
                        val originLotName = lotes.find { it.id == activity.lotId }?.name ?: (if (isEn) "General Facility (SOP)" else "Instalación General (SOP)")
                        ActivityListRecord(
                            activity = activity,
                            lotName = originLotName,
                            isEn = isEn,
                            onDelete = { viewModel.eliminarActividad(activity) }
                        )
                    }
                }
            }
        }

        // --- Custom Alert Dialog for Form fields validation ---
        validationAlert?.let { alertMessage ->
            AlertDialog(
                onDismissRequest = { viewModel.clearValidationAlert() },
                confirmButton = {
                    Button(onClick = { viewModel.clearValidationAlert() }) {
                        Text(if (isEn) "Complete Log" else "Completar Registro")
                    }
                },
                icon = { Icon(Icons.Filled.WarningAmber, contentDescription = "Falta Firma", tint = PharmaWarning) },
                title = { Text(if (isEn) "Missing Required Parameters" else "Campos Requeridos Faltantes", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                text = { Text(alertMessage, fontSize = 13.sp) }
            )
        }

        // --- Add Activity Dialog Sheet ---
        if (showFormDialog) {
            AlertDialog(
                onDismissRequest = { showFormDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Certify New GACP Action" else "Certificar Nueva Actividad GACP",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Lot Association Selector
                        item {
                            Text(
                                text = if (isEn) "Associated Production Lot" else "Lote de Producción Asociado",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            if (lotes.isEmpty()) {
                                Text(
                                    text = if (isEn) "Notice: No lots registered. Will save under General Area." else "Atención: No hay lotes registrados. Se guardará como Área General.",
                                    color = PharmaWarning,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            } else {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    lotes.forEach { lot ->
                                        val isSelected = selectedLotItem?.id == lot.id
                                        FilterChip(
                                            selected = isSelected,
                                            onClick = { selectedLotItem = lot },
                                            label = {
                                                Text(
                                                    text = lot.name,
                                                    fontSize = 10.sp,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                            },
                                            colors = FilterChipDefaults.filterChipColors(
                                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                                selectedLabelColor = Color.White
                                            )
                                        )
                                    }
                                }
                            }
                        }

                        // Activity Type Selector Chips
                        item {
                            Text(
                                text = if (isEn) "GACP Compliance Process Category" else "Categoría del Proceso GACP",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            FlowRow(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                activityTypes.forEach { type ->
                                    val isSelected = activityType == type
                                    FilterChip(
                                        selected = isSelected,
                                        onClick = { activityType = type },
                                        label = { Text(type, fontSize = 10.sp) },
                                        colors = FilterChipDefaults.filterChipColors(
                                            selectedContainerColor = PharmaSecondary,
                                            selectedLabelColor = Color.White
                                        )
                                    )
                                }
                            }
                        }

                        // Text Inputs
                        item {
                            OutlinedTextField(
                                value = activityDetails,
                                onValueChange = { activityDetails = it },
                                label = { Text(if (isEn) "Detailed Description (pH, Temperature, notes) *" else "Descripción Detallada (pH, Temperatura, etc.) *", fontSize = 12.sp) },
                                minLines = 2,
                                maxLines = 4,
                                isError = showFormErrors && activityDetails.isBlank(),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = inputUsed,
                                onValueChange = { inputUsed = it },
                                label = { Text(if (isEn) "Input / Agri-chemical Applied (Optional)" else "Insumo / Agroquímico Utilizado (Opcional)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = quantity,
                                onValueChange = { quantity = it },
                                label = { Text(if (isEn) "Volume / Dosage Amount (e.g., 50L, 2g/L)" else "Cantidad / Volumen / Dosis (ej: 50L, 2g/L)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = responsibleName,
                                onValueChange = { responsibleName = it },
                                label = { Text(if (isEn) "Assigned GACP Technologist / Supervisor *" else "Tecnico / Supervisor GACP Responsable *", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                isError = showFormErrors && responsibleName.isBlank(),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        // Secure Signature Panel (pharma-compliance)
                        item {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = PharmaWarning.copy(alpha = 0.08f)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        text = if (isEn) "ALCOA+ Authorized Compliance Signature" else "Firma Autorizada de Auditoría (ALCOA+)",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PharmaWarning
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = if (isEn) "To meet rigorous pharmaceutical traceability requirements, authorize this record with your secure credentials." else "Para cumplir con la trazabilidad farmacéutica, firme ingresando su clave o código personal.",
                                        fontSize = 9.sp,
                                        color = HintDark,
                                        lineHeight = 12.sp
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    OutlinedTextField(
                                        value = auditSignature,
                                        onValueChange = { auditSignature = it },
                                        placeholder = { Text(if (isEn) "e.g., SIG: JSmith-P82 *" else "Ej: FIRMA: APerez-C81 *", fontSize = 11.sp) },
                                        singleLine = true,
                                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                                        isError = showFormErrors && auditSignature.isBlank(),
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedBorderColor = PharmaWarning,
                                            unfocusedBorderColor = PharmaWarning.copy(alpha = 0.5f),
                                            errorBorderColor = PharmaError
                                        ),
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (activityDetails.isBlank() || responsibleName.isBlank() || auditSignature.isBlank()) {
                                showFormErrors = true
                                val msg = if (isEn) "Please input all mandatory fields marked with *." else "Por favor ingrese todos los campos marcados con *."
                                viewModel.setValidationAlert(msg)
                            } else {
                                val targetLotId = selectedLotItem?.id ?: 0
                                val success = viewModel.registrarActividad(
                                lotId = targetLotId,
                                type = activityType,
                                details = activityDetails,
                                inputUsed = inputUsed,
                                quantity = quantity,
                                responsible = responsibleName,
                                signature = auditSignature
                            )
                            if (success) {
                                // Reset form state
                                activityDetails = ""
                                inputUsed = ""
                                quantity = ""
                                responsibleName = ""
                                auditSignature = ""
                                showFormErrors = false
                                showFormDialog = false
                            }
                        }
                    }
                    ) {
                        Text(if (isEn) "Certify Register" else "Certificar Registro")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showFormDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }
    }
}

@Composable
fun ActivityListRecord(
    activity: ActividadGACP,
    lotName: String,
    isEn: Boolean,
    onDelete: () -> Unit
) {
    val displayedType = if (isEn) {
        when (activity.type) {
            "Siembra" -> "Sowing"
            "Riego" -> "Irrigation"
            "Fertilización" -> "Fertilization"
            "Aplicación Bioinsumo" -> "Bio-input Application"
            "Control Plagas" -> "Pest Control"
            "Poda" -> "Pruning"
            "Monitoreo" -> "Monitoring"
            "Cosecha" -> "Harvest"
            "Secado" -> "Drying"
            "Limpieza" -> "Cleaning"
            else -> activity.type
        }
    } else {
        when (activity.type) {
            "Sowing" -> "Siembra"
            "Irrigation" -> "Riego"
            "Fertilization" -> "Fertilización"
            "Bio-input Application" -> "Aplicación Bioinsumo"
            "Pest Control" -> "Control Plagas"
            "Pruning" -> "Poda"
            "Monitoring" -> "Monitoreo"
            "Harvest" -> "Cosecha"
            "Drying" -> "Secado"
            "Cleaning" -> "Limpieza"
            else -> activity.type
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // First Row: Type + Lot name association
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .background(
                                color = when (activity.type) {
                                    "Siembra", "Sowing" -> Color(0xFFBA1A1A)
                                    "Cosecha", "Harvest" -> Color(0xFF3F5F90)
                                    "Control Plagas", "Pest Control" -> CleanWarning
                                    "Limpieza", "Cleaning" -> CleanSuccess
                                    else -> CleanPrimary
                                },
                                shape = androidx.compose.foundation.shape.CircleShape
                            )
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = displayedType,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFE9F1EA)
                ) {
                    Text(
                        text = lotName,
                        color = CleanPrimary,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Details Description
            Text(
                text = activity.details,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = 16.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            // Dynamic Inputs Used
            if (activity.inputUsed != "N/A" && activity.inputUsed.isNotBlank()) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFD7E3FF), // Soft Blue Container
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(imageVector = Icons.Filled.Eco, contentDescription = "Insumo", tint = Color(0xFF3F5F90), modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isEn) "Input: ${activity.inputUsed} (${activity.quantity})" else "Insumo: ${activity.inputUsed} (${activity.quantity})",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF1A1C1E)
                        )
                    }
                }
            }

            Divider(color = BorderColor.copy(alpha = 0.5f), modifier = Modifier.padding(bottom = 8.dp))

            // Footer: Responsible & Signature
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isEn) "RESPONSIBLE" else "RESPONSABLE",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = HintDark
                    )
                    Text(
                        text = activity.responsible,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }

                // Secured Signature Ribbon
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFE9F1EA))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Filled.Verified, contentDescription = "Signed", tint = CleanPrimary, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = activity.signature,
                            color = CleanPrimary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}
