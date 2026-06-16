"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function MatrizCumplimientoModule() {
  return (
    <DbCrudModule
      title="Matriz Cumplimiento"
      description="Evaluación de cumplimiento por requisito: evidencia, score, hallazgo, responsable, fecha límite y estado."
      apiPath="/api/standards/assessments"
      buttonLabel="Nueva Evaluación"
      icon="📊"
      emptyForm={{
        id: "",
        code: "",
        requirementCode: "",
        area: "Calidad",
        evidence: "",
        score: "",
        finding: "",
        status: "Pendiente",
        responsible: "",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código evaluación", required: true },
        { name: "requirementCode", label: "Requisito" },
        { name: "area", label: "Área" },
        { name: "evidence", label: "Evidencia" },
        { name: "score", label: "Score %", type: "number" },
        { name: "finding", label: "Hallazgo" },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En progreso", value: "En progreso" },
            { label: "Cumple", value: "Cumple" },
            { label: "Cumple parcialmente", value: "Cumple parcialmente" },
            { label: "No cumple", value: "No cumple" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Requisito", accessor: "requirementCode" },
        { label: "Área", accessor: "area" },
        { label: "Score", accessor: "score" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
