"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function TareasModule() {
  return (
    <DbCrudModule
      title="Tareas"
      description="Bandeja operacional enterprise para tareas GACP/GMP: responsable, módulo, prioridad, fecha límite, estado y auditoría."
      apiPath="/api/workflow/tasks"
      buttonLabel="Nueva Tarea"
      icon="📌"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        module: "Calidad",
        responsible: "",
        priority: "Media",
        status: "Pendiente",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código tarea", required: true },
        { name: "title", label: "Título", required: true },
        {
          name: "module",
          label: "Módulo",
          type: "select",
          options: [
            { label: "GACP", value: "GACP" },
            { label: "GMP", value: "GMP" },
            { label: "Calidad", value: "Calidad" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Inventario", value: "Inventario" },
            { label: "Facility", value: "Facility" },
            { label: "Sistema", value: "Sistema" },
          ],
        },
        { name: "responsible", label: "Responsable" },
        {
          name: "priority",
          label: "Prioridad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
            { label: "Crítica", value: "Crítica" },
          ],
        },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Bloqueada", value: "Bloqueada" },
            { label: "Completada", value: "Completada" },
            { label: "Vencida", value: "Vencida" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tarea", accessor: "title" },
        { label: "Módulo", accessor: "module" },
        { label: "Responsable", accessor: "responsible" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
