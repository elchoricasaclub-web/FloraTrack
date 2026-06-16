"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function LicenciasModule() {
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
      title="Licencias"
      description="Licencias conectadas a base de datos Prisma: número, tipo, autoridad, vencimiento, empresa, estado y auditoría regulatoria."
      apiPath="/api/regulatory/licenses"
      buttonLabel="Nueva Licencia"
      icon="📜"
      emptyForm={{ id: "", number: "", type: "Semillas", authority: "", status: "Vigente", expiresAt: "", companyId: "" }}
      fields={[
    { name: "number", label: "Número de licencia", required: true },
    {
      name: "type",
      label: "Tipo",
      type: "select",
      options: [
        { label: "Semillas", value: "Semillas" },
        { label: "Psicoactivo", value: "Psicoactivo" },
        { label: "No psicoactivo", value: "No psicoactivo" },
        { label: "Derivados", value: "Derivados" },
        { label: "Otro", value: "Otro" }
      ]
    },
    { name: "authority", label: "Autoridad" },
    { name: "expiresAt", label: "Vencimiento", type: "date" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Vigente", value: "Vigente" },
        { label: "Por vencer", value: "Por vencer" },
        { label: "Vencida", value: "Vencida" },
        { label: "Suspendida", value: "Suspendida" }
      ]
    },
    { name: "companyId", label: "Empresa", type: "select", options: companies }
  ]}
      columns={[
    { label: "Número", accessor: "number" },
    { label: "Tipo", accessor: "type" },
    { label: "Autoridad", accessor: "authority" },
    { label: "Vencimiento", accessor: "expiresAt" },
    { label: "Empresa", accessor: "company.name" }
  ]}
    />
  );
}
