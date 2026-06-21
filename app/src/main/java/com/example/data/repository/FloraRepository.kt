package com.example.data.repository

import com.example.data.local.FloraDao
import com.example.data.model.ActividadGACP
import com.example.data.model.AuditoriaCheck
import com.example.data.model.DocumentSOP
import com.example.data.model.Lote
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import java.util.Date

class FloraRepository(private val dao: FloraDao) {

    val allLotes: Flow<List<Lote>> = dao.getAllLotes()
    fun getLotesByOwner(email: String?): Flow<List<Lote>> = dao.getLotesByOwner(email)
    val allActivities: Flow<List<ActividadGACP>> = dao.getAllActivities()
    val allSOPs: Flow<List<DocumentSOP>> = dao.getAllSOPs()
    val allAudits: Flow<List<AuditoriaCheck>> = dao.getAllAudits()
    val allModelValidations: Flow<List<com.example.data.model.PrivateAiModelValidation>> = dao.getAllModelValidations()
    val allDeploymentPlans: Flow<List<com.example.data.model.PrivateAiDeploymentPlan>> = dao.getAllDeploymentPlans()

    fun getActivitiesByLot(lotId: Int): Flow<List<ActividadGACP>> = dao.getActivitiesByLot(lotId)

    suspend fun getLoteById(id: Int): Lote? = dao.getLoteById(id)
    suspend fun insertLote(lote: Lote): Long = dao.insertLote(lote)
    suspend fun updateLote(lote: Lote) = dao.updateLote(lote)
    suspend fun deleteLote(lote: Lote) = dao.deleteLote(lote)

    suspend fun insertActivity(activity: ActividadGACP): Long = dao.insertActivity(activity)
    suspend fun deleteActivity(activity: ActividadGACP) = dao.deleteActivity(activity)

    suspend fun insertSOP(sop: DocumentSOP): Long = dao.insertSOP(sop)
    suspend fun deleteSOP(sop: DocumentSOP) = dao.deleteSOP(sop)

    suspend fun getAuditById(id: Int): AuditoriaCheck? = dao.getAuditById(id)
    suspend fun insertAudit(audit: AuditoriaCheck): Long = dao.insertAudit(audit)
    suspend fun updateAudit(audit: AuditoriaCheck) = dao.updateAudit(audit)
    suspend fun deleteAudit(audit: AuditoriaCheck) = dao.deleteAudit(audit)

    // --- Private AI Model Validations ---
    suspend fun insertModelValidation(validation: com.example.data.model.PrivateAiModelValidation): Long = dao.insertModelValidation(validation)
    suspend fun deleteModelValidation(validation: com.example.data.model.PrivateAiModelValidation) = dao.deleteModelValidation(validation)

    // --- Private AI Deployment Plans ---
    suspend fun insertDeploymentPlan(plan: com.example.data.model.PrivateAiDeploymentPlan): Long = dao.insertDeploymentPlan(plan)
    suspend fun deleteDeploymentPlan(plan: com.example.data.model.PrivateAiDeploymentPlan) = dao.deleteDeploymentPlan(plan)

    // Method to seed data if empty
    suspend fun checkAndSeedDatabase() {
        val currentLotes = allLotes.firstOrNull() ?: emptyList()
        if (currentLotes.isEmpty()) {
            val now = System.currentTimeMillis()
            val dayMs = 24 * 60 * 60 * 1000L

            // Seed Lotes
            val lot1Id = dao.insertLote(
                Lote(
                    name = "LT-MED-CAN-01",
                    area = "Invernadero Tecnológico A",
                    variety = "Cannabis Amnesia Haze (Med)",
                    phase = "Floración",
                    startDate = now - 60 * dayMs,
                    complianceScore = 98
                )
            ).toInt()

            val lot2Id = dao.insertLote(
                Lote(
                    name = "LT-FIT-PIP-04",
                    area = "Cama Baja Invernadero B",
                    variety = "Menta Piperita (Fitoterapéutico)",
                    phase = "Siembra",
                    startDate = now - 5 * dayMs,
                    complianceScore = 100
                )
            ).toInt()

            val lot3Id = dao.insertLote(
                Lote(
                    name = "LT-QA-CAL-02",
                    area = "Bloque Exterior Terraza 1",
                    variety = "Caléndula Officinalis",
                    phase = "Cosecha",
                    startDate = now - 40 * dayMs,
                    complianceScore = 92
                )
            ).toInt()

            // Seed Activities
            dao.insertActivity(
                ActividadGACP(
                    lotId = lot1Id,
                    type = "Riego",
                    date = now - 3 * dayMs,
                    details = "Riego por goteo con solución bioestimulante autorizada para floración. pH 6.1.",
                    inputUsed = "BioStim Floración v2",
                    quantity = "150 Litros",
                    responsible = "Alejandro Pérez (Cultivo Lead)",
                    signature = "FIRMADO: APerez-552",
                    photoUri = null
                )
            )

            dao.insertActivity(
                ActividadGACP(
                    lotId = lot1Id,
                    type = "Control Plagas",
                    date = now - 12 * dayMs,
                    details = "Aplicación preventiva de aceite de neem y jabón potásico para prevención de mosca blanca. Conforme GACP.",
                    inputUsed = "NeemOil Soluble 1%",
                    quantity = "20 Litros",
                    responsible = "Alejandro Pérez (Cultivo Lead)",
                    signature = "FIRMADO: APerez-552",
                    photoUri = null
                )
            )

            dao.insertActivity(
                ActividadGACP(
                    lotId = lot2Id,
                    type = "Siembra",
                    date = now - 5 * dayMs,
                    details = "Siembra de esquejes pre-calificados en sustrato esterilizado de coco/turba. Lote SOP-GACP-001 verificado.",
                    inputUsed = "Esquejes Calificados M1",
                    quantity = "1000 Unidades",
                    responsible = "Marta Gómez (Auxiliar Técnico)",
                    signature = "FIRMADO: MGomez-103",
                    photoUri = null
                )
            )

            dao.insertActivity(
                ActividadGACP(
                    lotId = lot3Id,
                    type = "Cosecha",
                    date = now - 1 * dayMs,
                    details = "Cosecha controlada de inflorescencias abiertas de caléndula. Recolección manual en cestas de acero sanitizadas. GMP.",
                    inputUsed = "Cestas sanitizadas Inox",
                    quantity = "45 Kg",
                    responsible = "Carlos Salazar (Supervisor Cosecha)",
                    signature = "FIRMADO: CSalazar-332",
                    photoUri = null
                )
            )

            dao.insertActivity(
                ActividadGACP(
                    lotId = 0, // General Facility
                    type = "Limpieza",
                    date = now - 4 * dayMs,
                    details = "Santización general profunda de la sala de secado y empaque de cannabis. Desinfección con alcohol isopropílico al 70%. Conforme SOP-GMP-003.",
                    inputUsed = "Alcohol Isopropílico 70%",
                    quantity = "15 Litros",
                    responsible = "Liliana Rojas (QA Auxiliar)",
                    signature = "FIRMADO: LRojas-19",
                    photoUri = null
                )
            )

            // Seed SOPs
            dao.insertSOP(
                DocumentSOP(
                    code = "SOP-GACP-001",
                    title = "Recepción de Semillas y Material Vegetal de Siembra",
                    version = "v1.2",
                    status = "Aprobado",
                    effectiveDate = "2026-01-10",
                    approvedBy = "Dra. Helena Rostova (Directora Técnica)",
                    historyOfChanges = "v1.0 (Inicial) -> v1.2 (Adición de control fitopatológico en muelle)"
                )
            )

            dao.insertSOP(
                DocumentSOP(
                    code = "SOP-GACP-012",
                    title = "Protocolo de Irrigación, Calidad de Agua y Monitoreo de Drenajes",
                    version = "v2.0",
                    status = "Aprobado",
                    effectiveDate = "2026-03-22",
                    approvedBy = "Ing. Roberto Peña (QA Director)",
                    historyOfChanges = "v1.1 -> v2.0 (Inclusión de medición de conductividad eléctrica diaria)"
                )
            )

            dao.insertSOP(
                DocumentSOP(
                    code = "SOP-GMP-003",
                    title = "Sanitización del Área de Cosecha, Secado y Control de Microorganismos",
                    version = "v3.1",
                    status = "Aprobado",
                    effectiveDate = "2026-05-15",
                    approvedBy = "Dra. Helena Rostova (Directora Técnica)",
                    historyOfChanges = "v3.0 -> v3.1 (Ajuste de tiempos de aireación tras aplicación de desinfectantes)"
                )
            )

            dao.insertSOP(
                DocumentSOP(
                    code = "SOP-QA-DEV-09",
                    title = "Manejo de Desviaciones, No Conformidades y Acciones CAPA",
                    version = "v1.0",
                    status = "Borrador",
                    effectiveDate = "Pendiente",
                    approvedBy = "Por Aprobar",
                    historyOfChanges = "Iniciado para incorporar requisitos específicos de EU-GMP Parte II"
                )
            )

            // Seed Audits
            dao.insertAudit(
                AuditoriaCheck(
                    title = "Pre-Inspección GACP de Higiene y Equipos",
                    auditorName = "Ing. Felipe Carrillo (SaaS Auditor)",
                    date = now - 15 * dayMs,
                    standardType = "GACP",
                    status = "Cerrado",
                    totalItems = 12,
                    passedItems = 11,
                    score = 91,
                    observations = "Correcto orden en vestidores. Se halló una pala de excavación sin registro de sanitización correspondiente (Brecha resuelta al instante mediante CAPA-GACP-01).",
                    isAIReviewPending = false,
                    aiReport = "AI REVIEW [SUCCESS - SCORE 91%]\n" +
                            "La auditoría documenta una gestión higiénica excelente bajo directrices GACP, capítulo 4 (Higiene del personal y equipos).\n" +
                            "PUNTOS CRÍTICOS ANALIZADOS:\n" +
                            "1. Trazabilidad de Sanitización: Cumplido mediante el anexo de logs.\n" +
                            "2. Desviación (Pala sin rotulado): Tratamiento correctivo registrado según SOP-QA-DEV-09. Excelente respuesta rápida, reduciendo el riesgo de contaminación cruzada.\n" +
                            "RECOMENDACIÓN AUTOMÁTICA FLORA AI:\n" +
                            "- Realizar auditoría sorpresa en el mismo punto en 30 días.\n" +
                            "- Capacitar a nuevo personal de campo en el rotulado de herramientas según SOP-GMP-003."
                )
            )

            dao.insertAudit(
                AuditoriaCheck(
                    title = "Verificación Inicial de Requisitos GMP - Bodega de Acopio",
                    auditorName = "Dra. Helena Rostova",
                    date = now - 2 * dayMs,
                    standardType = "GMP",
                    status = "Abierto",
                    totalItems = 15,
                    passedItems = 12,
                    score = 80,
                    observations = "Zonas de almacenamiento limpias y con control de humedad activo (H.R. 51%). Sin embargo, faltan las tarjetas de identificación de 'Aprobado/Cuarentena' físicas en el lote LT-QA-CAL-02. Trámite correctivo en curso.",
                    isAIReviewPending = true,
                    aiReport = null
                )
            )

            // Seed Private AI Model Validations (Computerized Systems Validation under GMP)
            dao.insertModelValidation(
                com.example.data.model.PrivateAiModelValidation(
                    code = "VAL-AI-011",
                    modelCode = "MH-DETECT-CV-01",
                    validationScope = "Inspección automatizada de fitopatologías foliares (Roya) mediante imágenes de dosificación local",
                    testDataset = "Lotes_Patrón_Veg_2026_Gold",
                    acceptanceCriteria = "Precision > 95%, Recall > 90%",
                    limitations = "No utilizar en condiciones de luminosidad inferior a 250 lux.",
                    approvalDecision = "Aprobado",
                    approvedBy = "Director QA - Santiago Rueda",
                    status = "Validado"
                )
            )

            dao.insertModelValidation(
                com.example.data.model.PrivateAiModelValidation(
                    code = "VAL-AI-012",
                    modelCode = "QA-ANALYST-IR-03",
                    validationScope = "Mapeo espectroscópico NIR de compuestos activos y nivel de secado en salas refrigeradas",
                    testDataset = "Muestras_Calibración_Secado_Inox",
                    acceptanceCriteria = "R-Square > 0.98, RMSE < 0.25%",
                    limitations = "Requiere re-calibración de temperatura ambiente cada 12 horas.",
                    approvalDecision = "Pendiente",
                    approvedBy = null,
                    status = "Revision"
                )
            )

            // Seed Private AI Deployment Plans
            dao.insertDeploymentPlan(
                com.example.data.model.PrivateAiDeploymentPlan(
                    ownerRole = "Agrónomo DevOps / SRE",
                    status = "Certificado",
                    targetServer = "Invernadero A - Nodo Inteligente Nvidia Jetson v3",
                    modelApplied = "VAL-AI-011"
                )
            )

            dao.insertDeploymentPlan(
                com.example.data.model.PrivateAiDeploymentPlan(
                    ownerRole = "Supervisor de Secadero y Control de Calidad",
                    status = "En Progreso",
                    targetServer = "Sala Técnica de Secado - Servidor Local GMP-Edge-02",
                    modelApplied = "VAL-AI-012"
                )
            )
        }
    }
}
