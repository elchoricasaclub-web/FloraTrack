"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function EventosTrazabilidadModule() {
  return (
    <DbCrudModule
      title="Eventos de Trazabilidad"
      description="Eventos críticos trazables por módulo, registro, lote, responsable, fecha y estado."
      apiPath="/api/traceability-plus/events"
      buttonLabel="Nuevo Evento"
      icon="📍"
      emptyForm={{
        id: "",
        code: "",
        eventType: "Movimiento",
        module: "Producción",
        recordCode: "",
        batchCode: "",
        description: "",
        responsible: "",
        status: "Registrado",
        eventDate: "",
      }}
      fields={[
        { name: "code", label: "Código evento", required: true },
        {
          name: "eventType",
          label: "Tipo evento",
          type: "select",
          required: true,
          options: [
            { label: "Movimiento", value: "Movimiento" },
            { label: "Creación lote", value: "Creación lote" },
            { label: "Consumo material", value: "Consumo material" },
            { label: "Resultado laboratorio", value: "Resultado laboratorio" },
            { label: "Liberación QA", value: "Liberación QA" },
            { label: "Bloqueo", value: "Bloqueo" },
            { label: "Despacho", value: "Despacho" },
            { label: "Recall", value: "Recall" },
          ],
        },
        { name: "module", label: "Módulo" },
        { name: "recordCode", label: "Registro" },
        { name: "batchCode", label: "Lote" },
        { name: "description", label: "Descripción" },
        { name: "responsible", label: "Responsable" },
        { name: "eventDate", label: "Fecha evento", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Registrado", value: "Registrado" },
            { label: "Revisado", value: "Revisado" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Con alerta", value: "Con alerta" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Evento", accessor: "eventType" },
        { label: "Módulo", accessor: "module" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Responsable", accessor: "responsible" },
      ]}
    />
  );
}
