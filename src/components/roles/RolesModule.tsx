"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RolesModule() {
  return (
    <DbCrudModule
      title="Roles"
      description="Roles enterprise RBAC conectados a Prisma: código, nivel, descripción, estado y auditoría."
      apiPath="/api/system/roles"
      buttonLabel="Nuevo Rol"
      icon="🔑"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        level: "Operativo",
        description: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código rol", required: true },
        { name: "name", label: "Nombre rol", required: true },
        {
          name: "level",
          label: "Nivel",
          type: "select",
          options: [
            { label: "Super Admin", value: "Super Admin" },
            { label: "Dirección", value: "Dirección" },
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Operativo", value: "Operativo" },
            { label: "Consulta", value: "Consulta" },
          ],
        },
        { name: "description", label: "Descripción" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Rol", accessor: "name" },
        { label: "Nivel", accessor: "level" },
        { label: "Descripción", accessor: "description" },
      ]}
    />
  );
}
