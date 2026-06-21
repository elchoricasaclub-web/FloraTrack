package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "lotes")
data class Lote(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val area: String,
    val variety: String,
    val phase: String, // "Siembra", "Crecimiento", "Floración", "Cosecha", "Secado", "Terminado"
    val startDate: Long,
    val endDate: Long? = null,
    val harvestWeight: Double? = null,
    val complianceScore: Int = 100,
    val ownerEmail: String? = null
)

@Entity(tableName = "actividades_gacp")
data class ActividadGACP(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val lotId: Int, // Refers to Lote id, or 0 if it is general area
    val type: String, // "Siembra", "Riego", "Fertilización", "Aplicación Bioinsumo", "Control Plagas", "Poda", "Monitoreo", "Cosecha", "Secado", "Limpieza"
    val date: Long,
    val details: String,
    val inputUsed: String, // "BioPotash 50ml/L", "N/A" etc.
    val quantity: String, // "100 Litros", "5 Kg"
    val responsible: String,
    val signature: String, // Audit sign-off, e.g. "CC-Carlos-102"
    val photoUri: String? = null,
    val warningTriggered: Boolean = false
)

@Entity(tableName = "documentos_sop")
data class DocumentSOP(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val code: String, // e.g. "SOP-GACP-023"
    val title: String,
    val version: String, // "v1.0"
    val status: String, // "Borrador", "Aprobado", "Obsoleto"
    val effectiveDate: String,
    val approvedBy: String,
    val historyOfChanges: String
)

@Entity(tableName = "auditorias_check")
data class AuditoriaCheck(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val auditorName: String,
    val date: Long,
    val standardType: String, // "GACP", "GMP", "EU-GMP"
    val status: String, // "Abierto", "Cerrado"
    val totalItems: Int,
    val passedItems: Int,
    val score: Int, // Calculated percentage: (passedItems / totalItems) * 100
    val observations: String,
    val isAIReviewPending: Boolean = true,
    val aiReport: String? = null
)

@Entity(tableName = "private_ai_model_validations")
data class PrivateAiModelValidation(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val code: String, // unique reference, e.g. "VAL-AI-001"
    val modelCode: String, // Identifier of model e.g. "CV-DETECTOR-FLOR"
    val validationScope: String, // e.g. "Monitoreo fitosanitario automatizado en Lote A"
    val testDataset: String, // e.g. "Set_Calibración_V4_Mayo"
    val acceptanceCriteria: String, // e.g. "Confianza > 95%, F1-Score > 0.92"
    val limitations: String, // e.g. "Sensibilidad reducida con baja luminiscencia nocturna"
    val approvalDecision: String = "Pendiente", // "Pendiente", "Aprobado", "No Conformidad"
    val approvedBy: String? = null,
    val status: String = "Borrador", // "Borrador", "Revision", "Validado"
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "private_ai_deployment_plans")
data class PrivateAiDeploymentPlan(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val ownerRole: String, // e.g. "Director QA", "Agrónomo DevOps"
    val status: String = "Planeado", // "Planeado", "En Progreso", "Certificado"
    val targetServer: String = "Edge Node Closed Garden v1", // Close network deployment info
    val modelApplied: String, // Refers to validation/model being deployed
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
