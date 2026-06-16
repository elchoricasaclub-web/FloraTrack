"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function QuejasModule() {
  return (
    <DbCrudModule
      title="Quejas"
      description="Quejas y reclamos postmercado: producto, lote, tipo, descripción, severidad, estado, vencimiento y gestión QA."
      apiPath="/api/distribution/complaints"
      buttonLabel="Nueva Queja"
      icon="📣"
      emptyForm={{
        id: "",
        code: "",
        customerName: "",
        productName: "",
        batchCode: "",
        complaintType: "Calidad",
        description: "",
        severity: "Media",
        status: "Abierta",
        dueDate: "",
      }}
      fields={[
        { name: "code", label: "Código queja", required: true },
        { name: "customerName", label: "Cliente" },
        { name: "productName", label: "Producto" },
        { name: "batchCode", label: "Lote" },
        {
          name: "complaintType",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Calidad", value: "Calidad" },
            { label: "Evento adverso", value: "Evento adverso" },
            { label: "Empaque", value: "Empaque" },
            { label: "Entrega", value: "Entrega" },
            { label: "Documentación", value: "Documentación" },
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
            { label: "Abierta", value: "Abierta" },
            { label: "En investigación", value: "En investigación" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Recall requerido", value: "Recall requerido" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Cliente", accessor: "customerName" },
        { label: "Producto", accessor: "productName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Severidad", accessor: "severity" },
      ]}
    />
  );
}
