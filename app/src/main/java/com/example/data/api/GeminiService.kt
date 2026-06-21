package com.example.data.api

import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object GeminiService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    suspend fun analyzeAuditCompliance(
        standardType: String,
        auditTitle: String,
        score: Int,
        passed: Int,
        total: Int,
        observations: String
    ): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "FLORA AI REPORT [DEMO MODE]\n" +
                    "La API Key de Gemini (GEMINI_API_KEY) no está configurada en la sección de Secretos de AI Studio. El sistema opera en modo de simulación fuera de línea basada en heurísticas de auditoría.\n\n" +
                    "1. CLASIFICACIÓN DEL RIESGO: " + (if (score < 80) "ALTO" else if (score < 95) "MEDIO" else "BAJO") + " \n" +
                    "2. ANÁLISIS DE BRECHAS GACP/GMP:\n" +
                    "Se identifica una brecha potencial en la documentación de equipos de campo y el cumplimiento estricto de las directivas de $standardType asociadas con el registro manual de evidencias.\n" +
                    "3. ACCIONES CORRECTIVAS RECOMENDADAS (CAPA):\n" +
                    "- Reforzar de inmediato la capacitación de todo el personal en el llenado de firmas digitales para el lote de producción.\n" +
                    "- Implementar tarjetas físicas de estado de producto (Aprobado/En Cuarentena) conforme al SOP correspondiente."
        }

        // Using prompt-optimized gemini-3.5-flash as specified in the guidelines
        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

        val prompt = """
            Actúa como un Auditor Senior Experto en Certificaciones Agrícolas y Farmacéuticas GACP, GMP y EU-GMP.
            Realiza un análisis de brechas y cumplimiento técnico para el siguiente registro de auditoría interna de FloraTrack:
            
            ESTÁNDAR DE COMPROBACIÓN: $standardType
            TÍTULO DE AUDITORÍA: $auditTitle
            PUNTAJE DE CONFORMIDAD: $score% ($passed de $total ítems pasados)
            OBSERVACIONES Y NO CONFORMIDADES DETECTADAS:
            $observations
            
            Genera un reporte corto de auditoría estructurado en español (máximo 250 palabras) indicando:
            1. [CLASIFICACIÓN DEL RIESGO]: (Bajo, Medio, Alto) basado en los hallazgos.
            2. [ANÁLISIS DE BRECHAS]: Brecha principal contra las directivas de $standardType.
            3. [RECOMENDACIONES DE MEJORA (CAPA)]: 2-3 acciones inmediatas recomendadas específicas y de implementación verificable.
            
            Mantén un tono profesional, técnico, directo e institucional.
        """.trimIndent()

        try {
            val jsonBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", prompt)
                            })
                        })
                    })
                })
            }

            val mediaType = "application/json; charset=utf-8".toMediaType()
            val requestBody = jsonBody.toString().toRequestBody(mediaType)

            val request = Request.Builder()
                .url(url)
                .post(requestBody)
                .build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val responseString = response.body?.string() ?: ""
                    val responseJson = JSONObject(responseString)
                    val candidates = responseJson.optJSONArray("candidates")
                    val firstCandidate = candidates?.optJSONObject(0)
                    val content = firstCandidate?.optJSONObject("content")
                    val parts = content?.optJSONArray("parts")
                    val text = parts?.optJSONObject(0)?.optString("text")
                    text ?: "Sin respuesta del modelo o estructura JSON modificada."
                } else {
                    "Error en llamada API Gemini: Código ${response.code} - ${response.message}"
                }
            }
        } catch (e: Exception) {
            Log.e("GeminiService", "Error calling Gemini API", e)
            "Error de comunicación con FloraTrack AI: ${e.localizedMessage}"
        }
    }

    suspend fun analyzeWithMapsGrounding(prompt: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "FLORA AI MAPS [DEMO MODE]\n" +
                    "La API Key de Gemini no está configurada. Mostrando información de prueba basada en GACP/GMP:\n\n" +
                    "• Laboratorio Farmacéutico Control S.A. - C/ Provenza 23, Barcelona España (Acreditación EU-GMP).\n" +
                    "• Invernaderos AgroFlora S.L. - Polígono Agrícola Hort, Murcia España (Certificación GACP).\n" +
                    "• Distribuidora Biosalud - Av. América 45, Madrid España (Controles de Temperatura Farmacéutica).\n\n" +
                    "Configure su clave de API para obtener grounding geográfico en tiempo real de Google Maps."
        }

        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

        try {
            val jsonBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", prompt + "\nProporciona direcciones o ubicaciones específicas e incluye citas u origen de los datos encontrados mediante el sistema de búsqueda.")
                            })
                        })
                    })
                })
                put("tools", JSONArray().apply {
                    put(JSONObject().apply {
                        put("googleSearch", JSONObject())
                    })
                })
            }

            val requestBody = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
            val request = Request.Builder().url(url).post(requestBody).build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val responseString = response.body?.string() ?: ""
                    val responseJson = JSONObject(responseString)
                    val candidates = responseJson.optJSONArray("candidates")
                    val firstCandidate = candidates?.optJSONObject(0)
                    val content = firstCandidate?.optJSONObject("content")
                    val parts = content?.optJSONArray("parts")
                    val text = parts?.optJSONObject(0)?.optString("text") ?: ""
                    
                    // Extraer metadatos de grounding si existen para dar un toque más premium
                    val groundingMetadata = firstCandidate?.optJSONObject("groundingMetadata")
                    val searchChunks = groundingMetadata?.optJSONArray("groundingChunks")
                    val b = StringBuilder(text)
                    if (searchChunks != null && searchChunks.length() > 0) {
                        b.append("\n\n**Fuentes Verificadas de Maps / Búsqueda:**")
                        for (i in 0 until searchChunks.length()) {
                            val chunk = searchChunks.optJSONObject(i)
                            val source = chunk?.optJSONObject("web")
                            val title = source?.optString("title") ?: "Enlace de Maps"
                            val uri = source?.optString("uri")
                            if (uri != null) {
                                b.append("\n- [$title]($uri)")
                            }
                        }
                    }
                    b.toString().ifBlank { "Sin respuesta del modelo o estructura JSON modificada de Grounding." }
                } else {
                    "Error de Maps Grounding: ${response.code} ${response.message}"
                }
            }
        } catch (e: Exception) {
            Log.e("GeminiService", "Error in Maps Grounding", e)
            "Error de búsqueda georreferenciada: ${e.localizedMessage}"
        }
    }

    suspend fun analyzeImage(prompt: String, mimeType: String, base64Data: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "FLORA SCANNED [DEMO MODE]\n" +
                    "La API Key de Gemini no está configurada. Diagnóstico simulado de la imagen cargada:\n\n" +
                    "• REGISTRO VISUAL: Flor / Hoja de Cannabis Medicinalis GACP.\n" +
                    "• EVALUACIÓN TRICOMAS: Madurez estimada al 85%, color lechoso uniforme.\n" +
                    "• INTEGRIDAD FISIOLÓGICA: SANA. No se observan vectores de plagas (ácaros o pulgón) ni indicios de necrosis o moho gris (Botrytis).\n" +
                    "• CONCLUSIÓN: Producto apto para cosecha del lote bajo condiciones GMP.\n\n" +
                    "Active su clave de API de Gemini para analizar imágenes reales con el modelo gemini-3.1-pro-preview."
        }

        // Using gemini-3.1-pro-preview for advanced visual analysis as requested
        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=$apiKey"

        try {
            val jsonBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", "Analiza esta imagen de cultivo bajo las pautas estrictas de GACP de la OMS y GMP Farmacéutico. Directivas:\n" + prompt)
                            })
                            put(JSONObject().apply {
                                put("inlineData", JSONObject().apply {
                                    put("mimeType", mimeType)
                                    put("data", base64Data)
                                })
                            })
                        })
                    })
                })
            }

            val requestBody = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
            val request = Request.Builder().url(url).post(requestBody).build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val responseString = response.body?.string() ?: ""
                    val responseJson = JSONObject(responseString)
                    val candidates = responseJson.optJSONArray("candidates")
                    val firstCandidate = candidates?.optJSONObject(0)
                    val content = firstCandidate?.optJSONObject("content")
                    val parts = content?.optJSONArray("parts")
                    val text = parts?.optJSONObject(0)?.optString("text")
                    text ?: "Sin respuesta del modelo visual."
                } else {
                    "Error de análisis visual: ${response.code} ${response.message}"
                }
            }
        } catch (e: Exception) {
            Log.e("GeminiService", "Error in image analysis", e)
            "Error de comunicación visual: ${e.localizedMessage}"
        }
    }

    suspend fun transcribeAudio(mimeType: String, base64Data: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "[DEMO MODE] - Configura la API Key para transcripción real de audio."
        }

        // Using gemini-3.5-flash for audio transcription as requested
        val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"

        try {
            val jsonBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply {
                                put("text", "Por favor transcribe el siguiente audio y resume los puntos principales brevemente.")
                            })
                            put(JSONObject().apply {
                                put("inlineData", JSONObject().apply {
                                    put("mimeType", mimeType)
                                    put("data", base64Data)
                                })
                            })
                        })
                    })
                })
            }

            val requestBody = jsonBody.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
            val request = Request.Builder().url(url).post(requestBody).build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val responseString = response.body?.string() ?: ""
                    val responseJson = JSONObject(responseString)
                    val candidates = responseJson.optJSONArray("candidates")
                    val firstCandidate = candidates?.optJSONObject(0)
                    val content = firstCandidate?.optJSONObject("content")
                    val parts = content?.optJSONArray("parts")
                    val text = parts?.optJSONObject(0)?.optString("text")
                    text ?: "Sin respuesta del modelo de audio."
                } else {
                    "Error de transcripción: ${response.code} ${response.message}"
                }
            }
        } catch (e: Exception) {
            Log.e("GeminiService", "Error in audio transcription", e)
            "Error de comunicación audio: ${e.localizedMessage}"
        }
    }
}
