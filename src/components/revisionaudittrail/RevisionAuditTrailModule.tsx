"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RevisionAuditTrailModule() {
  return (
    <DbCrudModule
      title="Revisión Audit Trail"
      description="Revisión periódica del audit trail: periodo, módulo, revisor, hallazgos, acciones, fecha límite y cierre QA."
      apiPath="/api/dataintegrity/audit-trail"
      buttonLabel="Nueva Revisión"
      icon="🕵️"
      emptyForm={{
        id: "",
        code: "",
        period: "",
        module: "Sistema",
        reviewer: "",
        findings: "",
        actions: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código revisión", required: true },
        { name: "period", label: "Periodo", required: true },
        { name: "module", label: "Módulo" },
        { name: "reviewer", label: "Revisor" },
        { name: "findings", label: "Hallazgos" },
        { name: "actions", label: "Acciones" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En revisión", value: "En revisión" },
            { label: "Con hallazgos", value: "Con hallazgos" },
            { label: "Cumple", value: "Cumple" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Periodo", accessor: "period" },
        { label: "Módulo", accessor: "module" },
        { label: "Revisor", accessor: "reviewer" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
