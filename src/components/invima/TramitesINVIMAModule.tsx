"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function TramitesINVIMAModule() {
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
      title="Trámites INVIMA"
      description="Trámites INVIMA conectados a Prisma: radicado, producto, categoría, empresa, estado, auditoría y trazabilidad."
      apiPath="/api/regulatory/invima"
      buttonLabel="Nuevo Trámite INVIMA"
      icon="🏛️"
      emptyForm={{ id: "", filingNumber: "", product: "", category: "Cosmético", status: "Borrador", companyId: "" }}
      fields={[
    { name: "filingNumber", label: "Radicado", required: true },
    { name: "product", label: "Producto", required: true },
    {
      name: "category",
      label: "Categoría",
      type: "select",
      options: [
        { label: "Cosmético", value: "Cosmético" },
        { label: "Fitoterapéutico", value: "Fitoterapéutico" },
        { label: "Alimento", value: "Alimento" },
        { label: "Dispositivo", value: "Dispositivo" },
        { label: "Otro", value: "Otro" }
      ]
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Borrador", value: "Borrador" },
        { label: "Radicado", value: "Radicado" },
        { label: "Requerido", value: "Requerido" },
        { label: "Aprobado", value: "Aprobado" },
        { label: "Negado", value: "Negado" }
      ]
    },
    { name: "companyId", label: "Empresa", type: "select", options: companies }
  ]}
      columns={[
    { label: "Radicado", accessor: "filingNumber" },
    { label: "Producto", accessor: "product" },
    { label: "Categoría", accessor: "category" },
    { label: "Empresa", accessor: "company.name" }
  ]}
    />
  );
}
