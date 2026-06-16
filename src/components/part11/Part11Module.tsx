"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function Part11Module() {
  return (
    <DbCrudModule
      title="21 CFR Part 11"
      description="Controles de registros electrónicos y firmas electrónicas: audit trail, seguridad, integridad de datos, control de acceso y evidencia."
      apiPath="/api/compliance/controls"
      buttonLabel="Nuevo Control Part 11"
      icon="🔐"
      emptyForm={{
        id: "",
        code: "",
        regulation: "21 CFR Part 11",
        control: "",
        evidence: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código control", required: true },
        {
          name: "regulation",
          label: "Regulación",
          type: "select",
          options: [
            { label: "21 CFR Part 11", value: "21 CFR Part 11" },
            { label: "EU Annex 11", value: "EU Annex 11" },
            { label: "WHO Data Integrity", value: "WHO Data Integrity" },
          ],
        },
        { name: "control", label: "Control" },
        { name: "evidence", label: "Evidencia" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Implementado", value: "Implementado" },
            { label: "Verificado", value: "Verificado" },
            { label: "Brecha", value: "Brecha" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Regulación", accessor: "regulation" },
        { label: "Control", accessor: "control" },
        { label: "Evidencia", accessor: "evidence" },
      ]}
    />
  );
}
