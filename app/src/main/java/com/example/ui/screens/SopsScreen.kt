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
import androidx.compose.material.icons.outlined.LibraryBooks
import androidx.compose.material.icons.outlined.Search
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
import com.example.data.model.DocumentSOP
import com.example.ui.FloraViewModel
import com.example.ui.theme.*

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun SopsScreen(
    viewModel: FloraViewModel,
    modifier: Modifier = Modifier
) {
    val sops by viewModel.sops.collectAsState()
    val validationAlert by viewModel.validationAlert.collectAsState()

    val appLanguage by viewModel.appLanguage.collectAsState()
    val isEn = appLanguage == com.example.ui.AppLanguage.EN

    var showAddSopDialog by remember { mutableStateOf(false) }
    var selectedSopDetails by remember { mutableStateOf<DocumentSOP?>(null) }
    var simulatedReadStaff by remember { mutableStateOf<Map<String, List<String>>>(emptyMap()) } // Maps SOP Code -> List of signed names

    // Form inputs
    var sopCode by remember { mutableStateOf("") }
    var sopTitle by remember { mutableStateOf("") }
    var sopVersion by remember { mutableStateOf("v1.0") }
    var sopStatus by remember { mutableStateOf(if (isEn) "Approved" else "Aprobado") }
    var sopEffectiveDate by remember { mutableStateOf("2026-06-17") }
    var sopApprovedBy by remember { mutableStateOf("") }
    var sopHistory by remember { mutableStateOf("") }

    val sopStatusesEs = listOf("Aprobado", "Borrador", "Obsoleto")
    val sopStatusesEn = listOf("Approved", "Draft", "Obsolete")
    val sopStatuses = if (isEn) sopStatusesEn else sopStatusesEs

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
            // Screen Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isEn) "Document Control & SOPs" else "Control Documental y SOPs",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = if (isEn) "Management of Standard Operating Procedures approved for sanitary audits" else "Gestión de Procedimientos Operativos Estándar aprobados para auditorías",
                        fontSize = 11.sp,
                        color = HintDark
                    )
                }

                Button(
                    onClick = { 
                        sopStatus = if (isEn) "Approved" else "Aprobado"
                        showAddSopDialog = true 
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PharmaSecondary)
                ) {
                    Icon(imageVector = Icons.Filled.NoteAdd, contentDescription = "Add SOP", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (isEn) "New SOP" else "Nuevo SOP", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Expandable SOP Details & Dynamic Lecturas
            AnimatedVisibility(
                visible = selectedSopDetails != null,
                enter = expandVertically() + fadeIn(),
                exit = shrinkVertically() + fadeOut()
            ) {
                selectedSopDetails?.let { sop ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondary.copy(alpha = 0.05f)),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Filled.History, contentDescription = "SOP History", tint = PharmaSecondary)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = if (isEn) "Digital Control: ${sop.code}" else "Control Digital: ${sop.code}",
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PharmaSecondary
                                    )
                                }
                                Row {
                                    IconButton(onClick = {
                                        viewModel.eliminarSOP(sop)
                                        selectedSopDetails = null
                                    }) {
                                        Icon(imageVector = Icons.Filled.DeleteForever, contentDescription = "Eliminar", tint = PharmaError)
                                    }
                                    IconButton(onClick = { selectedSopDetails = null }) {
                                        Icon(imageVector = Icons.Filled.Close, contentDescription = "Cerrar")
                                    }
                                }
                            }

                            Divider(color = PharmaSecondary.copy(alpha = 0.1f), modifier = Modifier.padding(bottom = 8.dp))

                            Text(
                                text = if (isEn) "Regulated Change History:" else "Historial de Cambios Regulados:",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            Text(
                                text = sop.historyOfChanges,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.padding(bottom = 12.dp)
                            )

                            // Training read validation sign-offs
                            Text(
                                text = if (isEn) "Staff Training & Reading Verification:" else "Evidencias de Lectura por el Personal:",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            val reads = simulatedReadStaff[sop.code] ?: emptyList()
                            if (reads.isEmpty()) {
                                Text(
                                    text = if (isEn) "No training logs documented for field staff yet." else "No se ha documentado capacitación de lectura para personal de campo todavía.",
                                    fontSize = 11.sp,
                                    color = PharmaWarning,
                                    modifier = Modifier.padding(bottom = 8.dp)
                                )
                            } else {
                                FlowRow(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(bottom = 10.dp),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    reads.forEach { staffName ->
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = PharmaSuccess.copy(alpha = 0.15f)
                                        ) {
                                            Row(
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Icon(imageVector = Icons.Filled.Verified, contentDescription = null, tint = PharmaSuccess, modifier = Modifier.size(10.dp))
                                                Spacer(modifier = Modifier.width(4.dp))
                                                Text(text = staffName, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = PharmaSuccess)
                                            }
                                        }
                                    }
                                }
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = {
                                        val randomStaff = listOf("Alejandro Pérez (Lead)", "Ing. Laura Gómez (QA)", "Liliana Rojas", "Carlos Salazar (Harvest)", "Marta Gómez (Plant)", "Carlos Ruiz")
                                        val newSigned = randomStaff.shuffled().take(2)
                                        val currentList = simulatedReadStaff[sop.code] ?: emptyList()
                                        val combined = (currentList + newSigned).distinct()
                                        simulatedReadStaff = simulatedReadStaff.toMutableMap().apply {
                                            put(sop.code, combined)
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = PharmaSecondary.copy(alpha = 0.15f), contentColor = PharmaSecondary),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(imageVector = Icons.Filled.Signpost, contentDescription = "Sign Read", modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(if (isEn) "Simulate Reading" else "Simular Lectura", fontSize = 11.sp)
                                }

                                Button(
                                    onClick = {
                                        // Simple compliance export simulation toast trigger
                                        val msg = if (isEn) {
                                            "EXPORT SUCCESSFUL: Digitally signed auditor-ready PDF document successfully generated for compliance SOP ${sop.code}."
                                        } else {
                                            "EXPORTACIÓN EXITOSA: Se generó el lote documental firmado digitalmente en formato auditable para la brecha de control regulatory de directrices ${sop.code}. Guardado listo para autoridades sanitarias."
                                        }
                                        viewModel.setValidationAlert(msg)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = PharmaPrimary),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(imageVector = Icons.Filled.Download, contentDescription = "Export SOP", modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(if (isEn) "Export PDF" else "Exportar PDF", fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Main SOPs List
            if (sops.isEmpty()) {
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
                            imageVector = Icons.Outlined.LibraryBooks,
                            contentDescription = "No Docs",
                            tint = HintDark,
                            modifier = Modifier.size(52.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (isEn) "No SOP documents loaded yet" else "No se han cargado documentos SOP",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isEn) "Register standard operating procedures for sanitization, precision watering, or CAPAs to back up plant EU-GMP audits." else "Registre procedimientos operativos estándar de sanitización, riego, o CAPAs para sustentar las auditorías EU-GMP de la planta.",
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
                    items(sops) { sop ->
                        SopListItem(
                            sop = sop,
                            signedReadsCount = simulatedReadStaff[sop.code]?.size ?: 0,
                            isEn = isEn,
                            onClick = { selectedSopDetails = sop }
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
                        Text(if (isEn) "Complete" else "Completar")
                    }
                },
                icon = { Icon(Icons.Filled.Warning, contentDescription = "Campos vacíos", tint = PharmaError) },
                title = { Text(if (isEn) "Document Integrity Control" else "Control de Integridad Documental", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                text = { Text(alertMessage, fontSize = 13.sp) }
            )
        }

        // --- Add SOP Document Dialog ---
        if (showAddSopDialog) {
            AlertDialog(
                onDismissRequest = { showAddSopDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Add Regulated SOP Document" else "Añadir Documento SOP Regulado",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        item {
                            OutlinedTextField(
                                value = sopCode,
                                onValueChange = { sopCode = it },
                                label = { Text(if (isEn) "Document Code (e.g., SOP-GMP-003)" else "Código de Documento (ej: SOP-GMP-003)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = sopTitle,
                                onValueChange = { sopTitle = it },
                                label = { Text(if (isEn) "Procedure Title / Goal" else "Título del Procedimiento", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = sopVersion,
                                onValueChange = { sopVersion = it },
                                label = { Text(if (isEn) "Current Version (e.g., v1.0, v2.4)" else "Versión Actual (ej: v1.0, v2.4)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = sopEffectiveDate,
                                onValueChange = { sopEffectiveDate = it },
                                label = { Text(if (isEn) "Effective Date (YYYY-MM-DD)" else "Fecha de Vigencia (AAAA-MM-DD)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = sopApprovedBy,
                                onValueChange = { sopApprovedBy = it },
                                label = { Text(if (isEn) "Approved By (Technical QA Director)" else "Aprobado por (Director Técnico)", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        // Status chip selector
                        item {
                            Text(
                                text = if (isEn) "Validation Status" else "Estado de Validación",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                              ) {
                                sops.firstOrNull()?.let { _ ->
                                    sopStatuses.forEach { status ->
                                        val isSelected = sopStatus == status
                                        FilterChip(
                                            selected = isSelected,
                                            onClick = { sopStatus = status },
                                            label = { Text(status, fontSize = 11.sp) },
                                            colors = FilterChipDefaults.filterChipColors(
                                                selectedContainerColor = when (status) {
                                                    "Aprobado", "Approved" -> PharmaSuccess
                                                    "Borrador", "Draft" -> PharmaWarning
                                                    else -> PharmaError
                                                },
                                                selectedLabelColor = Color.White
                                            )
                                        )
                                    }
                                } ?: run {
                                    sopStatuses.forEach { status ->
                                        val isSelected = sopStatus == status
                                        FilterChip(
                                            selected = isSelected,
                                            onClick = { sopStatus = status },
                                            label = { Text(status, fontSize = 11.sp) },
                                            colors = FilterChipDefaults.filterChipColors(
                                                selectedContainerColor = when (status) {
                                                    "Aprobado", "Approved" -> PharmaSuccess
                                                    "Borrador", "Draft" -> PharmaWarning
                                                    else -> PharmaError
                                                },
                                                selectedLabelColor = Color.White
                                            )
                                        )
                                    }
                                }
                            }
                        }

                        item {
                            OutlinedTextField(
                                value = sopHistory,
                                onValueChange = { sopHistory = it },
                                label = { Text(if (isEn) "Revision and Change History / CAPAs" else "Historial de Cambios / Ajustes", fontSize = 12.sp) },
                                minLines = 2,
                                maxLines = 4,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val success = viewModel.agregarSOP(
                                code = sopCode,
                                title = sopTitle,
                                version = sopVersion,
                                status = sopStatus,
                                effectiveDate = sopEffectiveDate,
                                approvedBy = sopApprovedBy,
                                historyOfChanges = sopHistory
                            )
                            if (success) {
                                // Reset form state
                                sopCode = ""
                                sopTitle = ""
                                sopVersion = "v1.0"
                                sopStatus = if (isEn) "Approved" else "Aprobado"
                                sopApprovedBy = ""
                                sopHistory = ""
                                showAddSopDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PharmaSecondary)
                    ) {
                        Text(if (isEn) "Register SOP" else "Registrar SOP")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddSopDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }
    }
}

@Composable
fun SopListItem(
    sop: DocumentSOP,
    signedReadsCount: Int,
    isEn: Boolean,
    onClick: () -> Unit
) {
    val statusDisplay = if (isEn) {
        when (sop.status) {
            "Aprobado", "Approved" -> "Approved"
            "Borrador", "Draft" -> "Draft"
            "Obsoleto", "Obsolete" -> "Obsolete"
            else -> sop.status
        }
    } else {
        when (sop.status) {
            "Approved", "Aprobado" -> "Aprobado"
            "Draft", "Borrador" -> "Borrador"
            "Obsolete", "Obsoleto" -> "Obsoleto"
            else -> sop.status
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
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFD7E3FF) // Soft compliance blue
                    ) {
                        Text(
                            text = sop.code,
                            color = CleanSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = sop.version,
                        fontSize = 10.sp,
                        color = HintDark,
                        fontWeight = FontWeight.Bold
                    )
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = when (sop.status) {
                        "Aprobado", "Approved" -> Color(0xFFE9F1EA) // Soft green
                        "Borrador", "Draft" -> Color(0xFFFFF0D4) // Soft amber
                        else -> Color(0xFFFFDAD6) // Soft red
                    }
                ) {
                    Text(
                        text = statusDisplay,
                        color = when (sop.status) {
                            "Aprobado", "Approved" -> CleanSuccess
                            "Borrador", "Draft" -> Color(0xFF8A6000)
                            else -> CleanError
                        },
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = sop.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = if (isEn) {
                    "Effective from: ${sop.effectiveDate} • QA Approver: ${sop.approvedBy}"
                } else {
                    "Vigente desde: ${sop.effectiveDate} • Autorizador QA: ${sop.approvedBy}"
                },
                fontSize = 11.sp,
                color = HintDark
            )

            if (signedReadsCount > 0) {
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Filled.PeopleAlt, contentDescription = "Signed", tint = CleanPrimary, modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isEn) {
                            "$signedReadsCount workers fully trained & signed off"
                        } else {
                            "$signedReadsCount trabajadores capacitados y firmados"
                        },
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = CleanPrimary
                    )
                }
            }
        }
    }
}
