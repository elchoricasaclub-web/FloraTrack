const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  let company = await prisma.company.findFirst({
    where: {
      name: "Growlifecol S.A.S.",
    },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "Growlifecol S.A.S.",
        nit: "Pendiente",
        city: "Colombia",
        status: "Activa",
      },
    });
  }

  const users = [
    {
      name: "Administrador FloraTrack",
      email: "admin@floratrack.com",
      role: "Super Admin",
    },
    {
      name: "Director Técnico",
      email: "calidad@growlifecol.com",
      role: "Director Calidad",
    },
    {
      name: "Operador GACP",
      email: "operador@growlifecol.com",
      role: "Operador GACP",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
        status: "Activo",
        companyId: company.id,
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: "Activo",
        companyId: company.id,
      },
    });
  }

  let farm = await prisma.farm.findFirst({
    where: {
      name: "Predio Principal Growlifecol",
    },
  });

  if (!farm) {
    farm = await prisma.farm.create({
      data: {
        name: "Predio Principal Growlifecol",
        city: "Colombia",
        areaHa: 0,
        status: "Activo",
        companyId: company.id,
      },
    });
  }

  let genetic = await prisma.genetic.findFirst({
    where: {
      name: "TIKUNA",
    },
  });

  if (!genetic) {
    genetic = await prisma.genetic.create({
      data: {
        name: "TIKUNA",
        origin: "Registro ICA / genética medicinal",
        type: "Cannabis medicinal",
        status: "Autorizada",
      },
    });
  }

  let crop = await prisma.crop.findFirst({
    where: {
      code: "CULTIVO-DEMO-001",
    },
  });

  if (!crop) {
    crop = await prisma.crop.create({
      data: {
        code: "CULTIVO-DEMO-001",
        stage: "Planeación",
        status: "Activo",
        farmId: farm.id,
        geneticId: genetic.id,
      },
    });
  }

  let harvest = await prisma.harvest.findFirst({
    where: {
      code: "COSECHA-DEMO-001",
    },
  });

  if (!harvest) {
    harvest = await prisma.harvest.create({
      data: {
        code: "COSECHA-DEMO-001",
        wetWeight: 0,
        status: "Pendiente",
        cropId: crop.id,
      },
    });
  }

  let sample = await prisma.sample.findFirst({
    where: {
      code: "MUESTRA-DEMO-001",
    },
  });

  if (!sample) {
    sample = await prisma.sample.create({
      data: {
        code: "MUESTRA-DEMO-001",
        type: "Flor",
        status: "Pendiente",
        harvestId: harvest.id,
      },
    });
  }

  let analysis = await prisma.analysis.findFirst({
    where: {
      code: "ANALISIS-DEMO-001",
    },
  });

  if (!analysis) {
    analysis = await prisma.analysis.create({
      data: {
        code: "ANALISIS-DEMO-001",
        type: "Potencia",
        result: "Pendiente",
        status: "Pendiente",
        sampleId: sample.id,
      },
    });
  }

  const existingCoa = await prisma.cOA.findFirst({
    where: {
      code: "COA-DEMO-001",
    },
  });

  if (!existingCoa) {
    await prisma.cOA.create({
      data: {
        code: "COA-DEMO-001",
        result: "Pendiente",
        status: "Pendiente",
        analysisId: analysis.id,
      },
    });
  }

  await prisma.auditTrail.create({
    data: {
      module: "Sistema",
      action: "SEED INICIAL BASE DE DATOS",
      recordId: company.id,
      recordLabel: company.name,
      responsible: "FloraTrack",
      status: "Completado",
      snapshot: JSON.stringify({
        company: company.name,
        farm: farm.name,
        genetic: genetic.name,
        crop: crop.code,
      }),
    },
  });

  console.log("Seed FloraTrack creado correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
