"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ResiduosModule() {
  return (
    <DbCrudModule
      title="Residuos"
      description="Gestión de residuos conectada a Prisma con tipo, cantidad, estado y auditoría ambiental."
      apiPath="/api/facility/waste"
      buttonLabel="Nuevo Residuo"
      icon="♻️"
      emptyForm={{
        id: "",
        code: "",
        type: "Orgánico",
        quantity: "",
        status: "Pendiente",
      }}
      fields={[
        { name: "code", label: "Código residuo", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Orgánico", value: "Orgánico" },
            { label: "Biológico", value: "Biológico" },
            { label: "Químico", value: "Químico" },
            { label: "Ordinario", value: "Ordinario" },
            { label: "Peligroso", value: "Peligroso" },
          ],
        },
        { name: "quantity", label: "Cantidad kg", type: "number" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Tratado", value: "Tratado" },
            { label: "Dispuesto", value: "Dispuesto" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "type" },
        { label: "Cantidad", accessor: "quantity" },
      ]}
    />
  );
}
