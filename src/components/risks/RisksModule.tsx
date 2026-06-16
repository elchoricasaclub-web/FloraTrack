"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RisksModule() {
  return (
    <DbCrudModule
      title="Riesgos"
      description="Matriz de riesgos conectada a Prisma con proceso, riesgo, probabilidad, impacto, nivel, control y estado."
      apiPath="/api/quality/risks"
      buttonLabel="Nuevo Riesgo"
      icon="⚠️"
      emptyForm={{
        id: "",
        code: "",
        process: "",
        risk: "",
        probability: "Media",
        impact: "Medio",
        level: "Medio",
        control: "",
        status: "Abierto",
      }}
      fields={[
        { name: "code", label: "Código riesgo", required: true },
        { name: "process", label: "Proceso" },
        { name: "risk", label: "Riesgo" },
        {
          name: "probability",
          label: "Probabilidad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
          ],
        },
        {
          name: "impact",
          label: "Impacto",
          type: "select",
          options: [
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
            { label: "Crítico", value: "Crítico" },
          ],
        },
        {
          name: "level",
          label: "Nivel",
          type: "select",
          options: [
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
            { label: "Crítico", value: "Crítico" },
          ],
        },
        { name: "control", label: "Control" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierto", value: "Abierto" },
            { label: "Mitigado", value: "Mitigado" },
            { label: "Aceptado", value: "Aceptado" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proceso", accessor: "process" },
        { label: "Riesgo", accessor: "risk" },
        { label: "Nivel", accessor: "level" },
        { label: "Control", accessor: "control" },
      ]}
    />
  );
}
