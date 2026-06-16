"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function SistemasCriticosModule() {
  return (
    <DbCrudModule
      title="Sistemas Críticos"
      description="Utilities y sistemas críticos: HVAC, agua, gases, electricidad, frío, monitoreo ambiental y data integrity."
      apiPath="/api/qualification/utilities"
      buttonLabel="Nuevo Sistema"
      icon="⚙️"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        systemType: "HVAC",
        area: "",
        criticality: "Alta",
        owner: "",
        status: "Activo",
        reviewDate: "",
      }}
      fields={[
        { name: "code", label: "Código sistema", required: true },
        { name: "name", label: "Sistema", required: true },
        {
          name: "systemType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "HVAC", value: "HVAC" },
            { label: "Agua purificada", value: "Agua purificada" },
            { label: "Aire comprimido", value: "Aire comprimido" },
            { label: "Energía", value: "Energía" },
            { label: "Cadena de frío", value: "Cadena de frío" },
            { label: "Monitoreo ambiental", value: "Monitoreo ambiental" },
          ],
        },
        { name: "area", label: "Área" },
        {
          name: "criticality",
          label: "Criticidad",
          type: "select",
          options: [
            { label: "Baja", value: "Baja" },
            { label: "Media", value: "Media" },
            { label: "Alta", value: "Alta" },
            { label: "Crítica", value: "Crítica" },
          ],
        },
        { name: "owner", label: "Responsable" },
        { name: "reviewDate", label: "Fecha revisión", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "En calificación", value: "En calificación" },
            { label: "Fuera de servicio", value: "Fuera de servicio" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Sistema", accessor: "name" },
        { label: "Tipo", accessor: "systemType" },
        { label: "Criticidad", accessor: "criticality" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
