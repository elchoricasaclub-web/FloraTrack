"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ProveedoresModule() {
  return (
    <DbCrudModule
      title="Proveedores"
      description="Calificación y control de proveedores críticos con base de datos Prisma, estado de aprobación, categoría, contacto y auditoría."
      apiPath="/api/inventory/suppliers"
      buttonLabel="Nuevo Proveedor"
      icon="🤝"
      emptyForm={{
        id: "",
        name: "",
        nit: "",
        category: "Materia prima",
        contact: "",
        status: "Aprobado",
      }}
      fields={[
        { name: "name", label: "Proveedor", required: true },
        { name: "nit", label: "NIT / ID" },
        {
          name: "category",
          label: "Categoría",
          type: "select",
          options: [
            { label: "Materia prima", value: "Materia prima" },
            { label: "Insumo", value: "Insumo" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Mantenimiento", value: "Mantenimiento" },
            { label: "Servicio", value: "Servicio" },
            { label: "Transporte", value: "Transporte" },
          ],
        },
        { name: "contact", label: "Contacto" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Aprobado", value: "Aprobado" },
            { label: "Condicionado", value: "Condicionado" },
            { label: "Pendiente", value: "Pendiente" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
      ]}
      columns={[
        { label: "Proveedor", accessor: "name" },
        { label: "NIT / ID", accessor: "nit" },
        { label: "Categoría", accessor: "category" },
        { label: "Contacto", accessor: "contact" },
      ]}
    />
  );
}
