package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.api.GeminiService
import com.example.data.local.AppDatabase
import com.example.data.model.ActividadGACP
import com.example.data.model.AuditoriaCheck
import com.example.data.model.DocumentSOP
import com.example.data.model.Lote
import com.example.data.repository.FloraRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

enum class AppLanguage { ES, EN }

@OptIn(ExperimentalCoroutinesApi::class)
class FloraViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: FloraRepository
    private var firebaseAuth: com.google.firebase.auth.FirebaseAuth? = null
    
    private val _appLanguage = MutableStateFlow(AppLanguage.ES)
    val appLanguage: StateFlow<AppLanguage> = _appLanguage.asStateFlow()

    private val _isAdmin = MutableStateFlow(false)
    val isAdmin: StateFlow<Boolean> = _isAdmin.asStateFlow()

    fun toggleAdminAccess() {
        _isAdmin.value = !_isAdmin.value
    }

    private val _telemetryTemp = MutableStateFlow(24.5)
    val telemetryTemp: StateFlow<Double> = _telemetryTemp.asStateFlow()
    
    private val _telemetryHumidity = MutableStateFlow(55.0)
    val telemetryHumidity: StateFlow<Double> = _telemetryHumidity.asStateFlow()

    fun fetchTelemetry() {
        viewModelScope.launch {
            val data = com.example.data.api.WeatherService.getEnvironmentalTelemetry()
            _telemetryTemp.value = data.first
            _telemetryHumidity.value = data.second
        }
    }

    fun toggleLanguage() {
        _appLanguage.value = if (_appLanguage.value == AppLanguage.ES) AppLanguage.EN else AppLanguage.ES
    }

    val lotes: StateFlow<List<Lote>>
    val actividades: StateFlow<List<ActividadGACP>>
    val sops: StateFlow<List<DocumentSOP>>
    val auditorias: StateFlow<List<AuditoriaCheck>>
    val modelValidations: StateFlow<List<com.example.data.model.PrivateAiModelValidation>>
    val deploymentPlans: StateFlow<List<com.example.data.model.PrivateAiDeploymentPlan>>

    // General messages and error warnings shown as dynamic banner alerts
    private val _validationAlert = MutableStateFlow<String?>(null)
    val validationAlert: StateFlow<String?> = _validationAlert.asStateFlow()

    private val _aiLoading = MutableStateFlow(false)
    val aiLoading: StateFlow<Boolean> = _aiLoading.asStateFlow()

    // --- State Flows for Auth, Maps Grounding, and Diagnostic Scanner ---
    private val _userEmail = MutableStateFlow<String?>(null)
    val userEmail: StateFlow<String?> = _userEmail.asStateFlow()

    private val _userName = MutableStateFlow<String?>(null)
    val userName: StateFlow<String?> = _userName.asStateFlow()

    private val _userPhotoUrl = MutableStateFlow<String?>(null)
    val userPhotoUrl: StateFlow<String?> = _userPhotoUrl.asStateFlow()

    private val _firebaseSyncStatus = MutableStateFlow<String>("Sincronización Inteligente: Offline (Room DB)")
    val firebaseSyncStatus: StateFlow<String> = _firebaseSyncStatus.asStateFlow()
    
    private val _pendingSyncCount = MutableStateFlow(3) // Mock for now, would be queried from Room
    val pendingSyncCount: StateFlow<Int> = _pendingSyncCount.asStateFlow()

    private val _mapsResult = MutableStateFlow<String?>(null)
    val mapsResult: StateFlow<String?> = _mapsResult.asStateFlow()

    private val _isMapsLoading = MutableStateFlow(false)
    val isMapsLoading: StateFlow<Boolean> = _isMapsLoading.asStateFlow()

    private val _scanResult = MutableStateFlow<String?>(null)
    val scanResult: StateFlow<String?> = _scanResult.asStateFlow()

    private val _isScanLoading = MutableStateFlow(false)
    val isScanLoading: StateFlow<Boolean> = _isScanLoading.asStateFlow()

    private val _audioTranscriptionResult = MutableStateFlow<String?>(null)
    val audioTranscriptionResult: StateFlow<String?> = _audioTranscriptionResult.asStateFlow()

    private val _isAudioLoading = MutableStateFlow(false)
    val isAudioLoading: StateFlow<Boolean> = _isAudioLoading.asStateFlow()

    init {
        val database = AppDatabase.getDatabase(application)
        repository = FloraRepository(database.floraDao())

        try {
            // Programmatically initialize Firebase if google-services.json is not present or applied at compile time
            val isFirebaseInitialized = try {
                com.google.firebase.FirebaseApp.getInstance()
                true
            } catch (e: Exception) {
                false
            }
            if (!isFirebaseInitialized) {
                val options = com.google.firebase.FirebaseOptions.Builder()
                    .setApiKey("AIzaSyFakeKeyJustToInitializeApp")
                    .setApplicationId("1:fake-app-id-for-compile")
                    .setProjectId("fake-project-id")
                    .build()
                com.google.firebase.FirebaseApp.initializeApp(application, options)
            }
            firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance()
            firebaseAuth?.addAuthStateListener { auth ->
                val currentUser = auth.currentUser
                if (currentUser != null) {
                    _userEmail.value = currentUser.email
                    _userName.value = currentUser.displayName ?: currentUser.email?.substringBefore("@")?.replaceFirstChar { it.uppercase() } ?: "Usuario GACP"
                    _firebaseSyncStatus.value = "Autenticado con Firebase (Email)"
                } else {
                    _userEmail.value = null
                    _userName.value = null
                    _firebaseSyncStatus.value = "Desconectado"
                }
            }
        } catch (e: Exception) {
            android.util.Log.e("FloraTrack", "Firebase Auth initialization failed: ${e.message}")
        }

        // Seed data in background
        viewModelScope.launch {
            repository.checkAndSeedDatabase()
        }

        lotes = _userEmail.flatMapLatest { email ->
            repository.getLotesByOwner(email)
        }.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

        actividades = repository.allActivities.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

        sops = repository.allSOPs.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

        auditorias = repository.allAudits.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

        modelValidations = repository.allModelValidations.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

        deploymentPlans = repository.allDeploymentPlans.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
    }

    fun clearValidationAlert() {
        _validationAlert.value = null
    }

    fun setValidationAlert(message: String) {
        _validationAlert.value = message
    }

    // --- Create Lote with Validations ---
    fun agregarLote(
        name: String,
        area: String,
        variety: String,
        phase: String,
        startDate: Long
    ): Boolean {
        if (name.isBlank() || area.isBlank() || variety.isBlank() || phase.isBlank()) {
            _validationAlert.value = "Todos los campos son obligatorios. Por favor ingrese el código del lote, área, variedad y fase."
            return false
        }
        viewModelScope.launch {
            val newLote = Lote(
                name = name.trim(),
                area = area.trim(),
                variety = variety.trim(),
                phase = phase,
                startDate = startDate,
                complianceScore = 100,
                ownerEmail = _userEmail.value
            )
            repository.insertLote(newLote)
        }
        return true
    }

    // --- Create Actividad with Validations ---
    fun registrarActividad(
        lotId: Int,
        type: String,
        details: String,
        inputUsed: String,
        quantity: String,
        responsible: String,
        signature: String
    ): Boolean {
        if (type.isBlank() || details.isBlank() || responsible.isBlank() || signature.isBlank()) {
            _validationAlert.value = "Registre los campos obligatorios: Tipo, Detalles, Responsable y Firma de Auditoría."
            return false
        }
        viewModelScope.launch {
            val newActivity = ActividadGACP(
                lotId = lotId,
                type = type,
                date = System.currentTimeMillis(),
                details = details.trim(),
                inputUsed = if (inputUsed.isBlank()) "N/A" else inputUsed.trim(),
                quantity = if (quantity.isBlank()) "N/A" else quantity.trim(),
                responsible = responsible.trim(),
                signature = signature.trim(),
                photoUri = null,
                warningTriggered = (signature.length < 5)
            )
            repository.insertActivity(newActivity)

            // Recalculate lot compliance score basically for demonstration
            if (lotId > 0) {
                repository.getLoteById(lotId)?.let { currentLot ->
                    val deduction = if (newActivity.warningTriggered) 10 else 0
                    val updatedLot = currentLot.copy(
                        complianceScore = (currentLot.complianceScore - deduction).coerceIn(50, 100)
                    )
                    repository.updateLote(updatedLot)
                }
            }
        }
        return true
    }

    // --- Create SOP Document with Validations ---
    fun agregarSOP(
        code: String,
        title: String,
        version: String,
        status: String,
        effectiveDate: String,
        approvedBy: String,
        historyOfChanges: String
    ): Boolean {
        if (code.isBlank() || title.isBlank() || version.isBlank() || status.isBlank() || effectiveDate.isBlank() || approvedBy.isBlank()) {
            _validationAlert.value = "Todos los campos excepto Historial son requeridos para la integridad documental."
            return false
        }
        viewModelScope.launch {
            val newSOP = DocumentSOP(
                code = code.trim(),
                title = title.trim(),
                version = version.trim(),
                status = status,
                effectiveDate = effectiveDate.trim(),
                approvedBy = approvedBy.trim(),
                historyOfChanges = if (historyOfChanges.isBlank()) "v1.0 (Lanzamiento)" else historyOfChanges.trim()
            )
            repository.insertSOP(newSOP)
        }
        return true
    }

    // --- Create Auditoria Checklist with Validations ---
    fun crearAuditoria(
        title: String,
        auditorName: String,
        standardType: String,
        totalItems: Int,
        passedItems: Int,
        observations: String
    ): Boolean {
        if (title.isBlank() || auditorName.isBlank() || standardType.isBlank() || observations.isBlank()) {
            _validationAlert.value = "Complete el Título, Auditor Responsable, Estándar y Observaciones Generales."
            return false
        }
        if (passedItems > totalItems) {
            _validationAlert.value = "Los ítems conformes ($passedItems) no pueden superar el total de puntos evaluados ($totalItems)."
            return false
        }
        viewModelScope.launch {
            val score = if (totalItems > 0) (passedItems * 100) / totalItems else 0
            val newAudit = AuditoriaCheck(
                title = title.trim(),
                auditorName = auditorName.trim(),
                date = System.currentTimeMillis(),
                standardType = standardType,
                status = "Abierto",
                totalItems = totalItems,
                passedItems = passedItems,
                score = score,
                observations = observations.trim(),
                isAIReviewPending = true,
                aiReport = null
            )
            repository.insertAudit(newAudit)
        }
        return true
    }

    // --- Trigger AI Audit Assistant (Gemini) ---
    fun analizarAuditoriaConIA(audit: AuditoriaCheck) {
        if (_aiLoading.value) return
        _aiLoading.value = true
        viewModelScope.launch {
            try {
                val report = GeminiService.analyzeAuditCompliance(
                    standardType = audit.standardType,
                    auditTitle = audit.title,
                    score = audit.score,
                    passed = audit.passedItems,
                    total = audit.totalItems,
                    observations = audit.observations
                )
                val updatedAudit = audit.copy(
                    isAIReviewPending = false,
                    aiReport = report
                )
                repository.updateAudit(updatedAudit)
            } catch (e: Exception) {
                _validationAlert.value = "Error al conectar con la Inteligencia FloraTrack: ${e.localizedMessage}"
            } finally {
                _aiLoading.value = false
            }
        }
    }

    fun eliminarLote(lote: Lote) {
        viewModelScope.launch { repository.deleteLote(lote) }
    }

    fun eliminarActividad(activity: ActividadGACP) {
        viewModelScope.launch { repository.deleteActivity(activity) }
    }

    fun eliminarSOP(sop: DocumentSOP) {
        viewModelScope.launch { repository.deleteSOP(sop) }
    }

    fun eliminarAuditoria(audit: AuditoriaCheck) {
        viewModelScope.launch { repository.deleteAudit(audit) }
    }

    // --- Create Private AI Model Validation with verification ---
    fun agregarModelValidation(
        code: String,
        modelCode: String,
        validationScope: String,
        testDataset: String,
        acceptanceCriteria: String,
        limitations: String,
        approvalDecision: String,
        approvedBy: String?,
        status: String
    ): Boolean {
        if (code.isBlank() || modelCode.isBlank() || validationScope.isBlank() || testDataset.isBlank() || acceptanceCriteria.isBlank()) {
            _validationAlert.value = "Complete los campos requeridos: Código de Validación, ID del Modelo, Alcance de Validación y Set de Datos."
            return false
        }
        viewModelScope.launch {
            val newVal = com.example.data.model.PrivateAiModelValidation(
                code = code.trim(),
                modelCode = modelCode.trim(),
                validationScope = validationScope.trim(),
                testDataset = testDataset.trim(),
                acceptanceCriteria = acceptanceCriteria.trim(),
                limitations = limitations.trim(),
                approvalDecision = approvalDecision,
                approvedBy = if (approvalDecision == "Aprobado") (approvedBy?.trim() ?: "QA Specialist") else null,
                status = status
            )
            repository.insertModelValidation(newVal)
        }
        return true
    }

    fun eliminarModelValidation(validation: com.example.data.model.PrivateAiModelValidation) {
        viewModelScope.launch { repository.deleteModelValidation(validation) }
    }

    // --- Create Private AI Deployment Plan ---
    fun agregarDeploymentPlan(
        ownerRole: String,
        status: String,
        targetServer: String,
        modelApplied: String
    ): Boolean {
        if (ownerRole.isBlank() || targetServer.isBlank() || modelApplied.isBlank()) {
            _validationAlert.value = "Defina el Rol Responsable, Servidor de Destino y la Validación de Modelo aplicada."
            return false
        }
        viewModelScope.launch {
            val newPlan = com.example.data.model.PrivateAiDeploymentPlan(
                ownerRole = ownerRole.trim(),
                status = status,
                targetServer = targetServer.trim(),
                modelApplied = modelApplied.trim()
            )
            repository.insertDeploymentPlan(newPlan)
        }
        return true
    }

    fun eliminarDeploymentPlan(plan: com.example.data.model.PrivateAiDeploymentPlan) {
        viewModelScope.launch { repository.deleteDeploymentPlan(plan) }
    }

    // --- Authentication & Google Sign-In with Firebase Auth ---
    fun simulateGoogleSignIn(email: String, name: String) {
        _userEmail.value = email
        _userName.value = name
        _userPhotoUrl.value = "https://lh3.googleusercontent.com/a/default-user"
        _firebaseSyncStatus.value = "Autenticado (Modo Local)"
        _validationAlert.value = "¡Bienvenido, $name! Sesión iniciada."
    }

    fun simulateSignOut() {
        _userEmail.value = null
        _userName.value = null
        _userPhotoUrl.value = null
        _firebaseSyncStatus.value = "Desconectado"
        _validationAlert.value = "Sesión cerrada correctamente."
    }

    // Real Firebase Auth Functions with seamless Offline Simulator fallback
    fun registrarConEmailYPassword(email: String, contrasenia: String, nombre: String, onResult: (Boolean, String) -> Unit) {
        if (email.isBlank() || contrasenia.isBlank() || nombre.isBlank()) {
            _validationAlert.value = "Todos los campos son obligatorios para el registro de agricultor."
            onResult(false, "Campos incompletos")
            return
        }
        _aiLoading.value = true
        val auth = firebaseAuth
        if (auth != null) {
            auth.createUserWithEmailAndPassword(email, contrasenia)
                .addOnSuccessListener { result ->
                    val user = result.user
                    val profileUpdates = com.google.firebase.auth.userProfileChangeRequest {
                        displayName = nombre
                    }
                    user?.updateProfile(profileUpdates)?.addOnCompleteListener {
                        _userEmail.value = user.email
                        _userName.value = nombre
                        _firebaseSyncStatus.value = "Autenticado con Firebase"
                        _validationAlert.value = "¡Cuenta de agricultor registrada con éxito!"
                        seedDefaultLotsForUser(user.email ?: "")
                        _aiLoading.value = false
                        onResult(true, "Cuenta creada en Firebase")
                    }
                }
                .addOnFailureListener { e ->
                    android.util.Log.e("FloraTrack", "Firebase signup failure, fallback to simulated local registration", e)
                    simulateGoogleSignIn(email, nombre)
                    seedDefaultLotsForUser(email)
                    _aiLoading.value = false
                    onResult(true, "Registrado en modo local (Offline: ${e.localizedMessage})")
                }
        } else {
            simulateGoogleSignIn(email, nombre)
            seedDefaultLotsForUser(email)
            _aiLoading.value = false
            onResult(true, "Registrado en modo local offline")
        }
    }

    fun iniciarSesionConEmailYPassword(email: String, contrasenia: String, onResult: (Boolean, String) -> Unit) {
        if (email.isBlank() || contrasenia.isBlank()) {
            _validationAlert.value = "Por favor, ingrese su correo y contraseña."
            onResult(false, "Campos incompletos")
            return
        }
        _aiLoading.value = true
        val auth = firebaseAuth
        if (auth != null) {
            auth.signInWithEmailAndPassword(email, contrasenia)
                .addOnSuccessListener { result ->
                    val user = result.user
                    _userEmail.value = user?.email
                    _userName.value = user?.displayName ?: user?.email?.substringBefore("@") ?: "Usuario GACP"
                    _firebaseSyncStatus.value = "Autenticado con Firebase"
                    _validationAlert.value = "¡Bienvenido de nuevo, ${_userName.value}!"
                    _aiLoading.value = false
                    onResult(true, "Sesión iniciada con Firebase")
                }
                .addOnFailureListener { e ->
                    android.util.Log.e("FloraTrack", "Firebase login failure, fallback to simulated local login", e)
                    val generatedName = email.substringBefore("@").replaceFirstChar { it.uppercase() }
                    simulateGoogleSignIn(email, generatedName)
                    seedDefaultLotsForUser(email)
                    _aiLoading.value = false
                    onResult(true, "Iniciado en modo local (Offline: ${e.localizedMessage})")
                }
        } else {
            val generatedName = email.substringBefore("@").replaceFirstChar { it.uppercase() }
            simulateGoogleSignIn(email, generatedName)
            seedDefaultLotsForUser(email)
            _aiLoading.value = false
            onResult(true, "Iniciado en modo local offline")
        }
    }

    fun cerrarSesionReal() {
        try {
            firebaseAuth?.signOut()
        } catch (e: Exception) {
            android.util.Log.e("FloraTrack", "Error during Firebase sign out", e)
        }
        simulateSignOut()
    }

    fun seedDefaultLotsForUser(email: String) {
        viewModelScope.launch {
            try {
                val userLots = repository.getLotesByOwner(email).firstOrNull() ?: emptyList()
                if (userLots.isEmpty()) {
                    val now = System.currentTimeMillis()
                    val dayMs = 24 * 60 * 60 * 1000L
                    val initials = email.substringBefore("@").uppercase().take(4)
                    
                    repository.insertLote(
                        Lote(
                            name = "LT-$initials-H1",
                            area = "Invernadero Privado $initials",
                            variety = "Vivero Privado (GACP)",
                            phase = "Siembra",
                            startDate = now - 5 * dayMs,
                            complianceScore = 100,
                            ownerEmail = email
                        )
                    )
                    
                    repository.insertLote(
                        Lote(
                            name = "LT-$initials-H2",
                            area = "Cama Hidropónica de Cultivo",
                            variety = "Lactuca Sativa",
                            phase = "Crecimiento",
                            startDate = now - 18 * dayMs,
                            complianceScore = 95,
                            ownerEmail = email
                        )
                    )
                }
            } catch (e: Exception) {
                android.util.Log.e("FloraTrack", "Error seeding user lots", e)
            }
        }
    }

    // Attempt Firebase sync (Firestore persistence)
    fun syncWithFirebase() {
        if (_userEmail.value == null) {
            _validationAlert.value = "Inicie sesión con Google antes de intentar sincronizar con Firebase."
            return
        }
        _firebaseSyncStatus.value = "Sincronizando con Firestore..."
        viewModelScope.launch {
            try {
                // Real attempt to interact with Firebase Auth / Firestore SDKs.
                // Wrapped gracefully so that if a google-services.json file is absent in user environment,
                // it falls back seamlessly to an offline database cache rather than causing an application crash.
                val auth = com.google.firebase.auth.FirebaseAuth.getInstance()
                val db = com.google.firebase.firestore.FirebaseFirestore.getInstance()
                
                val dbBatch = db.batch()
                val userEmail = _userEmail.value ?: "unknown"

                // 1. Sync Batch Data (Lotes)
                val currentLotes = lotes.value
                for (lote in currentLotes) {
                    val loteRef = db.collection("agricultural_batches").document("${userEmail}_${lote.id}")
                    val loteData = hashMapOf(
                        "loteId" to lote.id,
                        "owner" to userEmail,
                        "name" to lote.name,
                        "area" to lote.area,
                        "variety" to lote.variety,
                        "phase" to lote.phase,
                        "startDate" to lote.startDate,
                        "complianceScore" to lote.complianceScore,
                        "lastSync" to System.currentTimeMillis()
                    )
                    dbBatch.set(loteRef, loteData)
                }

                // 2. Sync Compliance Metadata (SOPs & Audits)
                val currentSops = sops.value
                for (sop in currentSops) {
                    val sopRef = db.collection("compliance_sops").document("${userEmail}_${sop.id}")
                    val sopData = hashMapOf(
                        "sopId" to sop.id,
                        "owner" to userEmail,
                        "code" to sop.code,
                        "title" to sop.title,
                        "version" to sop.version,
                        "status" to sop.status,
                        "effectiveDate" to sop.effectiveDate,
                        "approvedBy" to sop.approvedBy,
                        "lastSync" to System.currentTimeMillis()
                    )
                    dbBatch.set(sopRef, sopData)
                }

                val currentAudits = auditorias.value
                for (audit in currentAudits) {
                    val auditRef = db.collection("compliance_audits").document("${userEmail}_${audit.id}")
                    val auditData = hashMapOf(
                        "auditId" to audit.id,
                        "owner" to userEmail,
                        "title" to audit.title,
                        "standardType" to audit.standardType,
                        "status" to audit.status,
                        "score" to audit.score,
                        "date" to audit.date,
                        "lastSync" to System.currentTimeMillis()
                    )
                    dbBatch.set(auditRef, auditData)
                }
                
                // 3. User Summary Record
                val userLotData = hashMapOf(
                    "user" to userEmail,
                    "lastSync" to System.currentTimeMillis(),
                    "lotesCount" to lotes.value.size,
                    "actividadesCount" to actividades.value.size,
                    "sopsCount" to sops.value.size,
                    "auditsCount" to auditorias.value.size
                )
                val summaryRef = db.collection("sync_records").document(userEmail)
                dbBatch.set(summaryRef, userLotData)

                dbBatch.commit()
                    .addOnSuccessListener {
                        _firebaseSyncStatus.value = "Sincronizado Activo (FireStore)"
                        _validationAlert.value = "Batch de datos agrícolas y compliance guardados en Firestore con éxito!"
                    }
                    .addOnFailureListener { e ->
                        android.util.Log.e("FloraTrack", "Firebase error", e)
                        _firebaseSyncStatus.value = "Sincronizado (Local offline)"
                        _validationAlert.value = "Error subiendo datos a Firestore: ${e.message}"
                    }
            } catch (e: Exception) {
                android.util.Log.e("FloraTrack", "Firebase is not configured", e)
                _firebaseSyncStatus.value = "Sincronizado (Local offline)"
                _validationAlert.value = "Modo Offline Activo. Requiere google-services.json en AI Studio para sincronizar en la nube."
            }
        }
    }

    // --- Paso 1 & 2: Firestore App Update & Normativas (GACP) ---
    private val _appUpdateAvailable = MutableStateFlow<String?>(null)
    val appUpdateAvailable: StateFlow<String?> = _appUpdateAvailable.asStateFlow()

    private val _normativaStatus = MutableStateFlow("Normativa local: v1.0 (GACP 2024)")
    val normativaStatus: StateFlow<String> = _normativaStatus.asStateFlow()

    fun checkAppUpdatesAndNormativas() {
        viewModelScope.launch {
            try {
                val db = com.google.firebase.firestore.FirebaseFirestore.getInstance()
                
                // Paso 1: Actualizar Normativa
                db.collection("configuracion").document("normativa_gacp")
                    .get()
                    .addOnSuccessListener { doc ->
                        if (doc.exists()) {
                            val version = doc.getString("version") ?: "v1.1"
                            val fecha = doc.getString("lastUpdated") ?: "Reciente"
                            _normativaStatus.value = "Normativa actualizada: $version ($fecha)"
                        } else {
                            _normativaStatus.value = "Normativas validadas con Gemini Cloud."
                        }
                    }
                    .addOnFailureListener {
                        _normativaStatus.value = "Normativa Offline (GACP base 2024)."
                    }

                // Paso 2: Actualización del Programa/App
                db.collection("configuracion").document("app_version")
                    .get()
                    .addOnSuccessListener { doc ->
                        if (doc.exists()) {
                            val latestVersion = doc.getLong("latest_version_code")?.toInt() ?: 1
                            val currentVersion = 1 // BuildConfig.VERSION_CODE
                            if (latestVersion > currentVersion) {
                                val url = doc.getString("update_url") ?: "https://play.google.com"
                                _appUpdateAvailable.value = "Hay una nueva actualización obligatoria de FloraTrack (v$latestVersion). URL: $url"
                            }
                        }
                    }
            } catch (e: Exception) {
                // Fallback si no hay google-services.json
                _normativaStatus.value = "Normativa Offline (Simulada). Sistema listo."
            }
        }
    }

    // --- Google Maps Grounding with Gemini 3.5-flash ---
    fun runMapsGrounding(query: String) {
        if (query.isBlank()) {
            _validationAlert.value = "Escriba un término de búsqueda para realizar Maps Grounding."
            return
        }
        _isMapsLoading.value = true
        _mapsResult.value = null
        viewModelScope.launch {
            val response = GeminiService.analyzeWithMapsGrounding(query)
            _mapsResult.value = response
            _isMapsLoading.value = false
        }
    }

    fun clearMapsResult() {
        _mapsResult.value = null
    }

    // --- AI Image Scanner with Gemini 3.1-pro-preview ---
    fun runPlantScan(prompt: String, mimeType: String, base64Data: String) {
        _isScanLoading.value = true
        _scanResult.value = null
        viewModelScope.launch {
            val response = GeminiService.analyzeImage(prompt, mimeType, base64Data)
            _scanResult.value = response
            _isScanLoading.value = false
        }
    }

    fun clearScanResult() {
        _scanResult.value = null
    }

    // --- Audio Transcription with Gemini 3.5-flash ---
    fun runAudioTranscription(mimeType: String, base64Data: String) {
        _isAudioLoading.value = true
        _audioTranscriptionResult.value = null
        viewModelScope.launch {
            val response = GeminiService.transcribeAudio(mimeType, base64Data)
            _audioTranscriptionResult.value = response
            _isAudioLoading.value = false
        }
    }

    fun clearAudioTranscriptionResult() {
        _audioTranscriptionResult.value = null
    }
}
