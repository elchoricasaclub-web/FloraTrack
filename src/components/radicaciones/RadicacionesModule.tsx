"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RadicacionesModule() {
  return (
    <DbCrudModule
      title="Radicaciones"
      description="Control de radicaciones ante autoridades: dossier, autoridad, número de radicado, fecha, respuesta, observaciones y estado."
      apiPath="/api/dossier/submissions"
      buttonLabel="Nueva Radicación"
      icon="📨"
      emptyForm={{
        id: "",
        code: "",
        dossierCode: "",
        authority: "",
        filingNumber: "",
        submittedAt: "",
        responseStatus: "",
        observations: "",
        status: "Preparación",
      }}
      fields={[
        { name: "code", label: "Código radicación", required: true },
        { name: "dossierCode", label: "Dossier" },
        { name: "authority", label: "Autoridad" },
        { name: "filingNumber", label: "Número radicado" },
        { name: "submittedAt", label: "Fecha radicación", type: "date" },
        { name: "responseStatus", label: "Estado respuesta" },
        { name: "observations", label: "Observaciones" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Preparación", value: "Preparación" },
            { label: "Radicado", value: "Radicado" },
            { label: "En evaluación", value: "En evaluación" },
            { label: "Requerimiento", value: "Requerimiento" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Negado", value: "Negado" },
            { label: "Archivado", value: "Archivado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Dossier", accessor: "dossierCode" },
        { label: "Autoridad", accessor: "authority" },
        { label: "Radicado", accessor: "filingNumber" },
        { label: "Fecha", accessor: "submittedAt" },
      ]}
    />
  );
}
