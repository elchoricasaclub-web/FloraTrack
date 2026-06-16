"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ALCOAModule() {
  return (
    <DbCrudModule
      title="ALCOA+"
      description="Matriz de integridad de datos ALCOA+: atribuible, legible, contemporáneo, original, exacto, completo, consistente, perdurable y disponible."
      apiPath="/api/dataintegrity/reviews"
      buttonLabel="Nuevo Control ALCOA+"
      icon="🧬"
      emptyForm={{
        id: "",
        code: "",
        principle: "Attributable",
        area: "Sistema",
        finding: "",
        evidence: "",
        score: "",
        responsible: "",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código control", required: true },
        {
          name: "principle",
          label: "Principio ALCOA+",
          type: "select",
          required: true,
          options: [
            { label: "Attributable", value: "Attributable" },
            { label: "Legible", value: "Legible" },
            { label: "Contemporaneous", value: "Contemporaneous" },
            { label: "Original", value: "Original" },
            { label: "Accurate", value: "Accurate" },
            { label: "Complete", value: "Complete" },
            { label: "Consistent", value: "Consistent" },
            { label: "Enduring", value: "Enduring" },
            { label: "Available", value: "Available" },
          ],
        },
        { name: "area", label: "Área" },
        { name: "finding", label: "Hallazgo" },
        { name: "evidence", label: "Evidencia" },
        { name: "score", label: "Score %", type: "number" },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierta", value: "Abierta" },
            { label: "En progreso", value: "En progreso" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Principio", accessor: "principle" },
        { label: "Área", accessor: "area" },
        { label: "Score", accessor: "score" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
