const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function ensure(delegate, where, data) {
  const existing = await delegate.findFirst({ where });
  if (existing) return existing;
  return delegate.create({ data });
}

async function audit(module, action, record) {
  await prisma.auditTrail.create({
    data: {
      module,
      action,
      recordId: record.id,
      recordLabel: record.code || record.title || record.filingNumber || record.id,
      responsible: record.owner || "FloraTrack Dossier Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const dossier = await ensure(
    prisma.dossierMaster,
    { code: "DOS-LIC-DER-GROW-2026" },
    {
      code: "DOS-LIC-DER-GROW-2026",
      title: "Expediente Maestro Licencia de Fabricación de Derivados Growlifecol S.A.S.",
      type: "Licencia Derivados",
      authority: "Ministerio de Justicia / INVIMA / Autoridades competentes",
      companyName: "Growlifecol S.A.S.",
      status: "En construcción",
      dueDate: addDays(45),
    }
  );
  await audit("Dossier Maestro", "SEED DOSSIER ENTERPRISE", dossier);

  const sections = [
    {
      code: "SEC-DER-001",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Información legal y corporativa",
      sectionNumber: "1.0",
      requirement: "Cámara de Comercio, RUT, representación legal, poderes y estructura societaria.",
      evidence: "Empresas, Usuarios, Roles, Permisos, Dossier.",
      owner: "Dirección General",
      status: "En construcción",
    },
    {
      code: "SEC-DER-002",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Licencias, cupos, PEAS y registros",
      sectionNumber: "2.0",
      requirement: "Licencias vigentes, cupos, PEAS, registros ICA, vencimientos y trazabilidad regulatoria.",
      evidence: "Licencias, Cupos, PEAS, Registros ICA, Vencimientos.",
      owner: "Responsable Regulatorio",
      status: "En revisión QA",
    },
    {
      code: "SEC-DER-003",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Sistema de calidad GACP/GMP",
      sectionNumber: "3.0",
      requirement: "SOP, registros, CAPA, desviaciones, riesgos, auditorías y control de cambios.",
      evidence: "SOP, Registros, Firmas, CAPA, Riesgos, Auditoría Sistema.",
      owner: "Director de Calidad",
      status: "En construcción",
    },
    {
      code: "SEC-DER-004",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Producción GMP y batch records",
      sectionNumber: "4.0",
      requirement: "Órdenes de producción, lotes, batch records, envasado, estabilidad y retención.",
      evidence: "Producción, Lotes, Batch Records, Envasado, Estabilidad, Retención.",
      owner: "Responsable GMP",
      status: "Pendiente",
    },
    {
      code: "SEC-DER-005",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Laboratorio, análisis y COA",
      sectionNumber: "5.0",
      requirement: "Muestras, análisis, resultados, COA, liberación y trazabilidad.",
      evidence: "Muestras, Análisis, COA, Liberación, Trazabilidad.",
      owner: "QA Manager",
      status: "En construcción",
    },
    {
      code: "SEC-DER-006",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Data Integrity, Part 11 y Annex 11",
      sectionNumber: "6.0",
      requirement: "ALCOA+, audit trail, revisión de accesos, firmas electrónicas, backup, CSV y validación.",
      evidence: "Data Integrity, ALCOA+, Validación CSV, Part 11, Annex 11.",
      owner: "Administrador FloraTrack",
      status: "En progreso",
    },
    {
      code: "SEC-DER-007",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      title: "Postmercado y farmacovigilancia",
      sectionNumber: "7.0",
      requirement: "Quejas, recall, devoluciones, farmacovigilancia, clientes y despachos.",
      evidence: "Clientes, Pedidos, Despachos, Quejas, Recall, Farmacovigilancia.",
      owner: "Director de Calidad",
      status: "Pendiente",
    },
  ];

  for (const item of sections) {
    const record = await ensure(prisma.dossierSection, { code: item.code }, item);
    await audit("Secciones Dossier", "SEED DOSSIER ENTERPRISE", record);
  }

  const submission = await ensure(
    prisma.dossierSubmission,
    { code: "RAD-DER-2026-001" },
    {
      code: "RAD-DER-2026-001",
      dossierCode: "DOS-LIC-DER-GROW-2026",
      authority: "Autoridad competente",
      filingNumber: "Pendiente de radicación",
      submittedAt: null,
      responseStatus: "No radicado",
      observations: "Expediente en fase de construcción técnica y documental.",
      status: "Preparación",
    }
  );
  await audit("Radicaciones", "SEED DOSSIER ENTERPRISE", submission);

  console.log("SEED DOSSIER / RADICACION ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
