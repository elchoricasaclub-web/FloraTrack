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
import androidx.compose.material.icons.outlined.Checklist
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import android.widget.Toast
import com.example.data.model.AuditoriaCheck
import com.example.data.model.PrivateAiModelValidation
import com.example.data.model.PrivateAiDeploymentPlan
import com.example.ui.FloraViewModel
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun AuditoriasScreen(
    viewModel: FloraViewModel,
    modifier: Modifier = Modifier
) {
    val auditorias by viewModel.auditorias.collectAsState()
    val modelValidations by viewModel.modelValidations.collectAsState()
    val deploymentPlans by viewModel.deploymentPlans.collectAsState()
    val validationAlert by viewModel.validationAlert.collectAsState()
    val aiLoading by viewModel.aiLoading.collectAsState()
    val isAdmin by viewModel.isAdmin.collectAsState()

    val appLanguage by viewModel.appLanguage.collectAsState()
    val isEn = appLanguage == com.example.ui.AppLanguage.EN

    var selectedTab by remember { mutableStateOf(0) }

    var showAddAuditDialog by remember { mutableStateOf(false) }
    var showAddValidationDialog by remember { mutableStateOf(false) }
    var showAddDeploymentDialog by remember { mutableStateOf(false) }

    var selectedAuditDetails by remember { mutableStateOf<AuditoriaCheck?>(null) }

    // Form inputs: Audits
    var auditTitle by remember { mutableStateOf("") }
    var auditAuditor by remember { mutableStateOf("") }
    var auditStandard by remember { mutableStateOf("GACP") }
    var auditTotalItems by remember { mutableStateOf("10") }
    var auditPassedItems by remember { mutableStateOf("8") }
    var auditObservations by remember { mutableStateOf("") }

    val standards = listOf("GACP", "GMP", "EU-GMP")

    // Form inputs: Validation AI
    var valCode by remember { mutableStateOf("") }
    var valModelCode by remember { mutableStateOf("") }
    var valScope by remember { mutableStateOf("") }
    var valDataset by remember { mutableStateOf("") }
    var valCriteria by remember { mutableStateOf("") }
    var valLimitations by remember { mutableStateOf("") }
    var valDecision by remember { mutableStateOf(if (isEn) "Pending" else "Pendiente") }
    var valApprovedBy by remember { mutableStateOf("") }
    var valStatus by remember { mutableStateOf(if (isEn) "Draft" else "Borrador") }

    // Form inputs: Deployment Plan
    var depRole by remember { mutableStateOf("") }
    var depStatus by remember { mutableStateOf(if (isEn) "Planned" else "Planeado") }
    var depServer by remember { mutableStateOf("") }
    var depModelCode by remember { mutableStateOf("") }

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
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                    Text(
                        text = when (selectedTab) {
                            0 -> if (isEn) "Certifications (GACP/GMP)" else "Certificaciones (GACP/GMP)"
                            1 -> if (isEn) "Systems Certification" else "Sistemas y Certificación"
                            else -> if (isEn) "Deployments" else "Despliegue"
                        },
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = when (selectedTab) {
                            0 -> if (isEn) "On-site Field Certifications (Fully Offline Support)" else "Certificaciones en campo (Soporta trabajo Sin Conexión)"
                            1 -> if (isEn) "Systems validation under GAMP 5" else "Validación de sistemas según normas GAMP 5"
                            else -> if (isEn) "Model provisioning control" else "Control de aprovisionamiento de modelos"
                        },
                        fontSize = 11.sp,
                        color = HintDark
                    )
                }

                val buttonLabel = when (selectedTab) {
                    0 -> if (isEn) "New Certification" else "Nueva Certificación"
                    1 -> if (isEn) "New Validation" else "Nueva Validación"
                    else -> if (isEn) "New Plan" else "Nuevo Plan"
                }

                Button(
                    onClick = {
                        when (selectedTab) {
                            0 -> showAddAuditDialog = true
                            1 -> {
                                valDecision = if (isEn) "Pending" else "Pendiente"
                                valStatus = if (isEn) "Draft" else "Borrador"
                                showAddValidationDialog = true
                            }
                            2 -> {
                                depStatus = if (isEn) "Planned" else "Planeado"
                                showAddDeploymentDialog = true
                            }
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PharmaWarning)
                ) {
                    Icon(
                        imageVector = when (selectedTab) {
                            0 -> Icons.Filled.AssignmentTurnedIn
                            1 -> Icons.Filled.AppRegistration
                            else -> Icons.Filled.SettingsSystemDaydream
                        },
                        contentDescription = "Add Item",
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(buttonLabel, fontSize = 11.sp)
                }
            }

            // Sub navigation TabRow
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color.Transparent,
                contentColor = PharmaPrimary,
                modifier = Modifier.fillMaxWidth()
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text(if (isEn) "Certifications" else "Certificaciones", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    icon = { Icon(Icons.Filled.FactCheck, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text(if (isEn) "AI Validate" else "IA Validar", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    icon = { Icon(Icons.Filled.DeveloperMode, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text(if (isEn) "Deployments" else "Despliegues", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    icon = { Icon(Icons.Filled.Webhook, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            when (selectedTab) {
                0 -> {
                    // Expandable and scrollable Auditoria Details with Gemini integration
                    AnimatedVisibility(
                        visible = selectedAuditDetails != null,
                        enter = expandVertically() + fadeIn(),
                        exit = shrinkVertically() + fadeOut()
                    ) {
                        selectedAuditDetails?.let { audit ->
                            // Re-sync selected audit from State list in case AI report got filled
                            val refreshedAudit = auditorias.find { it.id == audit.id } ?: audit

                            Card(
                                colors = CardDefaults.cardColors(containerColor = PharmaWarning.copy(alpha = 0.05f)),
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
                                            Icon(imageVector = Icons.Filled.AutoAwesome, contentDescription = "Audit Details", tint = PharmaWarning)
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Text(
                                                text = refreshedAudit.title,
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = PharmaWarning
                                            )
                                        }
                                        Row {
                                            val context = LocalContext.current
                                            IconButton(onClick = {
                                                com.example.utils.PdfGeneratorHelper.generateGACPCompliancePDF(
                                                    context = context,
                                                    loteName = refreshedAudit.title,
                                                    actividadesCount = refreshedAudit.totalItems
                                                )
                                            }) {
                                                Icon(imageVector = Icons.Filled.PictureAsPdf, contentDescription = "Export PDF", tint = PharmaPrimary)
                                            }
                                            if (isAdmin) {
                                                IconButton(onClick = {
                                                    viewModel.eliminarAuditoria(refreshedAudit)
                                                    selectedAuditDetails = null
                                                }) {
                                                    Icon(imageVector = Icons.Filled.Delete, contentDescription = "Eliminar", tint = PharmaError)
                                                }
                                            }
                                            IconButton(onClick = { selectedAuditDetails = null }) {
                                                Icon(imageVector = Icons.Filled.Close, contentDescription = "Cerrar")
                                            }
                                        }
                                    }

                                    Divider(color = PharmaWarning.copy(alpha = 0.1f), modifier = Modifier.padding(bottom = 8.dp))

                                    Text(
                                        text = if (isEn) "Findings and Recorded Physical Observations:" else "Hallazgos y Observaciones Físicas registradas:",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HintDark
                                    )
                                    Text(
                                        text = refreshedAudit.observations,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    )

                                    // AI Review Area
                                    Text(
                                        text = if (isEn) "Flora AI: Audit & CAPA Assistant:" else "Flora AI: Asistente de Auditoría & CAPA:",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PharmaSecondary
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))

                                    if (aiLoading) {
                                        Column(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(12.dp),
                                            horizontalAlignment = Alignment.CenterHorizontally
                                        ) {
                                            CircularProgressIndicator(color = PharmaSecondary, modifier = Modifier.size(28.dp))
                                            Spacer(modifier = Modifier.height(8.dp))
                                            Text(
                                                text = if (isEn) "Flora AI is analyzing technical gaps against international sanitary standards..." else "Flora AI está analizando las brechas técnicas contra los estándares sanitarios internacionales...",
                                                fontSize = 11.sp,
                                                color = HintDark,
                                                textAlign = TextAlign.Center
                                            )
                                        }
                                    } else {
                                        if (refreshedAudit.aiReport.isNullOrEmpty()) {
                                            Column(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .padding(vertical = 8.dp),
                                                horizontalAlignment = Alignment.CenterHorizontally
                                            ) {
                                                Text(
                                                    text = if (isEn) "This audit has a pending AI analysis. Tap below to activate automated risk mapping." else "La auditoría tiene un análisis AI pendiente. Presione el botón de abajo para activar el mapeo de deficiencias y recomendaciones automáticas.",
                                                    fontSize = 11.sp,
                                                    color = HintDark,
                                                    textAlign = TextAlign.Center,
                                                    modifier = Modifier.padding(bottom = 8.dp)
                                                )
                                                Button(
                                                    onClick = { viewModel.analizarAuditoriaConIA(refreshedAudit) },
                                                    colors = ButtonDefaults.buttonColors(containerColor = PharmaSecondary),
                                                    shape = RoundedCornerShape(8.dp)
                                                ) {
                                                    Icon(imageVector = Icons.Filled.AutoAwesome, contentDescription = "Run AI", modifier = Modifier.size(14.dp))
                                                    Spacer(modifier = Modifier.width(6.dp))
                                                    Text(if (isEn) "Execute AI Audit" else "Ejecutar Auditoría AI", fontSize = 11.sp)
                                                }
                                            }
                                        } else {
                                            val context = LocalContext.current
                                            AuditoriaAIReportView(
                                                reportText = refreshedAudit.aiReport ?: "",
                                                appLanguage = appLanguage,
                                                onConvertActivity = { rec ->
                                                    val success = viewModel.registrarActividad(
                                                        lotId = 0,
                                                        type = "Limpieza",
                                                        details = "CAPA: $rec (Estándar ${refreshedAudit.standardType})",
                                                        inputUsed = "N/A",
                                                        quantity = "N/A",
                                                        responsible = refreshedAudit.auditorName.take(30),
                                                        signature = "AI-CAPA-Approved"
                                                    )
                                                    if (success) {
                                                        val msgToast = if (isEn) "CAPA recommendation scheduled in GACP activities!" else "¡Recomendación convertida y agendada en Actividades GACP!"
                                                        Toast.makeText(context, msgToast, Toast.LENGTH_LONG).show()
                                                    }
                                                }
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // List View Space
                    if (auditorias.isEmpty()) {
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
                                    imageVector = Icons.Outlined.Checklist,
                                    contentDescription = "No audits",
                                    tint = HintDark,
                                    modifier = Modifier.size(52.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = if (isEn) "No field certifications registered" else "No hay certificaciones o auditorías de campo registradas",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (isEn) "Add an internal GACP/GMP checklist to audit it against regulated standards with Flora AI diagnostics." else "Añada una lista de chequeo interna GACP/GMP para contrastarla contra estándares regulados con ayuda de Inteligencia Artificial.",
                                    fontSize = 12.sp,
                                    color = HintDark,
                                    textAlign = TextAlign.Center
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                val context = LocalContext.current
                                OutlinedButton(onClick = {
                                    com.example.utils.PdfGeneratorHelper.generateGACPCompliancePDF(
                                        context = context,
                                        loteName = "PLANILLA_VACIA_CAMPO_OFFLINE",
                                        actividadesCount = 0
                                    )
                                }) {
                                    Icon(imageVector = Icons.Filled.Print, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(if (isEn) "Download Blank Form for PC" else "Descargar Formato Vacío para PC (Campo)")
                                }
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(auditorias) { audit ->
                                AuditListItem(
                                    audit = audit,
                                    isEn = isEn,
                                    onClick = { selectedAuditDetails = audit }
                                )
                            }
                        }
                    }
                }

                1 -> {
                    // List View for Model Validations (PrivateAiModelValidation)
                    if (modelValidations.isEmpty()) {
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
                                    imageVector = Icons.Filled.DeveloperMode,
                                    contentDescription = "No validations",
                                    tint = HintDark,
                                    modifier = Modifier.size(52.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = if (isEn) "No model validations found" else "No hay validaciones de modelos",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (isEn) "Register technical validations of AI algorithms under GAMP 5 computerized system guidelines." else "Registre la validación técnica de sus algoritmos de IA de acuerdo a las pautas de Sistemas Computarizados (GAMP 5) y GACP.",
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
                            items(modelValidations) { valItem ->
                                ModelValidationListItem(
                                    validation = valItem,
                                    isEn = isEn,
                                    onDelete = { viewModel.eliminarModelValidation(valItem) }
                                )
                            }
                        }
                    }
                }

                2 -> {
                    // List View for Deployment Plans (PrivateAiDeploymentPlan)
                    if (deploymentPlans.isEmpty()) {
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
                                    imageVector = Icons.Filled.SettingsSystemDaydream,
                                    contentDescription = "No plans",
                                    tint = HintDark,
                                    modifier = Modifier.size(52.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = if (isEn) "No deployment plans found" else "No hay planes de despliegue",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (isEn) "Manage secure local edge AI deployments inside the greenhouse's isolated server room." else "Gestione los despliegues controlados de IA en sus nodos y servidores locales seguros dentro de la red del invernadero.",
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
                            items(deploymentPlans) { planItem ->
                                DeploymentPlanListItem(
                                    plan = planItem,
                                    isEn = isEn,
                                    onDelete = { viewModel.eliminarDeploymentPlan(planItem) }
                                )
                            }
                        }
                    }
                }
            }
        }

        // --- Validation Alter banner popup ---
        validationAlert?.let { alertMessage ->
            AlertDialog(
                onDismissRequest = { viewModel.clearValidationAlert() },
                confirmButton = {
                    Button(onClick = { viewModel.clearValidationAlert() }) {
                        Text(if (isEn) "Review" else "Revisar")
                    }
                },
                icon = { Icon(Icons.Filled.Warning, contentDescription = "Campos vacíos", tint = PharmaError) },
                title = { Text(if (isEn) "Mandatory Fields Missing" else "Faltan Datos Obligatorios", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                text = { Text(alertMessage, fontSize = 13.sp) }
            )
        }

        // --- Add Audit Dialog Sheet ---
        if (showAddAuditDialog) {
            AlertDialog(
                onDismissRequest = { showAddAuditDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Record Field Certification / Audit" else "Registrar Certificación en Campo (GACP/GMP)",
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
                                value = auditTitle,
                                onValueChange = { auditTitle = it },
                                label = { Text(if (isEn) "Certification Label / Area" else "Título de Certificación / Zona", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            OutlinedTextField(
                                value = auditAuditor,
                                onValueChange = { auditAuditor = it },
                                label = { Text(if (isEn) "Technical Auditor / Inspector Name" else "Auditor / Inspector Responsable", fontSize = 12.sp) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        // Standard picker chips
                        item {
                            Text(
                                text = if (isEn) "Standard Guide / Certification Type" else "Estándar o Guía de Certificación",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = HintDark
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                standards.forEach { std ->
                                    val isSelected = auditStandard == std
                                    FilterChip(
                                        selected = isSelected,
                                        onClick = { auditStandard = std },
                                        label = { Text(std, fontSize = 11.sp) },
                                        colors = FilterChipDefaults.filterChipColors(
                                            selectedContainerColor = PharmaWarning,
                                            selectedLabelColor = Color.White
                                        )
                                    )
                                }
                            }
                        }

                        // Compliance counters
                        item {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = auditTotalItems,
                                    onValueChange = { auditTotalItems = it },
                                    label = { Text(if (isEn) "Evaluated Items" else "Total Ítems Evaluados", fontSize = 11.sp) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Next),
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedTextField(
                                    value = auditPassedItems,
                                    onValueChange = { auditPassedItems = it },
                                    label = { Text(if (isEn) "Compliant Items" else "Ítems Conformidades", fontSize = 11.sp) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Done),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }

                        item {
                            OutlinedTextField(
                                value = auditObservations,
                                onValueChange = { auditObservations = it },
                                label = { Text(if (isEn) "Critical Observations and Deviations" else "Observaciones y Desviaciones Críticas", fontSize = 12.sp) },
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
                            val totalNum = auditTotalItems.toIntOrNull() ?: 0
                            val passedNum = auditPassedItems.toIntOrNull() ?: 0

                            val success = viewModel.crearAuditoria(
                                title = auditTitle,
                                auditorName = auditAuditor,
                                standardType = auditStandard,
                                totalItems = totalNum,
                                passedItems = passedNum,
                                observations = auditObservations
                            )
                            if (success) {
                                // Reset form
                                auditTitle = ""
                                auditAuditor = ""
                                auditStandard = "GACP"
                                auditTotalItems = "10"
                                auditPassedItems = "8"
                                auditObservations = ""
                                showAddAuditDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PharmaWarning)
                    ) {
                        Text(if (isEn) "Create Audit" else "Crear Auditoría")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddAuditDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }

        // --- Add Validation Dialog Sheet ---
        if (showAddValidationDialog) {
            AlertDialog(
                onDismissRequest = { showAddValidationDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Register AI Validation (GAMP 5)" else "Registrar Validación de IA (GAMP 5)",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        item {
                            OutlinedTextField(
                                value = valCode,
                                onValueChange = { valCode = it },
                                label = { Text(if (isEn) "Validation Code (e.g., VAL-AI-011)" else "Código de Validación (ej. VAL-AI-011)", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valModelCode,
                                onValueChange = { valModelCode = it },
                                label = { Text(if (isEn) "Model ID / Version Code" else "ID / Código del Modelo", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valScope,
                                onValueChange = { valScope = it },
                                label = { Text(if (isEn) "Validation Scope / Purpose" else "Alcance de Validación", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valDataset,
                                onValueChange = { valDataset = it },
                                label = { Text(if (isEn) "Test Dataset (Images / Samples)" else "Set de Datos de Prueba (Imágenes / Muestras)", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valCriteria,
                                onValueChange = { valCriteria = it },
                                label = { Text(if (isEn) "Acceptance Criteria (e.g., F1 > 95%)" else "Criterios de Aceptación (ej. F1 > 95%)", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valLimitations,
                                onValueChange = { valLimitations = it },
                                label = { Text(if (isEn) "Model Limitations / Warnings" else "Limitaciones / Advertencias del Modelo", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = valApprovedBy,
                                onValueChange = { valApprovedBy = it },
                                label = { Text(if (isEn) "Approving QE Engineer Signature" else "Autor de Aprobación (Firma)", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            Text(if (isEn) "Validation Status" else "Estado de Validación", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HintDark)
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                (if (isEn) listOf("Pending", "Approved", "Rejected") else listOf("Pendiente", "Aprobado", "Rechazado")).forEach { decision ->
                                    val isSelected = valDecision == decision
                                    FilterChip(
                                        selected = isSelected,
                                        onClick = { valDecision = decision },
                                        label = { Text(decision, fontSize = 10.sp) },
                                        colors = FilterChipDefaults.filterChipColors(
                                            selectedContainerColor = PharmaWarning,
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
                            var dbDecision = valDecision
                            if (isEn) {
                                dbDecision = when (valDecision) {
                                    "Pending" -> "Pendiente"
                                    "Approved" -> "Aprobado"
                                    "Rejected" -> "Rechazado"
                                    else -> valDecision
                                }
                            }
                            val success = viewModel.agregarModelValidation(
                                code = valCode,
                                modelCode = valModelCode,
                                validationScope = valScope,
                                testDataset = valDataset,
                                acceptanceCriteria = valCriteria,
                                limitations = valLimitations,
                                approvalDecision = dbDecision,
                                approvedBy = valApprovedBy.ifBlank { null },
                                status = if (isEn) "Draft" else "Borrador"
                            )
                            if (success) {
                                valCode = ""
                                valModelCode = ""
                                valScope = ""
                                valDataset = ""
                                valCriteria = ""
                                valLimitations = ""
                                valApprovedBy = ""
                                valDecision = if (isEn) "Pending" else "Pendiente"
                                showAddValidationDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PharmaWarning)
                    ) {
                        Text(if (isEn) "Record Validation" else "Registrar Validación")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddValidationDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }

        // --- Add Deployment Dialog Sheet ---
        if (showAddDeploymentDialog) {
            AlertDialog(
                onDismissRequest = { showAddDeploymentDialog = false },
                title = {
                    Text(
                        text = if (isEn) "Register Regulated Deployment Plan" else "Registrar Plan de Despliegue Regulado",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    LazyColumn(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        item {
                            OutlinedTextField(
                                value = depRole,
                                onValueChange = { depRole = it },
                                label = { Text(if (isEn) "Responsible Role (e.g., Technical Director)" else "Rol Responsable (ej. Jefe de Calidad)", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = depModelCode,
                                onValueChange = { depModelCode = it },
                                label = { Text(if (isEn) "Related Approved AI Model" else "Modelo Validado Relacionado", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            OutlinedTextField(
                                value = depServer,
                                onValueChange = { depServer = it },
                                label = { Text(if (isEn) "Local Server Hostname / Private Node" else "Servidor Local / Nodo Target", fontSize = 11.sp) },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                        item {
                            Text(if (isEn) "Deployment Status" else "Estado del Despliegue", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = HintDark)
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                (if (isEn) listOf("Planned", "In Progress", "Certified") else listOf("Planeado", "En Progreso", "Certificado")).forEach { statusVal ->
                                    val isSelected = depStatus == statusVal
                                    FilterChip(
                                        selected = isSelected,
                                        onClick = { depStatus = statusVal },
                                        label = { Text(statusVal, fontSize = 10.sp) },
                                        colors = FilterChipDefaults.filterChipColors(
                                            selectedContainerColor = PharmaWarning,
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
                            var dbStatus = depStatus
                            if (isEn) {
                                dbStatus = when (depStatus) {
                                    "Planned" -> "Planeado"
                                    "In Progress" -> "En Progreso"
                                    "Certified" -> "Certificado"
                                    else -> depStatus
                                }
                            }
                            val success = viewModel.agregarDeploymentPlan(
                                ownerRole = depRole,
                                status = dbStatus,
                                targetServer = depServer,
                                modelApplied = depModelCode
                            )
                            if (success) {
                                depRole = ""
                                depStatus = if (isEn) "Planned" else "Planeado"
                                depServer = ""
                                depModelCode = ""
                                showAddDeploymentDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PharmaWarning)
                    ) {
                        Text(if (isEn) "Register Deployment" else "Registrar Despliegue")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddDeploymentDialog = false }) {
                        Text(if (isEn) "Cancel" else "Cancelar")
                    }
                }
            )
        }
    }
}

@Composable
fun ModelValidationListItem(
    validation: PrivateAiModelValidation,
    isEn: Boolean,
    onDelete: () -> Unit
) {
    val decisionDisplay = if (isEn) {
        when (validation.approvalDecision) {
            "Aprobado" -> "Approved"
            "Pendiente" -> "Pending"
            "Rechazado" -> "Rejected"
            else -> validation.approvalDecision
        }
    } else {
        when (validation.approvalDecision) {
            "Approved" -> "Aprobado"
            "Pending" -> "Pendiente"
            "Rejected" -> "Rechazado"
            else -> validation.approvalDecision
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        modifier = Modifier.fillMaxWidth()
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
                        color = PharmaPrimary.copy(alpha = 0.08f)
                    ) {
                        Text(
                            text = validation.code,
                            color = PharmaPrimary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFE9F1EA)
                    ) {
                        Text(
                            text = if (isEn && validation.status == "Borrador") "DRAFT" else validation.status.uppercase(),
                            color = CleanSuccess,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }

                IconButton(
                    onClick = onDelete,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Delete,
                        contentDescription = "Eliminar",
                        tint = PharmaError.copy(alpha = 0.7f),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${if (isEn) "Model ID" else "ID Modelo"}: ${validation.modelCode}",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${if (isEn) "Scope" else "Alcance"}: ${validation.validationScope}",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(8.dp))

            Divider(color = BorderColor.copy(alpha = 0.5f))

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(if (isEn) "Dataset" else "Set de Datos", fontSize = 9.sp, color = HintDark, fontWeight = FontWeight.Bold)
                    Text(validation.testDataset, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text(if (isEn) "Acceptance Criteria" else "Criterio de Aceptación", fontSize = 9.sp, color = HintDark, fontWeight = FontWeight.Bold)
                    Text(validation.acceptanceCriteria, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface)
                }
            }

            if (validation.limitations.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFFECEB),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "${if (isEn) "Limitation" else "Limitación"}: ${validation.limitations}",
                        color = Color(0xFF601410),
                        fontSize = 10.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = if (validation.approvalDecision == "Aprobado") Icons.Filled.CheckCircle else Icons.Filled.Pending,
                    contentDescription = null,
                    tint = if (validation.approvalDecision == "Aprobado") CleanSuccess else CleanWarning,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "${if (isEn) "Decision" else "Decisión"}: $decisionDisplay" + if (validation.approvedBy != null) " (${if (isEn) "by" else "por"} ${validation.approvedBy})" else "",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (validation.approvalDecision == "Aprobado") CleanSuccess else CleanWarning
                )
            }
        }
    }
}

@Composable
fun DeploymentPlanListItem(
    plan: PrivateAiDeploymentPlan,
    isEn: Boolean,
    onDelete: () -> Unit
) {
    val statusDisplay = if (isEn) {
        when (plan.status) {
            "Certificado" -> "Certified"
            "En Progreso" -> "In Progress"
            "Planeado" -> "Planned"
            else -> plan.status
        }
    } else {
        when (plan.status) {
            "Certified" -> "Certificado"
            "In Progress" -> "En Progreso"
            "Planned" -> "Planeado"
            else -> plan.status
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.FilterFrames,
                        contentDescription = null,
                        tint = PharmaSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isEn) "SECURE EDGE SERVICE" else "SERVICIO SEGURO EDGE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = PharmaSecondary
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = when(plan.status) {
                            "Certificado", "Certified" -> Color(0xFFE9F1EA)
                            "En Progreso", "In Progress" -> Color(0xFFFFF0D4)
                            else -> Color(0xFFF2F2F2)
                        }
                    ) {
                        Text(
                            text = statusDisplay.uppercase(),
                            color = when(plan.status) {
                                "Certificado", "Certified" -> CleanSuccess
                                "En Progreso", "In Progress" -> Color(0xFF8A6000)
                                else -> HintDark
                            },
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Delete,
                            contentDescription = "Eliminar",
                            tint = PharmaError.copy(alpha = 0.7f),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "${if (isEn) "Responsible Role" else "Rol Responsable"}: ${plan.ownerRole}",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${if (isEn) "Validated Model" else "Modelo Validado"}: ${plan.modelApplied}",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = CleanPrimary
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${if (isEn) "Private Network Node" else "Nodo de Red Privada"}: ${plan.targetServer}",
                fontSize = 11.sp,
                color = HintDark
            )

            Spacer(modifier = Modifier.height(8.dp))
            val dateStr = SimpleDateFormat("dd MMM, yyyy • HH:mm", Locale(if (isEn) "en" else "es", if (isEn) "US" else "ES")).format(Date(plan.createdAt))
            Text(
                text = "${if (isEn) "Created" else "Creado"}: $dateStr",
                fontSize = 9.sp,
                color = HintDark
            )
        }
    }
}

@Composable
fun AuditListItem(
    audit: AuditoriaCheck,
    isEn: Boolean,
    onClick: () -> Unit
) {
    val dateStr = SimpleDateFormat("dd MMM, yyyy", Locale(if (isEn) "en" else "es", if (isEn) "US" else "ES")).format(Date(audit.date))
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
                        color = Color(0xFFE9F1EA) // Soft Sage
                    ) {
                        Text(
                            text = audit.standardType,
                            color = CleanPrimary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }

                    if (!audit.aiReport.isNullOrEmpty()) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFD7E3FF) // Soft compliance blue
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(imageVector = Icons.Filled.AutoAwesome, contentDescription = "Checked AI", tint = CleanPrimary, modifier = Modifier.size(10.dp))
                                Spacer(modifier = Modifier.width(2.dp))
                                Text("Flora AI", color = CleanSecondary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }

                val statusDisplay = if (isEn) {
                    if (audit.status == "Abierto") "Open" else "Closed"
                } else {
                    if (audit.status == "Closed") "Cerrado" else "Abierto"
                }

                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (audit.status == "Abierto" || audit.status == "Open") Color(0xFFFFF0D4) else Color(0xFFE9F1EA)
                ) {
                    Text(
                        text = statusDisplay.uppercase(),
                        color = if (audit.status == "Abierto" || audit.status == "Open") Color(0xFF8A6000) else CleanSuccess,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = audit.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${if (isEn) "Auditor" else "Auditor"}: ${audit.auditorName} • ${if (isEn) "Date" else "Fecha"}: $dateStr",
                fontSize = 11.sp,
                color = HintDark
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Score Progress Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                LinearProgressIndicator(
                    progress = { audit.score / 100f },
                    color = if (audit.score >= 90) CleanSuccess else if (audit.score >= 75) CleanWarning else CleanError,
                    trackColor = Color.LightGray.copy(alpha = 0.25f),
                    modifier = Modifier
                        .weight(1f)
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp))
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "${audit.passedItems}/${audit.totalItems} (${audit.score}%)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = if (audit.score >= 90) CleanSuccess else if (audit.score >= 75) CleanWarning else CleanError
                )
            }
        }
    }
}

data class ParsedAIReport(
    val riskLevel: String,
    val gapAnalysis: String,
    val recommendations: List<String>
)

fun parseAIReport(reportText: String?): ParsedAIReport {
    if (reportText.isNullOrEmpty()) {
        return ParsedAIReport("Desconocido", "", emptyList())
    }

    var riskLevel = "Desconocido"
    var gapAnalysis = ""
    val recommendations = mutableListOf<String>()

    val lines = reportText.lines()
    var currentSection = 0 // 1 = Risk, 2 = Gaps, 3 = Recommendations

    for (line in lines) {
        val trimmed = line.trim()
        if (trimmed.isEmpty() || trimmed.startsWith("FLORA AI REPORT") || trimmed.contains("DEMO MODE") || trimmed.contains("API Key")) continue

        val upper = trimmed.uppercase()
        // Section detection
        if (upper.contains("CLASIFICACIÓN") || upper.contains("CLASIFICACION") || (upper.contains("RIESGO") && (upper.contains("BAJO") || upper.contains("MEDIO") || upper.contains("ALTO")))) {
            currentSection = 1
            if (upper.contains("ALTO") || upper.contains("HIGH")) {
                riskLevel = "Alto"
            } else if (upper.contains("MEDIO") || upper.contains("MEDIUM")) {
                riskLevel = "Medio"
            } else if (upper.contains("BAJO") || upper.contains("LOW")) {
                riskLevel = "Bajo"
            }
            continue
        } else if (upper.contains("ANÁLISIS DE BRECHAS") || upper.contains("ANALISIS DE BRECHAS") || upper.contains("BRECHAS:")) {
            currentSection = 2
            continue
        } else if (upper.contains("RECOMENDACI") || upper.contains("ACCIONES CORRECTIVAS") || upper.contains("CAPA") || upper.contains("RECOMENDACIÓN")) {
            currentSection = 3
            continue
        }

        // Processing content
        when (currentSection) {
            1 -> {
                if (upper.contains("ALTO") || upper.contains("HIGH")) {
                    riskLevel = "Alto"
                } else if (upper.contains("MEDIO") || upper.contains("MEDIUM")) {
                    riskLevel = "Medio"
                } else if (upper.contains("BAJO") || upper.contains("LOW")) {
                    riskLevel = "Bajo"
                }
            }
            2 -> {
                gapAnalysis += (if (gapAnalysis.isEmpty()) "" else "\n") + trimmed
            }
            3 -> {
                val bulletCleaned = trimmed.replaceFirst(Regex("^[-*•\\d.\\s]+"), "").trim()
                if (bulletCleaned.isNotEmpty()) {
                    recommendations.add(bulletCleaned)
                }
            }
            else -> {
                // If we haven't hit a section yet, collect it as general analysis text
                gapAnalysis += (if (gapAnalysis.isEmpty()) "" else "\n") + trimmed
            }
        }
    }

    // Secondary parsing for risk if still unknown
    if (riskLevel == "Desconocido") {
        val upperAll = reportText.uppercase()
        if (upperAll.contains("RIESGO: ALTO") || upperAll.contains("RIESGO ALTO")) {
            riskLevel = "Alto"
        } else if (upperAll.contains("RIESGO: MEDIO") || upperAll.contains("RIESGO MEDIO")) {
            riskLevel = "Medio"
        } else if (upperAll.contains("RIESGO: BAJO") || upperAll.contains("RIESGO BAJO")) {
            riskLevel = "Bajo"
        }
    }

    // Fallbacks if formatting is different or sections are absent
    if (gapAnalysis.isEmpty()) {
        gapAnalysis = reportText
    }

    return ParsedAIReport(riskLevel, gapAnalysis, recommendations)
}

@Composable
fun AuditoriaAIReportView(
    reportText: String,
    appLanguage: com.example.ui.AppLanguage,
    onConvertActivity: (String) -> Unit
) {
    val isEn = appLanguage == com.example.ui.AppLanguage.EN
    val parsed = remember(reportText) { parseAIReport(reportText) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // AI Header Row
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = Icons.Filled.AutoAwesome,
                contentDescription = null,
                tint = PharmaSecondary,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = if (isEn) "Flora AI Diagnostic Report" else "Reporte de Diagnóstico Flora AI",
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = PharmaSecondary
            )

            Spacer(modifier = Modifier.weight(1f))

            // Risk level Badge with elegant colors
            val (badgeColor, textColor) = when (parsed.riskLevel) {
                "Alto" -> Color(0xFFFFDAD9) to Color(0xFF410002)
                "Medio" -> Color(0xFFFFDEA9) to Color(0xFF4C2A00)
                "Bajo" -> Color(0xFFD4EAD6) to Color(0xFF0F3814)
                else -> Color(0xFFE2E2E6) to Color(0xFF1A1C1E)
            }

            val riskLabel = if (isEn) {
                when (parsed.riskLevel) {
                    "Alto" -> "HIGH"
                    "Medio" -> "MEDIUM"
                    "Bajo" -> "LOW"
                    else -> "UNKNOWN"
                }
            } else {
                parsed.riskLevel.uppercase()
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = badgeColor,
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text(
                    text = "${if (isEn) "RISK" else "RIESGO"}: $riskLabel",
                    color = textColor,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        // GAP ANALYSIS BOX
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.Assessment,
                        contentDescription = null,
                        tint = CleanPrimary,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isEn) "Regulated Gap Analysis" else "Análisis de Brechas Reguladas",
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        color = CleanPrimary
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = parsed.gapAnalysis.trim(),
                    fontSize = 11.sp,
                    lineHeight = 15.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        // REC LIST (CAPA Actions)
        if (parsed.recommendations.isNotEmpty()) {
            Text(
                text = if (isEn) "Suggested Corrective Action Plans (CAPA):" else "Planes de Acción Correctiva CAPA Sugeridos (Accionables):",
                fontWeight = FontWeight.Bold,
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.padding(top = 4.dp)
            )

            parsed.recommendations.forEach { rec ->
                var isChecked by remember(rec) { mutableStateOf(false) }

                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = if (isChecked) Color(0xFFE9F1EA) else MaterialTheme.colorScheme.surface,
                    border = androidx.compose.foundation.BorderStroke(
                        width = 1.dp,
                        color = if (isChecked) CleanSuccess.copy(alpha = 0.5f) else BorderColor
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { isChecked = !isChecked }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = isChecked,
                            onCheckedChange = { isChecked = it },
                            colors = CheckboxDefaults.colors(
                                checkedColor = CleanSuccess,
                                uncheckedColor = HintDark
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = rec,
                                fontSize = 11.sp,
                                lineHeight = 15.sp,
                                color = if (isChecked) HintDark else MaterialTheme.colorScheme.onSurface,
                                style = androidx.compose.ui.text.TextStyle(
                                    textDecoration = if (isChecked) androidx.compose.ui.text.style.TextDecoration.LineThrough else null
                                )
                            )
                        }

                        if (!isChecked) {
                            Spacer(modifier = Modifier.width(6.dp))
                            IconButton(
                                onClick = { onConvertActivity(rec) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.AddCircle,
                                    contentDescription = if (isEn) "Schedule CAPA Activity" else "Agendar Actividad CAPA",
                                    tint = PharmaSecondary,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
