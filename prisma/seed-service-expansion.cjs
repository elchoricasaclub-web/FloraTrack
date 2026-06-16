const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertSafe(label, fn) {
  try {
    await fn();
    console.log("OK:", label);
  } catch (error) {
    console.log("WARN:", label, error.message);
  }
}

async function main() {
  await upsertSafe("ServiceLine CERT-LIC-COMPLIANCE", () =>
    prisma.serviceLine.upsert({
      where: { code: "CERT-LIC-COMPLIANCE" },
      update: {},
      create: {
        code: "CERT-LIC-COMPLIANCE",
        name: "Certificaciones, Licencias y Cumplimiento",
        category: "RegTech / Life Sciences",
        description:
          "Gestión de certificaciones, licencias, acreditaciones, normas, auditorías, evidencias, CAPA, vencimientos y expedientes.",
        targetIndustries:
          "Cannabis medicinal, flores farmacéuticas, laboratorios QC, micropropagación, extracción Live Rosin, fitoterapéuticos.",
        maturityLevel: "Core Enterprise",
        status: "Activo",
      },
    })
  );

  await upsertSafe("ServiceLine MICROPROPAGATION", () =>
    prisma.serviceLine.upsert({
      where: { code: "MICROPROPAGATION" },
      update: {},
      create: {
        code: "MICROPROPAGATION",
        name: "Micropropagación Vegetal",
        category: "Biotecnología Vegetal",
        description:
          "Trazabilidad de plantas madre, explantes, lotes in vitro, subcultivos, contaminación, aclimatación, salas limpias y certificación vegetal.",
        targetIndustries:
          "Laboratorios de propagación, cannabis medicinal, ornamentales, flores farmacéuticas, bancos genéticos.",
        maturityLevel: "Expansion",
        status: "Activo",
      },
    })
  );

  await upsertSafe("ServiceLine LIVE-ROSIN", () =>
    prisma.serviceLine.upsert({
      where: { code: "LIVE-ROSIN" },
      update: {},
      create: {
        code: "LIVE-ROSIN",
        name: "Live Rosin Solventless Batch Record",
        category: "Extracción / GMP",
        description:
          "Trazabilidad regulatoria desde biomasa, cadena de frío, Bubble Hash, liofilización, prensado, rendimiento, COA y liberación QA.",
        targetIndustries:
          "Cannabis medicinal, extractos solventless, laboratorios de derivados autorizados.",
        maturityLevel: "Expansion",
        status: "Activo",
      },
    })
  );

  const standards = [
    {
      code: "WHO-GACP",
      name: "WHO GACP Medicinal Plants",
      issuer: "World Health Organization",
      jurisdiction: "Internacional",
      standardType: "Guía regulatoria",
      applicability: "Cultivo, cosecha, recolección y manejo de plantas medicinales.",
      mandatoryLevel: "Recomendada / Premium internacional",
    },
    {
      code: "EMA-GACP",
      name: "EMA GACP Herbal Starting Materials",
      issuer: "European Medicines Agency",
      jurisdiction: "Unión Europea",
      standardType: "Guía científica/regulatoria",
      applicability: "Material vegetal medicinal de origen herbal.",
      mandatoryLevel: "Premium exportación UE",
    },
    {
      code: "EU-GMP",
      name: "EU GMP Volume 4",
      issuer: "European Commission",
      jurisdiction: "Unión Europea",
      standardType: "Guía GMP",
      applicability: "Fabricación, control de calidad, liberación y QMS farmacéutico.",
      mandatoryLevel: "Premium / obligatorio si mercado UE",
    },
    {
      code: "ISO-14644",
      name: "ISO 14644 Cleanrooms",
      issuer: "ISO",
      jurisdiction: "Internacional",
      standardType: "Estándar técnico",
      applicability: "Salas limpias, zonas limpias, clasificación de partículas y monitoreo.",
      mandatoryLevel: "Recomendada / Premium",
    },
    {
      code: "ISO-17025",
      name: "ISO/IEC 17025 Testing and Calibration Laboratories",
      issuer: "ISO/IEC",
      jurisdiction: "Internacional / ONAC Colombia",
      standardType: "Acreditación laboratorio",
      applicability: "Laboratorios de ensayo, calibración, métodos, incertidumbre y competencia técnica.",
      mandatoryLevel: "Premium / requerida por clientes o alcance acreditado",
    },
    {
      code: "COL-CANNABIS-811-227",
      name: "Marco Cannabis Colombia Decreto 811 / Resolución 227",
      issuer: "MinJusticia / MinSalud / FNE / ICA / INVIMA",
      jurisdiction: "Colombia",
      standardType: "Obligación legal",
      applicability: "Licencias, cupos, modalidades, cultivo, derivados, trámites y reportes.",
      mandatoryLevel: "Obligatoria",
    },
    {
      code: "ASTM-D37",
      name: "ASTM D37 Cannabis",
      issuer: "ASTM International",
      jurisdiction: "Internacional",
      standardType: "Estándar técnico cannabis",
      applicability: "Cannabis, productos, procesos, laboratorio, seguridad y calidad.",
      mandatoryLevel: "Voluntaria / Premium",
    },
  ];

  for (const standard of standards) {
    await upsertSafe(`Standard ${standard.code}`, () =>
      prisma.certificationStandardCatalog.upsert({
        where: { code: standard.code },
        update: {},
        create: {
          ...standard,
          status: "Vigente",
        },
      })
    );
  }

  const serviceCapabilities = [
    {
      serviceCode: "CERT-LIC-COMPLIANCE",
      capabilityName: "Perfil regulatorio multiempresa",
      moduleName: "Perfil regulatorio",
      processArea: "Regulatory Intelligence",
      description:
        "Define país, autoridades, licencias, operaciones autorizadas, productos, sedes y restricciones por cliente.",
      priority: "Crítica",
      status: "Activo",
    },
    {
      serviceCode: "CERT-LIC-COMPLIANCE",
      capabilityName: "Matriz normativa y checklist auditable",
      moduleName: "Matriz de requisitos",
      processArea: "Compliance",
      description:
        "Convierte normas, guías y licencias en requisitos, evidencias, SOP y responsables.",
      priority: "Crítica",
      status: "Activo",
    },
    {
      serviceCode: "MICROPROPAGATION",
      capabilityName: "Trazabilidad genética in vitro",
      moduleName: "Micropropagación",
      processArea: "Biotecnología vegetal",
      description:
        "Conecta planta madre, explante, lote in vitro, subcultivo, enraizamiento y aclimatación.",
      priority: "Alta",
      status: "Planeada",
    },
    {
      serviceCode: "LIVE-ROSIN",
      capabilityName: "Batch record solventless",
      moduleName: "Live Rosin",
      processArea: "Extracción GMP",
      description:
        "Registra biomasa, cadena de frío, fracciones, liofilización, prensado, rendimientos, COA y liberación.",
      priority: "Alta",
      status: "Planeada",
    },
  ];

  for (const capability of serviceCapabilities) {
    await upsertSafe(`Capability ${capability.capabilityName}`, () =>
      prisma.serviceCapability.create({
        data: capability,
      })
    );
  }

  const operationScopes = [
    {
      operationType: "Cultivo cannabis medicinal",
      country: "Colombia",
      requiredLicenses:
        "Licencia de semillas, cultivo psicoactivo/no psicoactivo, cupos cuando aplique.",
      requiredCertifications:
        "WHO GACP, EMA GACP, ISO 9001 recomendadas para mercado premium.",
      requiredAuthorities:
        "Ministerio de Justicia, MinSalud/FNE, ICA según alcance.",
      applicableStandards:
        "WHO-GACP, EMA-GACP, COL-CANNABIS-811-227.",
      status: "Activo",
    },
    {
      operationType: "Micropropagación vegetal",
      country: "Colombia",
      requiredLicenses:
        "Requisitos fitosanitarios, material vegetal, ICA según comercialización y propagación.",
      requiredCertifications:
        "ISO 14644, ISO 9001, ISO/IEC 17025 si laboratorio acredita ensayos.",
      requiredAuthorities:
        "ICA, autoridades fitosanitarias, ONAC si aplica acreditación.",
      applicableStandards:
        "ISO-14644, ISO-17025, WHO-GACP.",
      status: "Activo",
    },
    {
      operationType: "Extracción Live Rosin solventless",
      country: "Colombia",
      requiredLicenses:
        "Licencia de fabricación de derivados y autorizaciones sanitarias según producto.",
      requiredCertifications:
        "GMP, ASTM D37, ISO 9001, control de calidad y COA.",
      requiredAuthorities:
        "MinSalud/FNE, INVIMA, MinJusticia según modalidad y producto.",
      applicableStandards:
        "EU-GMP, ASTM-D37, COL-CANNABIS-811-227.",
      status: "Activo",
    },
  ];

  for (const scope of operationScopes) {
    await upsertSafe(`OperationScope ${scope.operationType}`, () =>
      prisma.regulatoryOperationScope.create({
        data: scope,
      })
    );
  }

  await upsertSafe("CompanyRegulatoryProfile FloraTrack Demo", () =>
    prisma.companyRegulatoryProfile.create({
      data: {
        companyName: "FloraTrack Demo / Growlifecol",
        country: "Colombia",
        operationTypes:
          "Cannabis medicinal, GACP, micropropagación, laboratorio QC, Live Rosin solventless, derivados.",
        licenseScope:
          "Semillas, cultivo, psicoactivo/no psicoactivo, fabricación derivados según licencia aplicable.",
        productScope:
          "Flores farmacéuticas, material vegetal, biomasa, extractos solventless, COA y productos terminados según autorización.",
        riskLevel: "Alto",
        status: "En estructuración",
      },
    })
  );

  await upsertSafe("Subscription FloraTrack Demo", () =>
    prisma.companyServiceSubscription.create({
      data: {
        companyName: "FloraTrack Demo / Growlifecol",
        serviceCode: "FULL-ENTERPRISE",
        modulesEnabled:
          "Certificaciones, Licencias, GACP, GMP, Micropropagación, Live Rosin, LIMS, QMS, Data Integrity, Audit Builder, Document Generator.",
        countryScope: "Colombia / Internacional",
        status: "Activo",
      },
    })
  );

  console.log("SEED SERVICE EXPANSION COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
