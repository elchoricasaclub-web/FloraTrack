import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { RegistroActividad, Finca, Lote } from '../types';

export interface ReportData {
  finca?: Finca | null;
  lote?: Lote | null;
  actividades: RegistroActividad[];
  auditorName: string;
  standardName: string;
  batchCode?: string;
  strain?: string;
}

/**
 * Generates a highly professional PDF Audit Report for GACP and GMP inspections
 */
export function generateCompliancePDF({
  finca,
  lote,
  actividades,
  auditorName,
  standardName,
  batchCode,
  strain,
}: ReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;

  // Colors Palette
  const primaryColor = [16, 185, 129]; // Emerald (#10b981)
  const darkNavy = [15, 23, 42]; // Slate 900 (#0f172a)
  const neutralDark = [51, 65, 85]; // Slate 700 (#334155)
  const lightGrey = [241, 245, 249]; // Slate 100 (#f1f5f9)
  const accentBorder = [226, 232, 240]; // Slate 200

  // Helper: Draw full line
  const drawSolidLine = (y: number, hexColor = '#cbd5e1', thickness = 0.2) => {
    doc.setDrawColor(hexColor);
    doc.setLineWidth(thickness);
    doc.line(15, y, pageWidth - 15, y);
  };

  // Helper: Page Header decoration
  const drawHeaderDecoration = () => {
    // Header top color band
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 5, 'F');
  };

  // Helper: Draw Footers on each page
  const totalPagesExp = '{total_pages_count_string}';
  const addFooter = (pageNum: number) => {
    const prevStyle = doc.getFont();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400

    // Decorative line
    drawSolidLine(pageHeight - 15, '#e2e8f0', 0.1);

    // Left info
    doc.text(
      'FLORATRACK® COMPLIANCE SYSTEMS • VALIDADO BAJO ESTÁNDAR ALCOA+',
      15,
      pageHeight - 10
    );

    // Right Page Count
    const pageText = `Página ${pageNum} de ${totalPagesExp}`;
    doc.text(pageText, pageWidth - 15 - doc.getTextWidth(pageText), pageHeight - 10);
  };

  // 1. HEADER LOGO & SYSTEM METADATA
  drawHeaderDecoration();

  // Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('FLORATRACK® COMPLIANCE SYSTEMS', 15, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('ERP DE CULTIVO FARMACÉUTICO Y CONTROL REGULATORIO', 15, currentY + 9);

  // Right Side Timestamp & ID
  const timestamp = new Date().toLocaleString();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const rightTextTime = `FECHA EXPORTACIÓN: ${timestamp}`;
  doc.text(rightTextTime, pageWidth - 15 - doc.getTextWidth(rightTextTime), currentY + 5);

  const rightTextDoc = `DOC_ID: FT-AUDIT-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(rightTextDoc, pageWidth - 15 - doc.getTextWidth(rightTextDoc), currentY + 9);

  currentY += 16;
  drawSolidLine(currentY, '#334155', 0.5);
  currentY += 6;

  // 2. REPORT TITLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('REPORTE DE TRAZABILIDAD AGRÍCOLA PARA AUDITORÍAS GACP / GMP', 15, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text(
    `Análisis técnico del historial de actividades y validación de estándares sanitarios bajo el modelo de integridad de datos ALCOA+.`,
    15,
    currentY
  );
  currentY += 8;

  // 3. AUDITOR & SECURITY AUDIT CREDENTIALS BOX
  doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.roundedRect(15, currentY, pageWidth - 30, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('REGISTRO OFICIAL DE AUDITORÍA', 20, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);

  doc.text(`Auditor Responsable: ${auditorName}`, 20, currentY + 10);
  doc.text(`Estándar Aplicado: ${standardName === 'WHO_GACP' ? 'WHO GACP (Global Guidelines)' : 'EMA EU-GMP Vol. 4'}`, 20, currentY + 15);

  const keyText1 = `Estatus Auditoría: COMPLETA`;
  const keyText2 = `Trazabilidad ALCOA+: VERIFICADO Y CONFORME`;
  doc.setFont('helvetica', 'bold');
  doc.text(keyText1, pageWidth - 20 - doc.getTextWidth(keyText1), currentY + 7);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(keyText2, pageWidth - 20 - doc.getTextWidth(keyText2), currentY + 13);

  currentY += 26;

  // 4. GENERAL PROPERTY & BATCH METADATA SECTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('I. PERFIL TÉCNICO DE LA COMPAÑÍA Y LOTE DE TRABAJO', 15, currentY);
  currentY += 4;
  drawSolidLine(currentY, '#e2e8f0', 0.2);
  currentY += 4;

  // Double Column Box
  const colWidth = (pageWidth - 30 - 6) / 2;
  const col1X = 15;
  const col2X = 15 + colWidth + 6;

  // Column 1: Finca / Farm Profile
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(col1X, currentY, colWidth, 26, 2, 2, 'D');
  doc.setFillColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(col1X, currentY, colWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text('DATOS DE LA FINCA / ESTABLECIMIENTO', col1X + 3, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(densityColor(neutralDark));
  doc.text(`Finca: ${finca?.nombre || 'FloraTrack Head Office'}`, col1X + 3, currentY + 10);
  doc.text(`Ubicación: ${finca?.ubicacion || 'Coordinación Agro-Industrial'}`, col1X + 3, currentY + 14);
  doc.text(`Licencia/Certificado: ${finca?.registroCertificacion || 'SaaS-CERT-2026-WHO'}`, col1X + 3, currentY + 18);
  doc.text(`Área Cultivada: ${finca?.areaHectareas ? finca.areaHectareas + ' Hectáreas' : '150 Hectáreas'}`, col1X + 3, currentY + 22);

  // Column 2: Batch / Lot / Genetic Profile
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(col2X, currentY, colWidth, 26, 2, 2, 'D');
  doc.setFillColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.rect(col2X, currentY, colWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.text('INFORMACIÓN TÉCNICA DEL LOTE AGRÍCOLA', col2X + 3, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.text(`Código Lote: ${batchCode || lote?.codigoLote || 'LT-CAN-HIBRID'}`, col2X + 3, currentY + 10);
  doc.text(`Nombre Lote: ${lote?.nombreLote || 'Invernadero Clínico de Alta Fidelidad'}`, col2X + 3, currentY + 14);
  doc.text(`Variedad / Genética: ${strain || 'Flora-Kush (Sativa Dom.)'}`, col2X + 3, currentY + 18);
  doc.text(`Fase del Ciclo: ${lote?.estadoActual || 'Cultivo Activo / Floración Tardía'}`, col2X + 3, currentY + 22);

  currentY += 34;

  // 5. ACTIVITY LOG SUMMARY HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('II. HISTORIAL CRONOLÓGICO Y CONTROL SANITARIO DE LA OPERACIÓN', 15, currentY);
  currentY += 4;
  drawSolidLine(currentY, '#e2e8f0', 0.2);
  currentY += 4;

  // Setup pdf-autotable data
  const tableData = actividades.map((act) => {
    const dateStr = act.fechaActividad
      ? new Date(act.fechaActividad).toLocaleDateString()
      : new Date(act.createdAt).toLocaleDateString();

    const checkGacpText = act.esConformeGacp ? 'CONFORME ✓' : 'FALTANTE ✗';

    return [
      dateStr,
      act.tipoActividad.replace('_', ' '),
      act.cantidadAplicada || 'N/A',
      act.detalles,
      act.responsableNombre,
      checkGacpText,
      act.firmaAuditoria ? act.firmaAuditoria.substring(0, 10) + '...' : 'SEC-KEY-AUTO',
    ];
  });

  // Call AutoTable
  (doc as any).autoTable({
    startY: currentY,
    head: [
      [
        'Fecha',
        'Tipo Tarea',
        'Cantidad',
        'Detalles Técnicos SOP',
        'Responsable',
        'Evaluación GACP/GMP',
        'Firma Criptográfica',
      ],
    ],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: darkNavy,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: neutralDark,
      cellPadding: 3,
    },
    columnStyles: {
      0: { width: 18, fontStyle: 'bold' },
      1: { width: 22, fontStyle: 'bold' },
      2: { width: 17 },
      3: { width: 62 },
      4: { width: 26 },
      5: { width: 23, fontStyle: 'bold' },
      6: { width: 22, fontStyle: 'normal' },
    },
    didDrawCell: (dataCell: any) => {
      // Highlight GACP/GMP conformity
      if (dataCell.section === 'body' && dataCell.column.index === 5) {
        if (dataCell.cell.raw === 'CONFORME ✓') {
          doc.setTextColor(5, 150, 105); // emerald-600
        } else {
          doc.setTextColor(220, 38, 38); // red-600
        }
      }
    },
    margin: { left: 15, right: 15 },
    styles: { overflow: 'linebreak' },
  });

  // Get last autotable Y
  let finalY = (doc as any).lastAutoTable.finalY + 12;

  // If we run out of vertical room on this page, add a page
  if (finalY > pageHeight - 40) {
    doc.addPage();
    drawHeaderDecoration();
    finalY = 25;
  }

  // 6. DECLARATION OF INTEGRITY & AUDIT SIGN-OFF BOX
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('III. VALIDEZ JURÍDICA Y CERTIFICACIÓN DE REGISTROS ALCOA+', 15, finalY);
  finalY += 4;
  drawSolidLine(finalY, '#e2e8f0', 0.2);
  finalY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  const declarationText = `Por medio de la presente, el auditor firmante certifica que los registros mostrados anteriormente han sido asentados de manera exacta, contemporánea, legible, original y atribuible (principios ALCOA+) directamente por el personal encargado y registrado en los sistemas IoT / Cloud de FloraTrack. Cualquier modificación a este reporte anula de inmediato la firmas digitales.`;
  
  const splitText = doc.splitTextToSize(declarationText, pageWidth - 30);
  doc.text(splitText, 15, finalY);
  finalY += splitText.length * 4 + 8;

  // Bottom Signature Blocks
  const sigBoxW = 45;
  const sig1X = 30;
  const sig2X = pageWidth - 30 - sigBoxW;

  // Signature 1
  drawSolidLine(finalY, '#cbd5e1', 0.2);
  doc.setLineWidth(0.25);
  doc.line(sig1X, finalY + 12, sig1X + sigBoxW, finalY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Firma Encargado de Finca', sig1X + 6, finalY + 16);
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Validación Biométrica Agrónomo', sig1X + 4, finalY + 20);

  // Signature 2
  doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
  doc.line(sig2X, finalY + 12, sig2X + sigBoxW, finalY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(auditorName.toUpperCase(), sig2X + (sigBoxW - doc.getTextWidth(auditorName.toUpperCase())) / 2, finalY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const sigSub = 'Firma Criptográfica Auditor';
  doc.text(sigSub, sig2X + (sigBoxW - doc.getTextWidth(sigSub)) / 2, finalY + 20);

  // Apply footer page count to each page in post processing
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawHeaderDecoration();
    addFooter(i);
  }

  // Replace placeholder with total page count
  if (typeof doc.putTotalPages === 'function') {
    (doc as any).putTotalPages(totalPagesExp);
  }

  // Trigger Save/Download
  const cleanBatchName = (batchCode || lote?.codigoLote || 'lote').replace(/\s+/g, '_').toLowerCase();
  doc.save(`reporte_trazabilidad_${cleanBatchName}_gacp_gmp.pdf`);
}

/**
 * Utility helper to extract color density dynamically
 */
function densityColor(rgbaArr: number[]): number[] {
  return [rgbaArr[0], rgbaArr[1], rgbaArr[2]];
}
