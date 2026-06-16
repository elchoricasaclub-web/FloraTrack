"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function FarmacovigilanciaModule() {
  return (
    <DbCrudModule
      title="Farmacovigilancia"
      description="Casos postmercado y eventos adversos: producto, lote, tipo de evento, descripción, severidad, fecha límite, estado y auditoría."
      apiPath="/api/distribution/pharmacovigilance"
      buttonLabel="Nuevo Caso"
      icon="🩺"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        batchCode: "",
        eventType: "Evento adverso",
        description: "",
        severity: "Media",
        status: "Abierto",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código caso", required: true },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        {
          name: "eventType",
          label: "Tipo evento",
          type: "select",
          options: [
            { label: "Evento adverso", value: "Evento adverso" },
            { label: "Falta de eficacia", value: "Falta de eficacia" },
            { label: "Uso indebido", value: "Uso indebido" },
            { label: "Error de medicación", value: "Error de medicación" },
            { label: "Exposición accidental", value: "Exposición accidental" },
          ],
        },
        { name: "description", label: "Descripción" },
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
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Abierto", value: "Abierto" },
            { label: "En investigación", value: "En investigación" },
            { label: "Reportado a autoridad", value: "Reportado a autoridad" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Evento", accessor: "eventType" },
        { label: "Severidad", accessor: "severity" },
      ]}
    />
  );
}
