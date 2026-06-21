package com.example.data.local

import androidx.room.*
import com.example.data.model.ActividadGACP
import com.example.data.model.AuditoriaCheck
import com.example.data.model.DocumentSOP
import com.example.data.model.Lote
import kotlinx.coroutines.flow.Flow

@Dao
interface FloraDao {

    // --- Lotes ---
    @Query("SELECT * FROM lotes ORDER BY startDate DESC")
    fun getAllLotes(): Flow<List<Lote>>

    @Query("SELECT * FROM lotes WHERE (:email IS NULL AND ownerEmail IS NULL) OR ownerEmail = :email ORDER BY startDate DESC")
    fun getLotesByOwner(email: String?): Flow<List<Lote>>

    @Query("SELECT * FROM lotes WHERE id = :id LIMIT 1")
    suspend fun getLoteById(id: Int): Lote?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLote(lote: Lote): Long

    @Update
    suspend fun updateLote(lote: Lote)

    @Delete
    suspend fun deleteLote(lote: Lote)

    // --- Actividades GACP ---
    @Query("SELECT * FROM actividades_gacp ORDER BY date DESC")
    fun getAllActivities(): Flow<List<ActividadGACP>>

    @Query("SELECT * FROM actividades_gacp WHERE lotId = :lotId ORDER BY date DESC")
    fun getActivitiesByLot(lotId: Int): Flow<List<ActividadGACP>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(activity: ActividadGACP): Long

    @Delete
    suspend fun deleteActivity(activity: ActividadGACP)

    // --- Documentos SOP ---
    @Query("SELECT * FROM documentos_sop ORDER BY code ASC")
    fun getAllSOPs(): Flow<List<DocumentSOP>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSOP(sop: DocumentSOP): Long

    @Delete
    suspend fun deleteSOP(sop: DocumentSOP)

    // --- Auditorías ---
    @Query("SELECT * FROM auditorias_check ORDER BY date DESC")
    fun getAllAudits(): Flow<List<AuditoriaCheck>>

    @Query("SELECT * FROM auditorias_check WHERE id = :id LIMIT 1")
    suspend fun getAuditById(id: Int): AuditoriaCheck?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAudit(audit: AuditoriaCheck): Long

    @Update
    suspend fun updateAudit(audit: AuditoriaCheck)

    @Delete
    suspend fun deleteAudit(audit: AuditoriaCheck)

    // --- Private AI Model Validations ---
    @Query("SELECT * FROM private_ai_model_validations ORDER BY createdAt DESC")
    fun getAllModelValidations(): Flow<List<com.example.data.model.PrivateAiModelValidation>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertModelValidation(validation: com.example.data.model.PrivateAiModelValidation): Long

    @Delete
    suspend fun deleteModelValidation(validation: com.example.data.model.PrivateAiModelValidation)

    // --- Private AI Deployment Plans ---
    @Query("SELECT * FROM private_ai_deployment_plans ORDER BY createdAt DESC")
    fun getAllDeploymentPlans(): Flow<List<com.example.data.model.PrivateAiDeploymentPlan>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDeploymentPlan(plan: com.example.data.model.PrivateAiDeploymentPlan): Long

    @Delete
    suspend fun deleteDeploymentPlan(plan: com.example.data.model.PrivateAiDeploymentPlan)
}
