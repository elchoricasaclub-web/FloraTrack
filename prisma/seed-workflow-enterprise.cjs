const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function ensure(delegate, where, data) {
  const existing = await delegate.findFirst({ where });
  if (existing) return existing;
  return delegate.create({ data });
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function audit(module, action, record) {
  await prisma.auditTrail.create({
    data: {
      module,
      action,
      recordId: record.id,
      recordLabel: record.code || record.name || record.title || record.id,
      responsible: "FloraTrack Workflow Seed",
      status: record.status || "Activo",
      snapshot: JSON.stringify(record),
    },
  }).catch(() => {});
}

async function main() {
  const flows = [
    {
      code: "WF-SOP-APPROVAL",
      name: "Aprobación de SOP",
      module: "Documentos",
      description: "Autor → Revisor QA → Aprobador QA → Firma electrónica → Fecha efectiva.",
      status: "Activo",
    },
    {
      code: "WF-COA-RELEASE",
      name: "Liberación con COA",
      module: "Laboratorio",
      description: "Muestra → Análisis → COA → Revisión QA → Liberación de producto.",
      status: "Activo",
    },
    {
      code: "WF-CAPA-CLOSURE",
      name: "Cierre CAPA",
      module: "Calidad",
      description: "Hallazgo → Causa raíz → Acción correctiva → Acción preventiva → Eficacia → Cierre.",
      status: "Activo",
    },
    {
      code: "WF-CHANGE-CONTROL",
      name: "Control de Cambios",
      module: "Calidad",
      description: "Solicitud → Evaluación impacto → Aprobación → Implementación → Verificación.",
      status: "Activo",
    },
  ];

  for (const flow of flows) {
    const record = await ensure(prisma.workflowProcess, { code: flow.code }, flow);
    await audit("Flujos", "SEED WORKFLOW ENTERPRISE", record);
  }

  const approvals = [
    {
      code: "APR-SOP-001",
      module: "SOP",
      recordLabel: "SOP-GACP-001",
      requestedBy: "Responsable GACP",
      approver: "Director de Calidad",
      action: "Aprobar",
      status: "Pendiente",
      dueDate: addDays(3),
    },
    {
      code: "APR-COA-001",
      module: "COA",
      recordLabel: "COA-2026-001",
      requestedBy: "Analista Laboratorio",
      approver: "QA Manager",
      action: "Liberar",
      status: "Pendiente",
      dueDate: addDays(2),
    },
    {
      code: "APR-CSV-001",
      module: "Validación CSV",
      recordLabel: "CSV-OQ-001",
      requestedBy: "Administrador FloraTrack",
      approver: "QA Manager",
      action: "Firmar",
      status: "En revisión",
      dueDate: addDays(7),
    },
  ];

  for (const approval of approvals) {
    const record = await ensure(prisma.approvalRequest, { code: approval.code }, approval);
    await audit("Aprobaciones", "SEED WORKFLOW ENTERPRISE", record);
  }

  const tasks = [
    {
      code: "TASK-QA-001",
      title: "Revisar audit trail semanal",
      module: "Calidad",
      responsible: "Director de Calidad",
      priority: "Alta",
      status: "Pendiente",
      dueDate: addDays(5),
    },
    {
      code: "TASK-REG-001",
      title: "Actualizar matriz de vencimientos regulatorios",
      module: "Regulatorio",
      responsible: "Responsable Regulatorio",
      priority: "Alta",
      status: "En ejecución",
      dueDate: addDays(4),
    },
    {
      code: "TASK-LAB-001",
      title: "Verificar COA antes de liberación",
      module: "Laboratorio",
      responsible: "QA Manager",
      priority: "Crítica",
      status: "Pendiente",
      dueDate: addDays(1),
    },
    {
      code: "TASK-CSV-001",
      title: "Completar pruebas OQ de validación CSV",
      module: "Validación GxP",
      responsible: "Administrador FloraTrack",
      priority: "Alta",
      status: "Pendiente",
      dueDate: addDays(10),
    },
  ];

  for (const task of tasks) {
    const record = await ensure(prisma.taskItem, { code: task.code }, task);
    await audit("Tareas", "SEED WORKFLOW ENTERPRISE", record);
  }

  const notifications = [
    {
      code: "NOTIF-001",
      title: "Aprobación SOP pendiente",
      message: "Existe un SOP pendiente de aprobación QA.",
      module: "Workflow",
      severity: "Alta",
      status: "No leída",
    },
    {
      code: "NOTIF-002",
      title: "COA pendiente de liberación",
      message: "El COA-2026-001 requiere revisión antes de liberar producto.",
      module: "Laboratorio",
      severity: "Crítica",
      status: "No leída",
    },
    {
      code: "NOTIF-003",
      title: "Validación CSV en ejecución",
      message: "El protocolo CSV-OQ-001 se encuentra en fase de ejecución.",
      module: "Validación GxP",
      severity: "Media",
      status: "No leída",
    },
  ];

  for (const notification of notifications) {
    const record = await ensure(prisma.systemNotification, { code: notification.code }, notification);
    await audit("Notificaciones", "SEED WORKFLOW ENTERPRISE", record);
  }

  console.log("SEED WORKFLOW ENTERPRISE COMPLETO.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
