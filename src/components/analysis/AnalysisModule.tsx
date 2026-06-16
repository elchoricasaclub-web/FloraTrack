"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function AnalysisModule() {
  const [samples, setSamples] = useState<Option[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const response = await fetch("/api/db/samples", { cache: "no-store" });
      const result = await response.json();

      if (result.ok) {
        setSamples(
          result.data.map((item: any) => ({
            label: item.code,
            value: item.id,
          }))
        );
      }
    }

    loadOptions();
  }, []);

  return (
    <DbCrudModule
      title="Análisis"
      description="Análisis conectados a base de datos real con muestra asociada, tipo, resultado, estado y trazabilidad hacia COA."
      apiPath="/api/db/analyses"
      buttonLabel="Nuevo Análisis"
      icon="🔬"
      emptyForm={{
        id: "",
        code: "",
        type: "Potencia",
        result: "",
        status: "Pendiente",
        sampleId: "",
      }}
      fields={[
        { name: "code", label: "Código análisis", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Potencia", value: "Potencia" },
            { label: "Microbiología", value: "Microbiología" },
            { label: "Metales pesados", value: "Metales pesados" },
            { label: "Pesticidas", value: "Pesticidas" },
            { label: "Solventes", value: "Solventes" },
            { label: "Terpenos", value: "Terpenos" },
          ],
        },
        { name: "result", label: "Resultado" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Rechazado", value: "Rechazado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
        {
          name: "sampleId",
          label: "Muestra",
          type: "select",
          options: samples,
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "type" },
        { label: "Resultado", accessor: "result" },
        { label: "Muestra", accessor: "sample.code" },
      ]}
    />
  );
}
