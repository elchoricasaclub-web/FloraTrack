"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function DossierMaestroModule() {
  return (
    <DbCrudModule
      title="Dossier Maestro"
      description="Expedientes maestros regulatorios, técnicos, GACP/GMP, INVIMA, ICA, licencias, derivados y auditorías."
      apiPath="/api/dossier/masters"
      buttonLabel="Nuevo Dossier"
      icon="📚"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        type: "Regulatorio",
        authority: "",
        companyName: "",
        status: "Borrador",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código dossier", required: true },
        { name: "title", label: "Título", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Licencia Derivados", value: "Licencia Derivados" },
            { label: "GACP", value: "GACP" },
            { label: "GMP", value: "GMP" },
            { label: "INVIMA", value: "INVIMA" },
            { label: "ICA", value: "ICA" },
            { label: "Auditoría", value: "Auditoría" },
            { label: "Validación GxP", value: "Validación GxP" },
          ],
        },
        { name: "authority", label: "Autoridad" },
        { name: "companyName", label: "Empresa" },
        { name: "dueDate", label: "Fecha objetivo", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En construcción", value: "En construcción" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Listo para radicar", value: "Listo para radicar" },
            { label: "Radicado", value: "Radicado" },
            { label: "Aprobado", value: "Aprobado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Título", accessor: "title" },
        { label: "Tipo", accessor: "type" },
        { label: "Autoridad", accessor: "authority" },
        { label: "Fecha objetivo", accessor: "dueDate" },
      ]}
    />
  );
}
