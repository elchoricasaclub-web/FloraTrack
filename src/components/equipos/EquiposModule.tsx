"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EquiposModule() {
  return (
    <DbCrudModule
      title="Equipos"
      description="Equipos críticos conectados a Prisma con código, nombre, área, estado, calibraciones y mantenimiento."
      apiPath="/api/facility/equipment"
      buttonLabel="Nuevo Equipo"
      icon="⚙️"
      emptyForm={{
        id: "",
        code: "",
        name: "",
        area: "Laboratorio",
        status: "Activo",
      }}
      fields={[
        { name: "code", label: "Código equipo", required: true },
        { name: "name", label: "Nombre equipo", required: true },
        {
          name: "area",
          label: "Área",
          type: "select",
          options: [
            { label: "Cultivo", value: "Cultivo" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Extracción", value: "Extracción" },
            { label: "Almacén", value: "Almacén" },
            { label: "Calidad", value: "Calidad" },
            { label: "Mantenimiento", value: "Mantenimiento" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Activo", value: "Activo" },
            { label: "En mantenimiento", value: "En mantenimiento" },
            { label: "Fuera de servicio", value: "Fuera de servicio" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Equipo", accessor: "name" },
        { label: "Área", accessor: "area" },
        { label: "Calibraciones", accessor: "_count.calibrationRecords" },
        { label: "Mantenimientos", accessor: "_count.maintenanceRecords" },
      ]}
    />
  );
}
