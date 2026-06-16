"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AprobacionMaterialesModule() {
  return (
    <DbCrudModule
      title="Aprobación Materiales"
      description="Aprobación QA de materiales por proveedor: materia prima, insumo, empaque, especificación y estado."
      apiPath="/api/supplier-qa/materials"
      buttonLabel="Nueva Aprobación"
      icon="📦"
      emptyForm={{
        id: "",
        code: "",
        supplierName: "",
        materialName: "",
        materialCode: "",
        specification: "",
        approvalStatus: "Pendiente",
        owner: "",
      }}
      fields={[
        { name: "code", label: "Código aprobación", required: true },
        { name: "supplierName", label: "Proveedor" },
        { name: "materialName", label: "Material", required: true },
        { name: "materialCode", label: "Código material" },
        { name: "specification", label: "Especificación" },
        { name: "owner", label: "Responsable" },
        {
          name: "approvalStatus",
          label: "Estado aprobación",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Aprobado condicional", value: "Aprobado condicional" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proveedor", accessor: "supplierName" },
        { label: "Material", accessor: "materialName" },
        { label: "Código material", accessor: "materialCode" },
        { label: "Estado", accessor: "approvalStatus" },
      ]}
    />
  );
}
