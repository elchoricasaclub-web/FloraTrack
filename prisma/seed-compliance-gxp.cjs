const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function ensure(delegate, where, data) {
  const existing = await delegate.findFirst({ where });
  if (existing) return existing;
  return delegate.create({ data });
}

async function main() {
  const protocols = [
    {
      code: "CSV-URS-001",
      type: "URS",
      scope: "Requerimientos de usuario para plataforma FloraTrack GACP/GMP.",
      responsible: "QA Manager",
      status: "Aprobado",
    },
    {
      code: "CSV-IQ-001",
      type: "IQ",
      scope: "Verificación de instalación local Next.js, Prisma y SQLite.",
      responsible: "Administrador FloraTrack",
      status: "Aprobado",
    },
    {
      code: "CSV-OQ-001",
      type: "OQ",
      scope: "Verificación operacional de módulos críticos CRUD, auditoría y reportes.",
      responsible: "QA Manager",
      status: "En ejecución",
    },
    {
      code: "CSV-PQ-001",
      type: "PQ",
      scope: "Prueba de desempeño con flujo de cultivo, muestra, análisis, COA y liberación.",
      responsible: "Responsable GACP",
      status: "Borrador",
    },
  ];

  for (const protocol of protocols) {
    const record = await ensure(prisma.validationProtocol, { code: protocol.code }, protocol);

    await prisma.auditTrail.create({
      data: {
        module: "Validación CSV",
        action: "SEED ENTERPRISE",
        recordId: record.id,
        recordLabel: record.code,
        responsible: "FloraTrack Enterprise Seed",
        status: record.status,
        snapshot: JSON.stringify(record),
      },
    }).catch(() => {});
  }

  const tests = [
    {
      code: "TEST-AUDIT-001",
      protocolCode: "CSV-OQ-001",
      requirement: "El sistema debe registrar auditoría de creación, edición y eliminación.",
      expectedResult: "Evento auditado con módulo, acción, usuario, estado y snapshot.",
      actualResult: "Cumple en CRUD enterprise.",
      status: "Aprobado",
    },
    {
      code: "TEST-BACKUP-001",
      protocolCode: "CSV-OQ-001",
      requirement: "El sistema debe exportar backup completo en JSON.",
      expectedResult: "Archivo JSON descargable con todos los dominios.",
      actualResult: "Cumple mediante /api/enterprise/backup.",
      status: "Aprobado",
    },
    {
      code: "TEST-TRACE-001",
      protocolCode: "CSV-PQ-001",
      requirement: "El sistema debe reconstruir trazabilidad cultivo-cosecha-muestra-análisis-COA.",
      expectedResult: "Cadena visible en módulo Trazabilidad.",
      actualResult: "Pendiente de prueba formal PQ.",
      status: "Pendiente",
    },
  ];

  for (const test of tests) {
    const record = await ensure(prisma.validationTest, { code: test.code }, test);

    await prisma.auditTrail.create({
      data: {
        module: "Pruebas de Validación",
        action: "SEED ENTERPRISE",
        recordId: record.id,
        recordLabel: record.code,
        responsible: "FloraTrack Enterprise Seed",
        status: record.status,
        snapshot: JSON.stringify(record),
      },
    }).catch(() => {});
  }

  const controls = [
    {
      code: "P11-001",
      regulation: "21 CFR Part 11",
      control: "Audit trail seguro, generado automáticamente y disponible para revisión.",
      evidence: "Módulo Auditoría Sistema + /api/audit",
      status: "Implementado",
    },
    {
      code: "P11-002",
      regulation: "21 CFR Part 11",
      control: "Firmas electrónicas asociadas a SOP y registros.",
      evidence: "Módulo Firmas + ElectronicSignature",
      status: "Implementado",
    },
    {
      code: "P11-003",
      regulation: "21 CFR Part 11",
      control: "Control de acceso por roles y permisos.",
      evidence: "Módulos Roles y Permisos",
      status: "Implementado",
    },
    {
      code: "A11-001",
      regulation: "EU Annex 11",
      control: "Validación de sistema computarizado documentada.",
      evidence: "Módulo Validación CSV",
      status: "Implementado",
    },
    {
      code: "A11-002",
      regulation: "EU Annex 11",
      control: "Backup y restauración con evidencia documental.",
      evidence: "Módulo Backup Enterprise",
      status: "Implementado",
    },
    {
      code: "A11-003",
      regulation: "EU Annex 11",
      control: "Gestión de cambios para modificaciones del sistema.",
      evidence: "Módulo Control de Cambios",
      status: "Implementado",
    },
  ];

  for (const control of controls) {
    const record = await ensure(prisma.electronicRecordControl, { code: control.code }, control);

    await prisma.auditTrail.create({
      data: {
        module: record.regulation,
        action: "SEED ENTERPRISE",
        recordId: record.id,
        recordLabel: record.code,
        responsible: "FloraTrack Enterprise Seed",
        status: record.status,
        snapshot: JSON.stringify(record),
      },
    }).catch(() => {});
  }

  console.log("SEED CSV / PART 11 / ANNEX 11 COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
