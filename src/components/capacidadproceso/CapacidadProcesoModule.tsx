"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function CapacidadProcesoModule() {
  return (
    <DbCrudModule
      title="Capacidad Proceso"
      description="Capacidad estadística de procesos críticos: Cpk, sigma, parámetros críticos, lote y conclusión QA."
      apiPath="/api/quality-intelligence/capability"
      buttonLabel="Nueva Capacidad"
      icon="📊"
      emptyForm={{
        id: "",
        code: "",
        processName: "",
        batchCode: "",
        parameter: "",
        cpk: "",
        sigmaLevel: "",
        conclusion: "",
        owner: "",
        status: "En análisis",
      }}
      fields={[
        { name: "code", label: "Código capacidad", required: true },
        { name: "processName", label: "Proceso", required: true },
        { name: "batchCode", label: "Lote" },
        { name: "parameter", label: "Parámetro", required: true },
        { name: "cpk", label: "Cpk", type: "number" },
        { name: "sigmaLevel", label: "Nivel sigma", type: "number" },
        { name: "conclusion", label: "Conclusión" },
        { name: "owner", label: "Responsable" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "En análisis", value: "En análisis" },
            { label: "Capaz", value: "Capaz" },
            { label: "No capaz", value: "No capaz" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrado", value: "Cerrado" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Proceso", accessor: "processName" },
        { label: "Lote", accessor: "batchCode" },
        { label: "Parámetro", accessor: "parameter" },
        { label: "Cpk", accessor: "cpk" },
      ]}
    />
  );
}
