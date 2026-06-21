import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineString } from "firebase-functions/params";
import * as firestoreClient from "@google-cloud/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import PDFDocument = require("pdfkit"); // Fix import for pdfkit
import * as https from "https";

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const client = new firestoreClient.v1.FirestoreAdminClient();

const errorWebhookUrl = defineString("ERROR_WEBHOOK_URL", { default: "" });
const backupFrequency = defineString("BACKUP_FREQUENCY", { default: "every 24 hours" });
const backupBucketName = defineString("BACKUP_BUCKET_NAME", { default: "gs://my-firestore-backups" });
const adminEmails = defineString("ADMIN_EMAILS", { default: "admin@example.com" });
const smtpHost = defineString("SMTP_HOST", { default: "smtp.example.com" });
const smtpPort = defineString("SMTP_PORT", { default: "587" });
const smtpUser = defineString("SMTP_USER", { default: "user" });
const smtpPass = defineString("SMTP_PASS", { default: "pass" });

/**
 * Sistema de Logging de Errores
 * Captura fallos y los envía a un canal de notificaciones (webhook) o email.
 */
async function logAndNotifyError(context: string, error: any) {
  console.error(`[LOG_SISTEMA] Error capturado en: ${context}`, error);

  const webhookUrl = errorWebhookUrl.value();
  if (webhookUrl) {
    const payload = JSON.stringify({
      text: `🚨 **Fallo en Cloud Function:** \`${context}\`\n**Detalles del error:**\n\`\`\`${error instanceof Error ? error.stack || error.message : JSON.stringify(error)}\`\`\``,
      content: `🚨 **Fallo en Cloud Function:** \`${context}\`\n**Detalles del error:**\n\`\`\`${error instanceof Error ? error.stack || error.message : JSON.stringify(error)}\`\`\`` // Soporte para Discord
    });

    try {
      const url = new URL(webhookUrl);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let responseBody = '';
          res.on('data', (chunk) => responseBody += chunk);
          res.on('end', () => resolve(responseBody));
        });
        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
      });
      console.log(`Notificación de error enviada al canal: ${context}`);
    } catch (e) {
      console.error(`Fallo al enviar notificación de error al webhook:`, e);
    }
  } else {
    // Alternativa: Si no hay webhook, intentar notificar por correo
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost.value(),
        port: parseInt(smtpPort.value(), 10),
        secure: parseInt(smtpPort.value(), 10) === 465,
        auth: {
          user: smtpUser.value(),
          pass: smtpPass.value(),
        },
      });

      await transporter.sendMail({
        from: `"Alertas Sistema GACP" <${smtpUser.value()}>`,
        to: adminEmails.value(),
        subject: `🚨 Alerta Crítica: Error en ${context}`,
        text: `Se ha detectado un fallo en la ejecución de la función Cloud.\n\nContexto: ${context}\nDetalles:\n${error instanceof Error ? error.stack || error.message : JSON.stringify(error)}`
      });
      console.log(`Alerta de error enviada por correo para: ${context}`);
    } catch (e) {
      console.error(`Fallo al enviar el correo de alerta:`, e);
    }
  }
}

export const scheduledFirestoreBackup = onSchedule(
  {
    schedule: backupFrequency,
    timeZone: "America/Bogota",
    region: "us-central1",
    timeoutSeconds: 300,
  },
  async (event) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    
    if (!projectId) {
      console.error("GCP_PROJECT environment variable is not set.");
      return;
    }

    const databaseName = client.databasePath(projectId, "(default)");
    const timestamp = new Date().toISOString();
    const outputUriPrefix = `${backupBucketName.value()}/backups_${timestamp}`;

    try {
      console.log(`Iniciando exportación de base de datos a ${outputUriPrefix}`);
      const [response] = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: outputUriPrefix,
        collectionIds: [],
      });

      console.log(`Proceso de exportación iniciado exitosamente con ID: ${response.name}`);
    } catch (err) {
      await logAndNotifyError("scheduledFirestoreBackup", err);
      throw new Error("Export operation failed");
    }
  }
);

export const weeklyAuditReportPdf = onSchedule(
  {
    schedule: "0 8 * * 6", // Cada fin de semana (sábado a las 8 AM)
    timeZone: "America/Bogota",
    region: "us-central1",
    timeoutSeconds: 300,
  },
  async (event) => {
    try {
      console.log("Iniciando generación de reporte PDF semanal de auditoría");

      // 1. Obtener datos de Firestore
      const db = admin.firestore();
      const batchesSnapshot = await db.collection("batches").get();
      
      // Creamos el documento PDF en memoria
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      
      doc.on("data", (chunk) => chunks.push(chunk));
      
      // 2. Generar el contenido del reporte
      doc.fontSize(20).text("Reporte Semanal de Auditoría GACP", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha de generación: ${new Date().toISOString()}`, { align: "right" });
      doc.moveDown(2);

      let totalAudited = 0;
      let totalCompliant = 0;

      if (batchesSnapshot.empty) {
        doc.text("No se encontraron lotes auditados durante este período.");
      } else {
        batchesSnapshot.forEach((docSnap) => {
          const batch = docSnap.data();
          const complianceScore = batch.complianceScore || 0;
          totalAudited++;
          if (complianceScore >= 80) totalCompliant++;

          doc.fontSize(14).text(`Lote: ${batch.batchCode || docSnap.id}`);
          doc.fontSize(10).text(`Variedad: ${batch.variety || "N/A"}`);
          doc.text(`Fase: ${batch.stage || "N/A"}`);
          doc.text(`Score GACP: ${complianceScore}%`);
          doc.text(`Estado: ${complianceScore >= 80 ? 'CUMPLE' : 'REVISIÓN REQUERIDA'}`);
          doc.moveDown();
        });
      }

      doc.moveDown();
      doc.fontSize(14).text("Resumen:", { underline: true });
      doc.fontSize(12).text(`Total de Lotes Auditados: ${totalAudited}`);
      doc.text(`Lotes en Cumplimiento (>=80%): ${totalCompliant}`);

      // Finalizar PDF
      doc.end();

      // Esperar a que se termine de escribir el stream a memoria
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        doc.on("error", reject);
      });

      // 3. Configurar envío de correo
      const transporter = nodemailer.createTransport({
        host: smtpHost.value(),
        port: parseInt(smtpPort.value(), 10),
        secure: parseInt(smtpPort.value(), 10) === 465,
        auth: {
          user: smtpUser.value(),
          pass: smtpPass.value(),
        },
      });

      const mailOptions = {
        from: `"Sistema de Auditoría GACP" <${smtpUser.value()}>`,
        to: adminEmails.value(),
        subject: `Reporte Semanal GACP - ${new Date().toISOString().split("T")[0]}`,
        text: "Adjunto encontrará el informe resumen de auditoría GACP.",
        attachments: [
          {
            filename: `Reporte_GACP_${new Date().toISOString().split("T")[0]}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Reporte enviado exitosamente:", info.messageId);

    } catch (error) {
      await logAndNotifyError("weeklyAuditReportPdf", error);
      throw new Error("Report generation failed");
    }
  }
);

