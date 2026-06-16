"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function ClientesModule() {
  return (
    <DbCrudModule
      title="Clientes"
      description="Clientes, canales, droguerías, distribuidores, aliados comerciales y cuentas postmercado."
      apiPath="/api/distribution/customers"
      buttonLabel="Nuevo Cliente"
      icon="🤝"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        type: "Cliente",
        city: "",
        contact: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código cliente", required: true },
        { name: "name", label: "Nombre", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Cliente", value: "Cliente" },
            { label: "Droguería", value: "Droguería" },
            { label: "Distribuidor", value: "Distribuidor" },
            { label: "Clínica", value: "Clínica" },
            { label: "Aliado", value: "Aliado" },
            { label: "Autocultivador", value: "Autocultivador" },
          ],
        },
        { name: "city", label: "Ciudad" },
        { name: "contact", label: "Contacto" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "En evaluación", value: "En evaluación" },
            { label: "Bloqueado", value: "Bloqueado" },
            { label: "Inactivo", value: "Inactivo" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Nombre", accessor: "name" },
        { label: "Tipo", accessor: "type" },
        { label: "Ciudad", accessor: "city" },
        { label: "Contacto", accessor: "contact" },
      ]}
    />
  );
}
