"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function CalificacionEquiposModule() {
  return (
    <DbCrudModule
      title="Calificación Equipos"
      description="DQ/IQ/OQ/PQ de equipos críticos, protocolos, reportes, responsables, estado y vencimiento."
      apiPath="/api/qualification/equipment"
      buttonLabel="Nueva Calificación"
      icon="🧪"
      emptyForm={{
        id: "",
        code: "",
        equipmentName: "",
        qualificationType: "IQ",
        protocolCode: "",
        reportCode: "",
        responsible: "",
        status: "Planificada",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código calificación", required: true },
        { name: "equipmentName", label: "Equipo", required: true },
        {
          name: "qualificationType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "DQ", value: "DQ" },
            { label: "IQ", value: "IQ" },
            { label: "OQ", value: "OQ" },
            { label: "PQ", value: "PQ" },
            { label: "Recalificación", value: "Recalificación" },
          ],
        },
        { name: "protocolCode", label: "Protocolo" },
        { name: "reportCode", label: "Reporte" },
        { name: "responsible", label: "Responsable" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Planificada", value: "Planificada" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Desviación", value: "Desviación" },
            { label: "Aprobada", value: "Aprobada" },
            { label: "Rechazada", value: "Rechazada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Equipo", accessor: "equipmentName" },
        { label: "Tipo", accessor: "qualificationType" },
        { label: "Protocolo", accessor: "protocolCode" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
