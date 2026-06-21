package com.example.data.api

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject

object WeatherService {
    private val client = OkHttpClient()

    // Using Open-Meteo to fetch weather data without needing an API key
    suspend fun getEnvironmentalTelemetry(): Pair<Double, Double> = withContext(Dispatchers.IO) {
        val url = "https://api.open-meteo.com/v1/forecast?latitude=40.41&longitude=-3.70&current=temperature_2m,relative_humidity_2m"
        
        try {
            val request = Request.Builder().url(url).build()
            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val responseString = response.body?.string() ?: ""
                    val json = JSONObject(responseString)
                    val current = json.optJSONObject("current")
                    
                    val temp = current?.optDouble("temperature_2m", 24.5) ?: 24.5
                    val humidity = current?.optDouble("relative_humidity_2m", 55.0) ?: 55.0
                    
                    return@withContext Pair(temp, humidity)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return@withContext Pair(24.5, 55.0) // Fallback values
    }
}
