"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function NotificacionesModule() {
  return (
    <DbCrudModule
      title="Notificaciones"
      description="Centro de notificaciones enterprise: alertas de calidad, regulatorias, workflow, vencimientos, IA y sistema."
      apiPath="/api/workflow/notifications"
      buttonLabel="Nueva Notificación"
      icon="🔔"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        message: "",
        module: "Sistema",
        severity: "Media",
        status: "No leída",
      }}
      fields={[
        { name: "code", label: "Código notificación", required: true },
        { name: "title", label: "Título", required: true },
        { name: "message", label: "Mensaje" },
        {
          name: "module",
          label: "Módulo",
          type: "select",
          options: [
            { label: "Sistema", value: "Sistema" },
            { label: "Calidad", value: "Calidad" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Inventario", value: "Inventario" },
            { label: "Workflow", value: "Workflow" },
            { label: "IA", value: "IA" },
          ],
        },
        {
          name: "severity",
          label: "Severidad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
            { label: "Crítica", value: "Crítica" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "No leída", value: "No leída" },
            { label: "Leída", value: "Leída" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Título", accessor: "title" },
        { label: "Módulo", accessor: "module" },
        { label: "Severidad", accessor: "severity" },
      ]}
    />
  );
}
