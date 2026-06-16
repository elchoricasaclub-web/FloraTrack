"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function VencimientosModule() {
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
      title="Vencimientos"
      description="Vencimientos conectados a Prisma: código, concepto, responsable, fecha límite, empresa, estado y alertas regulatorias."
      apiPath="/api/regulatory/expirations"
      buttonLabel="Nuevo Vencimiento"
      icon="⏰"
      emptyForm={{ id: "", code: "", concept: "", responsible: "", dueDate: "", status: "Pendiente", companyId: "" }}
      fields={[
    { name: "code", label: "Código", required: true },
    { name: "concept", label: "Concepto", required: true },
    { name: "responsible", label: "Responsable" },
    { name: "dueDate", label: "Fecha límite", type: "date" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Próximo", value: "Próximo" },
        { label: "Cumplido", value: "Cumplido" },
        { label: "Vencido", value: "Vencido" }
      ]
    },
    { name: "companyId", label: "Empresa", type: "select", options: companies }
  ]}
      columns={[
    { label: "Código", accessor: "code" },
    { label: "Concepto", accessor: "concept" },
    { label: "Responsable", accessor: "responsible" },
    { label: "Fecha límite", accessor: "dueDate" },
    { label: "Empresa", accessor: "company.name" }
  ]}
    />
  );
}
