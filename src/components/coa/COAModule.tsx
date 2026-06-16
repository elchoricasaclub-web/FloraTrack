"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function COAModule() {
  const [analyses, setAnalyses] = useState<Option[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const response = await fetch("/api/db/analyses", { cache: "no-store" });
      const result = await response.json();

      if (result.ok) {
        setAnalyses(
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
      title="COA"
      description="Certificados de análisis conectados a base de datos real con análisis asociado, resultado, estado y trazabilidad completa."
      apiPath="/api/db/coas"
      buttonLabel="Nuevo COA"
      icon="📄"
      emptyForm={{
        id: "",
        code: "",
        result: "Pendiente",
        status: "Pendiente",
        analysisId: "",
      }}
      fields={[
        { name: "code", label: "Código COA", required: true },
        {
          name: "result",
          label: "Resultado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Cumple", value: "Cumple" },
            { label: "No cumple", value: "No cumple" },
            { label: "Condicionado", value: "Condicionado" },
          ],
        },
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
          name: "analysisId",
          label: "Análisis asociado",
          type: "select",
          required: true,
          options: analyses,
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Resultado", accessor: "result" },
        { label: "Análisis", accessor: "analysis.code" },
        { label: "Muestra", accessor: "analysis.sample.code" },
      ]}
    />
  );
}
