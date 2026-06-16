"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function PEASModule() {
  const [companies, setCompanies] = useState<Option[]>([]);

  useEffect(() => {
    async function loadCompanies() {
      const response = await fetch("/api/companies", { cache: "no-store" });
      const result = await response.json();

      if (result.ok) {
        setCompanies(
          result.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        );
      }
    }

    loadCompanies();
  }, []);

  return (
    <DbCrudModule
      title="PEAS"
      description="PEAS conectado a Prisma: código, genética, cantidad, empresa, estado, auditoría y trazabilidad regulatoria."
      apiPath="/api/regulatory/peas"
      buttonLabel="Nuevo PEAS"
      icon="🌱"
      emptyForm={{ id: "", code: "", geneticName: "", amount: "", status: "Borrador", companyId: "" }}
      fields={[
    { name: "code", label: "Código PEAS", required: true },
    { name: "geneticName", label: "Genética" },
    { name: "amount", label: "Cantidad", type: "number" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Borrador", value: "Borrador" },
        { label: "Radicado", value: "Radicado" },
        { label: "Aprobado", value: "Aprobado" },
        { label: "En ejecución", value: "En ejecución" },
        { label: "Cerrado", value: "Cerrado" }
      ]
    },
    { name: "companyId", label: "Empresa", type: "select", options: companies }
  ]}
      columns={[
    { label: "Código", accessor: "code" },
    { label: "Genética", accessor: "geneticName" },
    { label: "Cantidad", accessor: "amount" },
    { label: "Empresa", accessor: "company.name" }
  ]}
    />
  );
}
