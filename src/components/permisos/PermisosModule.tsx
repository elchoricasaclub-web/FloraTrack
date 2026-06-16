"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function PermisosModule() {
  return (
    <DbCrudModule
      title="Permisos"
      description="Permisos RBAC por módulo, acción y rol. Base para control granular enterprise GACP/GMP."
      apiPath="/api/system/permissions"
      buttonLabel="Nuevo Permiso"
      icon="🛡️"
      emptyForm={{
        id: "",
        code: "",
        module: "",
        action: "Leer",
        roleCode: "",
        description: "",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código permiso", required: true },
        { name: "module", label: "Módulo", required: true },
        {
          name: "action",
          label: "Acción",
          type: "select",
          options: [
            { label: "Leer", value: "Leer" },
            { label: "Crear", value: "Crear" },
            { label: "Editar", value: "Editar" },
            { label: "Eliminar", value: "Eliminar" },
            { label: "Aprobar", value: "Aprobar" },
            { label: "Firmar", value: "Firmar" },
            { label: "Exportar", value: "Exportar" },
          ],
        },
        { name: "roleCode", label: "Código rol" },
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
        { label: "Módulo", accessor: "module" },
        { label: "Acción", accessor: "action" },
        { label: "Rol", accessor: "roleCode" },
      ]}
    />
  );
}
