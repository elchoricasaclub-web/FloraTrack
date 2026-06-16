"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function MetodosAnaliticosModule() {
  return (
    <DbCrudModule
      title="Métodos Analíticos"
      description="Métodos analíticos LIMS/GMP: técnica, matriz, versión, responsable, estado y auditoría."
      apiPath="/api/lab-qa/methods"
      buttonLabel="Nuevo Método"
      icon="🔬"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        matrix: "Flor",
        technique: "HPLC",
        version: "1.0",
        owner: "",
        status: "Borrador",
      }}
      fields={[
        { name: "code", label: "Código método", required: true },
        { name: "title", label: "Título", required: true },
        {
          name: "matrix",
          label: "Matriz",
          type: "select",
          options: [
            { label: "Flor", value: "Flor" },
            { label: "Extracto", value: "Extracto" },
            { label: "Aceite", value: "Aceite" },
            { label: "Cosmético", value: "Cosmético" },
            { label: "Materia prima", value: "Materia prima" },
          ],
        },
        {
          name: "technique",
          label: "Técnica",
          type: "select",
          options: [
            { label: "HPLC", value: "HPLC" },
            { label: "GC-MS", value: "GC-MS" },
            { label: "ICP-MS", value: "ICP-MS" },
            { label: "Microbiología", value: "Microbiología" },
            { label: "Humedad", value: "Humedad" },
            { label: "Pesticidas", value: "Pesticidas" },
          ],
        },
        { name: "version", label: "Versión" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "Validado", value: "Validado" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Obsoleto", value: "Obsoleto" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Título", accessor: "title" },
        { label: "Matriz", accessor: "matrix" },
        { label: "Técnica", accessor: "technique" },
        { label: "Versión", accessor: "version" },
      ]}
    />
  );
}
