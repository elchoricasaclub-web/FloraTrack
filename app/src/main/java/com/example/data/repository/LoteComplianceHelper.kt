package com.example.data.repository

import com.example.data.model.Lote
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Motor de Reglas de Cumplimiento (Controlador del Backend Local)
 * Determina el estado regulatorio y normativo GACP/GMP de cada lote agrícola
 * según su fase fenológica, fechas clave y porcentaje de cumplimiento técnico (QMS).
 */
object LoteComplianceHelper {

    enum class StandardType {
        GACP, // Buenas Prácticas de Cultivo y Recolección
        GMP   // Buenas Prácticas de Manufactura 
    }

    data class ComplianceStatus(
        val standard: StandardType,
        val statusLabel: String,
        val colorHex: String,
        val alertLevel: String, // "OPTIMAL", "WARNING", "CRITICAL"
        val nextRequiredAction: String,
        val estimatedHarvestDate: String,
        val phaseLabel: String
    )

    /**
     * Evalúa el lote y devuelve su análisis normativo de cumplimiento.
     */
    fun evaluateLoteCompliance(lote: Lote): ComplianceStatus {
        // Determinar estándar aplicable según la fase fenológica
        val standard = when (lote.phase) {
            "Siembra", "Crecimiento", "Floración" -> StandardType.GACP
            "Cosecha", "Secado", "Terminado" -> StandardType.GMP
            else -> StandardType.GACP
        }

        // Evaluar nivel de alerta según la puntuación de cumplimiento técnico (complianceScore)
        val alertLevel = when {
            lote.complianceScore >= 95 -> "OPTIMAL"
            lote.complianceScore >= 85 -> "WARNING"
            else -> "CRITICAL"
        }

        val statusLabel = when (standard) {
            StandardType.GACP -> if (alertLevel == "OPTIMAL") "GACP Conforme" else "Desviación GACP"
            StandardType.GMP -> if (alertLevel == "OPTIMAL") "GMP Conforme" else "Brecha Sanitaria GMP"
        }

        val colorHex = when (alertLevel) {
            "OPTIMAL" -> "#34C759" // Verde suave
            "WARNING" -> "#FFCC00" // Amarillo/Naranja
            "CRITICAL" -> "#FF3B30" // Rojo
            else -> "#007AFF"
        }

        // Acciones requeridas automáticas según el estado regulatorio
        val nextRequiredAction = when (lote.phase) {
            "Siembra" -> "Verificar registro de origen del material vegetal y SOP-GACP-001."
            "Crecimiento" -> "Monitorear metales pesados en agua de riego y firmar bitácora diaria."
            "Floración" -> "Análisis microbiológico pre-cosecha y control estricto de humedad."
            "Cosecha" -> "Inspección de sanitización de herramientas de corte de acero inoxidable."
            "Secado" -> "Verificación del termo-higrómetro calibrado en sala técnica (SOP-GMP-003)."
            "Terminado" -> "Control de calidad microbiológica, empaque cerrado hermético y liberación técnica."
            else -> "Auditar firmas del lote."
        }

        // Estimar fecha de cosecha (por defecto sumamos 90 días a la fecha de inicio para fines agrícolas)
        val ninetyDaysMs = 90L * 24 * 60 * 60 * 1000L
        val estHarvestMs = lote.startDate + ninetyDaysMs
        val formatter = SimpleDateFormat("dd/MM/yyyy", Locale("es", "ES"))
        val estimatedHarvestDate = formatter.format(Date(estHarvestMs))

        val phaseLabel = when (lote.phase) {
            "Siembra" -> "Propagación"
            "Crecimiento" -> "Veg y Desarrollo"
            "Floración" -> "Floración Activa"
            "Cosecha" -> "Cosecha GMP"
            "Secado" -> "Post-Cosecha / Secado"
            "Terminado" -> "Producto Terminado"
            else -> lote.phase
        }

        return ComplianceStatus(
            standard = standard,
            statusLabel = statusLabel,
            colorHex = colorHex,
            alertLevel = alertLevel,
            nextRequiredAction = nextRequiredAction,
            estimatedHarvestDate = estimatedHarvestDate,
            phaseLabel = phaseLabel
        )
    }
}
