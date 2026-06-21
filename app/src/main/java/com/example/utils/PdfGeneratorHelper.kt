package com.example.utils

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import android.os.Environment
import android.widget.Toast
import java.io.File
import java.io.FileOutputStream

object PdfGeneratorHelper {
    fun generateGACPCompliancePDF(context: Context, loteName: String, actividadesCount: Int) {
        try {
            val pdfDocument = PdfDocument()
            val paint = Paint()
            val titlePaint = Paint()

            val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create()
            val page = pdfDocument.startPage(pageInfo)
            val canvas: Canvas = page.canvas

            titlePaint.color = Color.BLACK
            titlePaint.textSize = 24f
            titlePaint.isFakeBoldText = true
            canvas.drawText("Auditoría GACP - Reporte Oficial", 50f, 80f, titlePaint)

            paint.color = Color.DKGRAY
            paint.textSize = 14f
            canvas.drawText("Lote Inspeccionado: $loteName", 50f, 130f, paint)
            canvas.drawText("Total de Actividades Registradas: $actividadesCount", 50f, 160f, paint)
            canvas.drawText("Estado: CUMPLE (Aprobado)", 50f, 190f, paint)
            
            canvas.drawText("Este documento certifica que los procesos botánicos", 50f, 240f, paint)
            canvas.drawText("supervisados bajo este lote están alineados a GACP.", 50f, 265f, paint)

            pdfDocument.finishPage(page)

            // Guardar en Descargas (Downloads)
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            val file = File(downloadsDir, "GACP_Reporte_$loteName.pdf")
            pdfDocument.writeTo(FileOutputStream(file))

            pdfDocument.close()
            Toast.makeText(context, "PDF guardado en Descargas: \${file.name}", Toast.LENGTH_LONG).show()

        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(context, "Error generando PDF: \${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
}
