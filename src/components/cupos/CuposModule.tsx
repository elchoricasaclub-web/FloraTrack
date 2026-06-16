"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function CuposModule() {
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
      title="Cupos"
      description="Cupos conectados a Prisma: código, tipo, cantidad, empresa, estado, trazabilidad y auditoría."
      apiPath="/api/regulatory/quotas"
      buttonLabel="Nuevo Cupo"
      icon="📊"
      emptyForm={{ id: "", code: "", type: "Ordinario", amount: "", status: "Solicitado", companyId: "" }}
      fields={[
    { name: "code", label: "Código cupo", required: true },
    {
      name: "type",
      label: "Tipo",
      type: "select",
      options: [
        { label: "Ordinario", value: "Ordinario" },
        { label: "Suplementario", value: "Suplementario" },
        { label: "Investigación", value: "Investigación" },
        { label: "Producción", value: "Producción" },
        { label: "Comercial", value: "Comercial" }
      ]
    },
    { name: "amount", label: "Cantidad", type: "number" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Solicitado", value: "Solicitado" },
        { label: "Aprobado", value: "Aprobado" },
        { label: "Ejecutado", value: "Ejecutado" },
        { label: "Cerrado", value: "Cerrado" }
      ]
    },
    { name: "companyId", label: "Empresa", type: "select", options: companies }
  ]}
      columns={[
    { label: "Código", accessor: "code" },
    { label: "Tipo", accessor: "type" },
    { label: "Cantidad", accessor: "amount" },
    { label: "Empresa", accessor: "company.name" }
  ]}
    />
  );
}
