"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function CadenaCustodiaModule() {
  return (
    <DbCrudModule
      title="Cadena de Custodia"
      description="Cadena de custodia de muestras: muestra, entrega, recibe, ubicación, fecha, estado y audit trail."
      apiPath="/api/lab-qa/custody"
      buttonLabel="Nueva Custodia"
      icon="🔗"
      emptyForm={{
        id: "",
        code: "",
        sampleCode: "",
        fromPerson: "",
        toPerson: "",
        location: "",
        transferDate: "",
        status: "Transferida",
      }}
      fields={[
        { name: "code", label: "Código custodia", required: true },
        { name: "sampleCode", label: "Muestra" },
        { name: "fromPerson", label: "Entrega" },
        { name: "toPerson", label: "Recibe" },
        { name: "location", label: "Ubicación" },
        { name: "transferDate", label: "Fecha transferencia", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Transferida", value: "Transferida" },
            { label: "Recibida", value: "Recibida" },
            { label: "En análisis", value: "En análisis" },
            { label: "Archivada", value: "Archivada" },
            { label: "Incidencia", value: "Incidencia" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Muestra", accessor: "sampleCode" },
        { label: "Entrega", accessor: "fromPerson" },
        { label: "Recibe", accessor: "toPerson" },
        { label: "Ubicación", accessor: "location" },
      ]}
    />
  );
}
