"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RiesgoProveedoresModule() {
  return (
    <DbCrudModule
      title="Riesgo Proveedores"
      description="Perfil de riesgo del proveedor: área de riesgo, nivel, mitigación, responsable, revisión y estado."
      apiPath="/api/supplier-qa/risks"
      buttonLabel="Nuevo Riesgo"
      icon="⚠️"
      emptyForm={{
        id: "",
        code: "",
        supplierName: "",
        riskArea: "Calidad",
        riskLevel: "Medio",
        mitigation: "",
        owner: "",
        status: "Abierto",
        reviewDate: "",
      }}
      fields={[
        { name: "code", label: "Código riesgo", required: true },
        { name: "supplierName", label: "Proveedor", required: true },
        {
          name: "riskArea",
          label: "Área riesgo",
          type: "select",
          options: [
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Continuidad suministro", value: "Continuidad suministro" },
            { label: "Logística", value: "Logística" },
            { label: "Data Integrity", value: "Data Integrity" },
          ],
        },
        {
          name: "riskLevel",
          label: "Nivel",
          type: "select",
          options: [
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
            { label: "Crítico", value: "Crítico" },
          ],
        },
        { name: "mitigation", label: "Mitigación" },
        { name: "owner", label: "Responsable" },
        { name: "reviewDate", label: "Fecha revisión", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierto", value: "Abierto" },
            { label: "Mitigado", value: "Mitigado" },
            { label: "En monitoreo", value: "En monitoreo" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proveedor", accessor: "supplierName" },
        { label: "Área", accessor: "riskArea" },
        { label: "Nivel", accessor: "riskLevel" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
