"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function SeccionesDossierModule() {
  return (
    <DbCrudModule
      title="Secciones Dossier"
      description="Matriz de secciones, requisitos, evidencias, responsables y estado para cada expediente regulatorio o auditoría."
      apiPath="/api/dossier/sections"
      buttonLabel="Nueva Sección"
      icon="🧩"
      emptyForm={{
        id: "",
        code: "",
        dossierCode: "",
        title: "",
        sectionNumber: "",
        requirement: "",
        evidence: "",
        owner: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código sección", required: true },
        { name: "dossierCode", label: "Dossier" },
        { name: "title", label: "Título sección", required: true },
        { name: "sectionNumber", label: "Número sección" },
        { name: "requirement", label: "Requisito" },
        { name: "evidence", label: "Evidencia" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En construcción", value: "En construcción" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Aprobada", value: "Aprobada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Dossier", accessor: "dossierCode" },
        { label: "Sección", accessor: "sectionNumber" },
        { label: "Título", accessor: "title" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
