"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function RegistrosModule() {
  const [sops, setSops] = useState<Option[]>([]);

  useEffect(() => {
    async function loadSops() {
      const response = await fetch("/api/documents/sops", {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.ok) {
        setSops(
          result.data.map((item: any) => ({
            label: `${item.code} · ${item.title}`,
            value: item.id,
          }))
        );
      }
    }

    loadSops();
  }, []);

  return (
    <DbCrudModule
      title="Registros"
      description="Registros controlados conectados a Prisma: formatos, evidencias, bitácoras, estado documental, SOP asociado y firmas."
      apiPath="/api/documents/records"
      buttonLabel="Nuevo Registro"
      icon="📑"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        type: "Formato",
        status: "Borrador",
        sopId: "",
      }}
      fields={[
        { name: "code", label: "Código registro", required: true },
        { name: "title", label: "Título", required: true },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Formato", value: "Formato" },
            { label: "Bitácora", value: "Bitácora" },
            { label: "Evidencia", value: "Evidencia" },
            { label: "Acta", value: "Acta" },
            { label: "Certificado", value: "Certificado" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Borrador", value: "Borrador" },
            { label: "En revisión", value: "En revisión" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Obsoleto", value: "Obsoleto" },
          ],
        },
        {
          name: "sopId",
          label: "SOP asociado",
          type: "select",
          options: sops,
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Título", accessor: "title" },
        { label: "Tipo", accessor: "type" },
        { label: "SOP", accessor: "sop.code" },
      ]}
    />
  );
}
