"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function NormativaModule() {
  return (
    <DbCrudModule
      title="Normativa"
      description="Biblioteca normativa nacional e internacional: Colombia, GACP, GMP, INVIMA, ICA, Part 11, Annex 11, OMS y estándares aplicables."
      apiPath="/api/compliance-regulatory/frameworks"
      buttonLabel="Nueva Norma"
      icon="⚖️"
      emptyForm={{
        id: "",
        code: "",
        country: "Colombia",
        authority: "",
        standard: "",
        scope: "",
        version: "",
        status: "Vigente",
        effectiveDate: "",
      }}
      fields={[
        { name: "code", label: "Código norma", required: true },
        { name: "country", label: "País" },
        { name: "authority", label: "Autoridad" },
        { name: "standard", label: "Norma / estándar", required: true },
        { name: "scope", label: "Alcance" },
        { name: "version", label: "Versión" },
        { name: "effectiveDate", label: "Fecha vigencia", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Vigente", value: "Vigente" },
            { label: "En revisión", value: "En revisión" },
            { label: "Derogada", value: "Derogada" },
            { label: "Referencia", value: "Referencia" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "País", accessor: "country" },
        { label: "Autoridad", accessor: "authority" },
        { label: "Norma", accessor: "standard" },
        { label: "Estado", accessor: "status" },
      ]}
    />
  );
}
