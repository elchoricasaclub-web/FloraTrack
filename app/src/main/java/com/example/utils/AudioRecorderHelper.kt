package com.example.utils

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import android.util.Base64
import java.io.File
import java.io.FileInputStream

class AudioRecorderHelper(private val context: Context) {
    private var mediaRecorder: MediaRecorder? = null
    private var audioFile: File? = null

    fun startRecording() {
        val fileName = "audio_record_${System.currentTimeMillis()}.mp4"
        audioFile = File(context.cacheDir, fileName)

        mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(context)
        } else {
            MediaRecorder()
        }.apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setOutputFile(audioFile?.absolutePath)
            prepare()
            start()
        }
    }

    fun stopRecording(): String? {
        try {
            mediaRecorder?.apply {
                stop()
                release()
            }
            mediaRecorder = null

            audioFile?.let { file ->
                if (file.exists()) {
                    val bytes = FileInputStream(file).use { it.readBytes() }
                    return Base64.encodeToString(bytes, Base64.DEFAULT)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }
}
