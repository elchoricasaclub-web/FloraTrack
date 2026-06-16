const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      code: "SUPER_ADMIN",
      name: "Super Administrador",
      level: "Super Admin",
      description: "Acceso total al sistema FloraTrack.",
    },
    {
      code: "QA_MANAGER",
      name: "Director de Calidad",
      level: "Calidad",
      description: "Gestión de calidad, auditoría, CAPA, COA y liberación.",
    },
    {
      code: "GACP_MANAGER",
      name: "Responsable GACP",
      level: "Operativo",
      description: "Gestión agrícola, predios, cultivos, cosechas y registros GACP.",
    },
    {
      code: "REGULATORY_MANAGER",
      name: "Responsable Regulatorio",
      level: "Regulatorio",
      description: "Gestión de licencias, cupos, PEAS, ICA, INVIMA y vencimientos.",
    },
    {
      code: "LAB_ANALYST",
      name: "Analista de Laboratorio",
      level: "Operativo",
      description: "Gestión de muestras, análisis y resultados.",
    },
  ];

  for (const role of roles) {
    await prisma.securityRole.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }

  const modules = [
    "Dashboard",
    "Empresas",
    "Usuarios",
    "Predios",
    "Cultivos",
    "Genéticas",
    "Cosecha",
    "Muestras",
    "Análisis",
    "COA",
    "Licencias",
    "Cupos",
    "PEAS",
    "Registros ICA",
    "INVIMA",
    "SOP",
    "Registros",
    "Firmas",
    "Auditoría",
    "CAPA",
    "Riesgos",
    "Reportes",
  ];

  const actions = ["Leer", "Crear", "Editar", "Eliminar", "Aprobar", "Firmar", "Exportar"];

  for (const moduleName of modules) {
    for (const action of actions) {
      const code = `${moduleName.toUpperCase().replaceAll(" ", "_")}_${action.toUpperCase()}`;

      await prisma.securityPermission.create({
        data: {
          code,
          module: moduleName,
          action,
          roleCode: "SUPER_ADMIN",
          description: `Permiso ${action} en módulo ${moduleName}`,
          status: "Activo",
        },
      }).catch(() => {});
    }
  }

  const settings = [
    {
      key: "APP_NAME",
      value: "FloraTrack",
      category: "General",
    },
    {
      key: "COMPLIANCE_MODE",
      value: "GACP_GMP_ENTERPRISE",
      category: "Calidad",
    },
    {
      key: "AUDIT_TRAIL_ENABLED",
      value: "true",
      category: "Seguridad",
    },
    {
      key: "BACKUP_POLICY",
      value: "Manual + programado",
      category: "Sistema",
    },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  const masterData = [
    {
      code: "MD_AREA_GACP",
      category: "Área",
      name: "GACP",
      value: "Buenas Prácticas Agrícolas y de Recolección",
    },
    {
      code: "MD_AREA_GMP",
      category: "Área",
      name: "GMP",
      value: "Buenas Prácticas de Manufactura",
    },
    {
      code: "MD_STATUS_APPROVED",
      category: "Estado",
      name: "Aprobado",
      value: "Registro aprobado por calidad",
    },
    {
      code: "MD_STATUS_QUARANTINE",
      category: "Estado",
      name: "Cuarentena",
      value: "Registro retenido hasta liberación",
    },
  ];

  for (const item of masterData) {
    await prisma.masterData.create({
      data: item,
    }).catch(() => {});
  }

  await prisma.backupRecord.create({
    data: {
      code: `BACKUP-${new Date().toISOString().slice(0, 10)}`,
      type: "Manual",
      fileName: "prisma/dev.db",
      status: "Creado",
      createdBy: "FloraTrack",
    },
  }).catch(() => {});

  console.log("Seed de seguridad, permisos, configuración y datos maestros completado.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
