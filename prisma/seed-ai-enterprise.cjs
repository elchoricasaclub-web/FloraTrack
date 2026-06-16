const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const records = [
    {
      engine: "Auditor IA",
      module: "Data Integrity",
      category: "ALCOA+",
      title: "Revisión periódica de audit trail",
      finding: "El sistema ya registra eventos, pero debe tener revisión periódica documentada.",
      recommendation: "Crear frecuencia mensual de revisión de audit trail por QA y evidencia firmada.",
      severity: "Media",
      status: "Abierta",
    },
    {
      engine: "SOP IA",
      module: "SOP",
      category: "Biblioteca documental",
      title: "SOP maestro de integridad de datos",
      finding: "La operación GxP requiere un SOP específico para integridad de datos.",
      recommendation: "Crear SOP-DI-001 con reglas ALCOA+, revisión de audit trail, control de acceso, backup y firmas.",
      severity: "Alta",
      status: "Abierta",
    },
    {
      engine: "Riesgos IA",
      module: "Riesgos",
      category: "Liberación de lote",
      title: "Riesgo de liberación sin COA aprobado",
      finding: "El riesgo debe mantenerse en matriz y vincularse al flujo de productos.",
      recommendation: "Implementar bloqueo de liberación si no existe COA aprobado y firma QA.",
      severity: "Crítica",
      status: "Abierta",
    },
  ];

  for (const record of records) {
    const exists = await prisma.aiRecommendation.findFirst({
      where: {
        engine: record.engine,
        title: record.title,
      },
    });

    if (!exists) {
      const created = await prisma.aiRecommendation.create({
        data: record,
      });

      await prisma.auditTrail.create({
        data: {
          module: record.engine,
          action: "SEED IA ENTERPRISE",
          recordId: created.id,
          recordLabel: created.title,
          responsible: "Motor IA FloraTrack",
          status: created.status,
          snapshot: JSON.stringify(created),
        },
      });
    }
  }

  console.log("SEED IA ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
