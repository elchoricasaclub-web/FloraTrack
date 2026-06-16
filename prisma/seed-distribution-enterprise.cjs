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
      recordLabel: record.code || record.name || record.productName || record.id,
      responsible: "FloraTrack Postmercado Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const customer = await ensure(
    prisma.customerAccount,
    { code: "CLI-CHC-001" },
    {
      code: "CLI-CHC-001",
      name: "Cannabis Health Center S.A.S.",
      type: "Clínica",
      city: "Bogotá",
      contact: "direccion@chc.local",
      status: "Activo",
    }
  );
  await audit("Clientes", "SEED POSTMERCADO ENTERPRISE", customer);

  const customer2 = await ensure(
    prisma.customerAccount,
    { code: "CLI-DROG-001" },
    {
      code: "CLI-DROG-001",
      name: "Droguería Aliada Nacional",
      type: "Droguería",
      city: "Villavicencio",
      contact: "compras@drogueria.local",
      status: "En evaluación",
    }
  );
  await audit("Clientes", "SEED POSTMERCADO ENTERPRISE", customer2);

  const order = await ensure(
    prisma.salesOrder,
    { code: "PED-2026-001" },
    {
      code: "PED-2026-001",
      customerName: "Cannabis Health Center S.A.S.",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      quantity: 500,
      unit: "unidades",
      status: "Aprobación QA",
      dueDate: addDays(6),
    }
  );
  await audit("Pedidos", "SEED POSTMERCADO ENTERPRISE", order);

  const dispatch = await ensure(
    prisma.dispatchRecord,
    { code: "DESP-2026-001" },
    {
      code: "DESP-2026-001",
      orderCode: "PED-2026-001",
      customerName: "Cannabis Health Center S.A.S.",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      quantity: 500,
      unit: "unidades",
      transporter: "Transportador autorizado",
      status: "Preparado",
      dispatchDate: addDays(7),
    }
  );
  await audit("Despachos", "SEED POSTMERCADO ENTERPRISE", dispatch);

  const returnRecord = await ensure(
    prisma.returnRecord,
    { code: "DEV-2026-001" },
    {
      code: "DEV-2026-001",
      customerName: "Cannabis Health Center S.A.S.",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      quantity: 2,
      unit: "unidades",
      reason: "Daño externo de empaque durante transporte",
      status: "En investigación",
    }
  );
  await audit("Devoluciones", "SEED POSTMERCADO ENTERPRISE", returnRecord);

  const complaint = await ensure(
    prisma.complaintRecord,
    { code: "QUEJA-2026-001" },
    {
      code: "QUEJA-2026-001",
      customerName: "Cannabis Health Center S.A.S.",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      complaintType: "Empaque",
      description: "Cliente reporta etiqueta parcialmente desprendida en dos unidades.",
      severity: "Media",
      status: "En investigación",
      dueDate: addDays(10),
    }
  );
  await audit("Quejas", "SEED POSTMERCADO ENTERPRISE", complaint);

  const recall = await ensure(
    prisma.recallRecord,
    { code: "RECALL-2026-001" },
    {
      code: "RECALL-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      reason: "Simulacro anual de retiro de producto",
      scope: "Interno",
      status: "Evaluación",
      startedAt: new Date(),
    }
  );
  await audit("Recall", "SEED POSTMERCADO ENTERPRISE", recall);

  const pv = await ensure(
    prisma.pharmacovigilanceCase,
    { code: "FV-2026-001" },
    {
      code: "FV-2026-001",
      productName: "Extracto Live Rosin Blueberry Indica",
      batchCode: "LOT-LR-2026-001",
      eventType: "Evento adverso",
      description: "Caso simulado para matriz de farmacovigilancia y seguimiento postmercado.",
      severity: "Media",
      status: "Abierto",
      dueDate: addDays(5),
    }
  );
  await audit("Farmacovigilancia", "SEED POSTMERCADO ENTERPRISE", pv);

  console.log("SEED COMERCIAL / POSTMERCADO ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
