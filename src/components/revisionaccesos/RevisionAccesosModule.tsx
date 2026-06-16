"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RevisionAccesosModule() {
  return (
    <DbCrudModule
      title="Revisión Accesos"
      description="Revisión periódica de usuarios, roles, accesos, segregación de funciones, hallazgos y acciones correctivas."
      apiPath="/api/dataintegrity/access"
      buttonLabel="Nueva Revisión Acceso"
      icon="🔐"
      emptyForm={{
        id: "",
        code: "",
        period: "",
        userName: "",
        role: "",
        reviewer: "",
        finding: "",
        action: "",
        status: "Pendiente",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código revisión", required: true },
        { name: "period", label: "Periodo", required: true },
        { name: "userName", label: "Usuario" },
        { name: "role", label: "Rol" },
        { name: "reviewer", label: "Revisor" },
        { name: "finding", label: "Hallazgo" },
        { name: "action", label: "Acción" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Acción requerida", value: "Acción requerida" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Periodo", accessor: "period" },
        { label: "Usuario", accessor: "userName" },
        { label: "Rol", accessor: "role" },
        { label: "Revisor", accessor: "reviewer" },
      ]}
    />
  );
}
