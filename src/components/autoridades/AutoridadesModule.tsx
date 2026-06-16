"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function AutoridadesModule() {
  return (
    <DbCrudModule
      title="Autoridades"
      description="Autoridades conectadas a Prisma: entidad, contacto, área, estado, comunicaciones y auditoría."
      apiPath="/api/regulatory/authorities"
      buttonLabel="Nueva Autoridad"
      icon="🏢"
      emptyForm={{ id: "", name: "", contact: "", area: "", status: "Activa" }}
      fields={[
    { name: "name", label: "Autoridad", required: true },
    { name: "contact", label: "Contacto" },
    { name: "area", label: "Área" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Activa", value: "Activa" },
        { label: "Pendiente", value: "Pendiente" },
        { label: "Cerrada", value: "Cerrada" }
      ]
    }
  ]}
      columns={[
    { label: "Autoridad", accessor: "name" },
    { label: "Contacto", accessor: "contact" },
    { label: "Área", accessor: "area" }
  ]}
    />
  );
}
