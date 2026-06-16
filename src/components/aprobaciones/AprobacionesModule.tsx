"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AprobacionesModule() {
  return (
    <DbCrudModule
      title="Aprobaciones"
      description="Bandeja de aprobaciones enterprise: módulo, registro, solicitante, aprobador, acción requerida, fecha límite, estado y auditoría."
      apiPath="/api/workflow/approvals"
      buttonLabel="Nueva Aprobación"
      icon="✅"
      emptyForm={{
        id: "",
        code: "",
        module: "Calidad",
        recordLabel: "",
        requestedBy: "",
        approver: "",
        action: "Aprobar",
        status: "Pendiente",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código aprobación", required: true },
        {
          name: "module",
          label: "Módulo",
          type: "select",
          required: true,
          options: [
            { label: "SOP", value: "SOP" },
            { label: "COA", value: "COA" },
            { label: "CAPA", value: "CAPA" },
            { label: "Control de Cambios", value: "Control de Cambios" },
            { label: "Liberación", value: "Liberación" },
            { label: "Validación CSV", value: "Validación CSV" },
            { label: "Regulatorio", value: "Regulatorio" },
          ],
        },
        { name: "recordLabel", label: "Registro" },
        { name: "requestedBy", label: "Solicitado por" },
        { name: "approver", label: "Aprobador" },
        {
          name: "action",
          label: "Acción",
          type: "select",
          options: [
            { label: "Revisar", value: "Revisar" },
            { label: "Aprobar", value: "Aprobar" },
            { label: "Firmar", value: "Firmar" },
            { label: "Liberar", value: "Liberar" },
            { label: "Rechazar", value: "Rechazar" },
          ],
        },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Vencido", value: "Vencido" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Módulo", accessor: "module" },
        { label: "Registro", accessor: "recordLabel" },
        { label: "Aprobador", accessor: "approver" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
