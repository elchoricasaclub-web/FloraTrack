"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function FormulacionesModule() {
  return (
    <DbCrudModule
      title="Formulaciones"
      description="Desarrollo de formulaciones: producto, forma farmacéutica/cosmética, concentración objetivo, activo, excipientes y estado técnico."
      apiPath="/api/product-development/formulations"
      buttonLabel="Nueva Formulación"
      icon="🧴"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        dosageForm: "Extracto",
        targetStrength: "",
        activeIngredient: "",
        excipients: "",
        processStatus: "Desarrollo",
        owner: "",
        status: "Borrador",
      }}
      fields={[
        { name: "code", label: "Código formulación", required: true },
        { name: "productName", label: "Producto", required: true },
        {
          name: "dosageForm",
          label: "Forma",
          type: "select",
          options: [
            { label: "Extracto", value: "Extracto" },
            { label: "Flor medicinal", value: "Flor medicinal" },
            { label: "Aceite", value: "Aceite" },
            { label: "Crema", value: "Crema" },
            { label: "Sérum", value: "Sérum" },
            { label: "Cápsula", value: "Cápsula" },
          ],
        },
        { name: "targetStrength", label: "Concentración objetivo" },
        { name: "activeIngredient", label: "Activo" },
        { name: "excipients", label: "Excipientes / componentes" },
        {
          name: "processStatus",
          label: "Estado proceso",
          type: "select",
          options: [
            { label: "Desarrollo", value: "Desarrollo" },
            { label: "Piloto", value: "Piloto" },
            { label: "Validación", value: "Validación" },
            { label: "Transferido", value: "Transferido" },
          ],
        },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En revisión QA", value: "En revisión QA" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Obsoleta", value: "Obsoleta" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Forma", accessor: "dosageForm" },
        { label: "Activo", accessor: "activeIngredient" },
        { label: "Estado", accessor: "processStatus" },
      ]}
    />
  );
}
