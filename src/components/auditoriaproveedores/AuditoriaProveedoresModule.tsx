"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AuditoriaProveedoresModule() {
  return (
    <DbCrudModule
      title="Auditoría Proveedores"
      description="Auditorías de proveedores críticos: tipo, auditor, hallazgos, score, fecha, estado y seguimiento."
      apiPath="/api/supplier-qa/audits"
      buttonLabel="Nueva Auditoría"
      icon="🕵️"
      emptyForm={{
        id: "",
        code: "",
        supplierName: "",
        auditType: "Documental",
        auditor: "",
        findings: "",
        score: "",
        status: "Programada",
        auditDate: "",
      }}
      fields={[
        { name: "code", label: "Código auditoría", required: true },
        { name: "supplierName", label: "Proveedor", required: true },
        {
          name: "auditType",
          label: "Tipo auditoría",
          type: "select",
          options: [
            { label: "Documental", value: "Documental" },
            { label: "En sitio", value: "En sitio" },
            { label: "Remota", value: "Remota" },
            { label: "Seguimiento CAPA", value: "Seguimiento CAPA" },
          ],
        },
        { name: "auditor", label: "Auditor" },
        { name: "findings", label: "Hallazgos" },
        { name: "score", label: "Score %", type: "number" },
        { name: "auditDate", label: "Fecha auditoría", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Programada", value: "Programada" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Con hallazgos", value: "Con hallazgos" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proveedor", accessor: "supplierName" },
        { label: "Tipo", accessor: "auditType" },
        { label: "Auditor", accessor: "auditor" },
        { label: "Score", accessor: "score" },
      ]}
    />
  );
}
