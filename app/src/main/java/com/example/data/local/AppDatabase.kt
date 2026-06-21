package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.model.ActividadGACP
import com.example.data.model.AuditoriaCheck
import com.example.data.model.DocumentSOP
import com.example.data.model.Lote

@Database(
    entities = [
        Lote::class,
        ActividadGACP::class,
        DocumentSOP::class,
        AuditoriaCheck::class,
        com.example.data.model.PrivateAiModelValidation::class,
        com.example.data.model.PrivateAiDeploymentPlan::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun floraDao(): FloraDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "floratrack_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
