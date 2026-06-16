"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function BOMModule() {
  return (
    <DbCrudModule
      title="BOM / Fórmula Maestra"
      description="Lista maestra de materiales por producto: materias primas, excipientes, empaques, cantidades, unidades y proveedor."
      apiPath="/api/product-development/bom"
      buttonLabel="Nuevo Material BOM"
      icon="🧾"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        materialName: "",
        materialCode: "",
        quantity: "",
        unit: "",
        supplierName: "",
        status: "Borrador",
      }}
      fields={[
        { name: "code", label: "Código BOM", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "materialName", label: "Material", required: true },
        { name: "materialCode", label: "Código material" },
        { name: "quantity", label: "Cantidad", type: "number" },
        { name: "unit", label: "Unidad" },
        { name: "supplierName", label: "Proveedor" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "Aprobado QA", value: "Aprobado QA" },
            { label: "En revisión", value: "En revisión" },
            { label: "Obsoleto", value: "Obsoleto" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Material", accessor: "materialName" },
        { label: "Cantidad", accessor: "quantity" },
        { label: "Unidad", accessor: "unit" },
      ]}
    />
  );
}
