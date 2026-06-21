import { GacpAlert } from '../notifications/route';

/**
 * Interface representing the configuration options for the FloraTrack GACP/GMP Email Service.
 */
interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'console';
  apiKey?: string;
  fromEmail: string;
  toEmail: string;
}

/**
 * Resolves email configuration from environment variables or safe defaults.
 */
function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER || 'console').toLowerCase() as 'resend' | 'sendgrid' | 'console';
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'alerts@floratrack.biotech';
  const toEmail = process.env.EMAIL_TO || 'elchoricasaclub@gmail.com'; // Defaulting to custom user metadata email if specified

  return {
    provider: apiKey ? provider : 'console',
    apiKey,
    fromEmail,
    toEmail,
  };
}

/**
 * Builds a highly polished responsive HTML email message for auditors and operators.
 */
function generateHtmlTemplate(alerts: GacpAlert[]): string {
  const nowStr = new Date().toLocaleString('es-ES', { timeZone: 'America/New_York' });
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const infoCount = alerts.filter(a => a.severity === 'INFO').length;

  const alertsRows = alerts.map(alert => {
    let severityColorBg = '#fef2f2';
    let severityColorBorder = '#fee2e2';
    let severityColorText = '#991b1b';
    let labelText = 'CRÍTICO';

    if (alert.severity === 'WARNING') {
      severityColorBg = '#fffbeb';
      severityColorBorder = '#fef3c7';
      severityColorText = '#92400e';
      labelText = 'ADVERTENCIA';
    } else if (alert.severity === 'INFO') {
      severityColorBg = '#f0fdf4';
      severityColorBorder = '#dcfce7';
      severityColorText = '#166534';
      labelText = 'RECOMENDACIÓN';
    }

    return `
      <div style="margin-bottom: 24px; padding: 20px; border-radius: 16px; background-color: ${severityColorBg}; border: 1px solid ${severityColorBorder};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background-color: ${severityColorBorder}; color: ${severityColorText};">
                ${labelText} — ${alert.type}
              </span>
            </td>
            <td align="right" style="padding-bottom: 8px; font-size: 11px; font-weight: bold; color: #64748b;">
              LOTE: ${alert.batchName}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <h3 style="margin: 4px 0 8px 0; font-size: 16px; font-weight: 800; color: #0f172a;">${alert.title}</h3>
              <p style="margin: 0 0 12px 0; font-size: 13.5px; line-height: 1.5; color: #334155;">${alert.description}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border-top: 1px dashed ${severityColorBorder}; padding-top: 10px; font-size: 12px; color: #475569;">
              <strong>Taxonomía:</strong> ${alert.variety} &nbsp;|&nbsp; 
              <strong>Etapa Actual:</strong> <span style="font-weight: bold; color: #059669;">${alert.stage}</span> &nbsp;|&nbsp; 
              <strong>Métrica:</strong> ${alert.daysRemainingOrElapsed} ${alert.type === 'NON_CONFORMITY_ALERT' ? '%' : 'días'}
            </td>
          </tr>
        </table>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Auditoría y Trazabilidad GACP/GMP</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 24px 0;">
        <tr>
          <td align="center">
            <!-- Email Container -->
            <table width="640" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #059669; padding: 32px 40px; text-align: left;">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="font-size: 11px; font-weight: 900; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">REPORTE AUTOMÁTICO</span>
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; tracking: -0.5px;">FloraTrack Biotech</h1>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #d1fae5;">Monitoreo y Alertas en Tiempo Real — GACP / EU-GMP</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Info/Stats Bar -->
              <tr>
                <td style="background-color: #f1f5f9; padding: 16px 40px; border-bottom: 1px solid #e2e8f0;">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 12px; font-weight: bold; color: #475569;">
                    <tr>
                      <td>Emitido: ${nowStr}</td>
                      <td align="right">
                        <span style="color: #ef4444;">🔴 ${criticalCount} Críticos</span> &nbsp;&nbsp;
                        <span style="color: #f59e0b;">🟡 ${warningCount} Advertencias</span> &nbsp;&nbsp;
                        <span style="color: #10b981;">🟢 ${infoCount} Sugerencias</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                    Estimado Auditor / Responsable Técnico,<br/>
                    El motor de cumplimiento fitosanitario de <strong>FloraTrack Biotech</strong> ha evaluado periódicamente los lotes botánicos agrícolas activos, detectando desvíos normativos que requieren su atención reglamentaria inmediata:
                  </p>

                  <!-- Alerts list -->
                  ${alertsRows}

                  <!-- SOP Reminder callout -->
                  <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; border: 1px dashed #cbd5e1; margin-top: 32px;">
                    <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0f172a;">🔵 Recordatorio de Cumplimiento Farmacéutico</h4>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #475569;">
                      De conformidad con las directrices de la OMS sobre buenas prácticas de cultivo y recolección (GACP) y los estándares FDA GMP Parte 211, todas las no conformidades y retrasos de control fitosanitario deben documentarse en la bitácora física bajo el respectivo Procedimiento Operativo Estándar (POE / SOP) en un plazo no mayor a 24 horas.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 32px 40px; text-align: center;">
                  <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #64748b;">
                    Este es un correo automático generado por el backend de FloraTrack Biotech.<br/>
                    Por favor no responda directamente a este email. Para ajustes en las reglas de alerta o auditoría, ingrese al Panel de Trazabilidad.
                  </p>
                  <p style="margin: 12px 0 0 0; font-size: 11px; font-weight: bold; color: #059669;">
                    © ${new Date().getFullYear()} FloraTrack Biotech Corp. Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Sends formatted alert email notification through APIs, falling back to developer console.
 */
export async function sendEmailNotifications(alerts: GacpAlert[]): Promise<{ success: boolean; provider: string; message: string }> {
  if (alerts.length === 0) {
    return {
      success: true,
      provider: 'none',
      message: 'No existen alertas activas de GACP/GMP; no se envía ningún correo electrónico.',
    };
  }

  const config = getEmailConfig();
  const htmlContent = generateHtmlTemplate(alerts);
  const subject = `⚠️ ALERTA: ${alerts.length} desvíos de calidad fitosanitaria GACP/GMP detectados`;

  try {
    if (config.provider === 'resend' && config.apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          from: config.fromEmail,
          to: [config.toEmail],
          subject,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend API returned status ${res.status}: ${await res.text()}`);
      }

      return {
        success: true,
        provider: 'resend',
        message: `Correo de alertas normativas despachado satisfactoriamente mediante Resend a ${config.toEmail}.`,
      };
    } else if (config.provider === 'sendgrid' && config.apiKey) {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: config.toEmail }] }],
          from: { email: config.fromEmail, name: 'FloraTrack Alerts' },
          subject,
          content: [{ type: 'text/html', value: htmlContent }],
        }),
      });

      if (!res.ok) {
        throw new Error(`SendGrid API returned status ${res.status}: ${await res.text()}`);
      }

      return {
        success: true,
        provider: 'sendgrid',
        message: `Correo de alertas normativas de trazabilidad despachado exitosamente mediante SendGrid a ${config.toEmail}.`,
      };
    } else {
      // Console mock provider - detailed and complete HTML logging
      console.log('========================================================================');
      console.log(`[EMAIL SERVICE] MOCK SENDER TRIGGERED (EMAIL_PROVIDER: console)`);
      console.log(`FROM: ${config.fromEmail}`);
      console.log(`TO: ${config.toEmail}`);
      console.log(`SUBJECT: ${subject}`);
      console.log('------------------------------------------------------------------------');
      console.log(`[ALERT LOGS SUMMARY]: ${alerts.length} active violations:`);
      alerts.forEach((a, i) => {
        console.log(`  ${i+1}. [${a.severity}] ${a.title} - ${a.description} (Lote: ${a.batchName})`);
      });
      console.log('------------------------------------------------------------------------');
      console.log(`[MOCK EMAIL PREVIEW HTML]:`);
      console.log(htmlContent);
      console.log('========================================================================');

      return {
        success: true,
        provider: 'console',
        message: `Simulación de correo electrónico exitosa: Reportado al console.log. Alertas enviadas a ${config.toEmail}.`,
      };
    }
  } catch (error: any) {
    console.error('[EMAIL_SERVICE_SEND_ERROR]', error);
    // Even on error, we log to console as emergency backup to avoid failing the main request entirely
    console.warn(`[EMERGENCY BACKUP LOGGING] debido al fallo de envío por API de correo:`);
    console.warn(`[RECIPIENT]: ${config.toEmail}`);
    alerts.forEach((a) => {
      console.warn(`  --> [${a.severity}] ${a.title} (BatchId: ${a.batchId})`);
    });

    return {
      success: false,
      provider: config.provider,
      message: `Error al despachar el correo de notificaciones: ${error.message || error}`,
    };
  }
}
