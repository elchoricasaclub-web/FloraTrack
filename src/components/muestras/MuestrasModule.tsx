"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function MuestrasModule() {
  const [harvests, setHarvests] = useState<Option[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const response = await fetch("/api/db/harvests", { cache: "no-store" });
      const result = await response.json();

      if (result.ok) {
        setHarvests(
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
      title="Muestras"
      description="Muestras conectadas a base de datos real con cosecha origen, tipo, estado y trazabilidad hacia análisis."
      apiPath="/api/db/samples"
      buttonLabel="Nueva Muestra"
      icon="🧪"
      emptyForm={{
        id: "",
        code: "",
        type: "Flor",
        status: "Pendiente",
        harvestId: "",
      }}
      fields={[
        { name: "code", label: "Código muestra", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Flor", value: "Flor" },
            { label: "Extracto", value: "Extracto" },
            { label: "Suelo", value: "Suelo" },
            { label: "Agua", value: "Agua" },
            { label: "Producto terminado", value: "Producto terminado" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Recibida", value: "Recibida" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Bloqueado", value: "Bloqueado" },
          ],
        },
        {
          name: "harvestId",
          label: "Cosecha",
          type: "select",
          options: harvests,
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Tipo", accessor: "type" },
        { label: "Cosecha", accessor: "harvest.code" },
        { label: "Cultivo", accessor: "harvest.crop.code" },
      ]}
    />
  );
}
