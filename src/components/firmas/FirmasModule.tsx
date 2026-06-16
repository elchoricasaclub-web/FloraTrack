"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function FirmasModule() {
  const [sops, setSops] = useState<Option[]>([]);
  const [records, setRecords] = useState<Option[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const [sopsResponse, recordsResponse] = await Promise.all([
        fetch("/api/documents/sops", { cache: "no-store" }),
        fetch("/api/documents/records", { cache: "no-store" }),
      ]);

      const sopsResult = await sopsResponse.json();
      const recordsResult = await recordsResponse.json();

      if (sopsResult.ok) {
        setSops(
          sopsResult.data.map((item: any) => ({
            label: `${item.code} · ${item.title}`,
            value: item.id,
          }))
        );
      }

      if (recordsResult.ok) {
        setRecords(
          recordsResult.data.map((item: any) => ({
            label: `${item.code} · ${item.title}`,
            value: item.id,
          }))
        );
      }
    }

    loadOptions();
  }, []);

  return (
    <DbCrudModule
      title="Firmas"
      description="Firmas electrónicas controladas conectadas a Prisma: firmante, rol, acción, estado, fecha, SOP, registro y evidencia."
      apiPath="/api/documents/signatures"
      buttonLabel="Nueva Firma"
      icon="✍️"
      emptyForm={{
        id: "",
        signer: "",
        role: "",
        action: "Aprobó",
        status: "Firmado",
        signedAt: "",
        sopId: "",
        recordId: "",
        evidence: "",
      }}
      fields={[
        { name: "signer", label: "Firmante", required: true },
        { name: "role", label: "Rol" },
        {
          name: "action",
          label: "Acción",
          type: "select",
          required: true,
          options: [
            { label: "Revisó", value: "Revisó" },
            { label: "Aprobó", value: "Aprobó" },
            { label: "Firmó", value: "Firmó" },
            { label: "Rechazó", value: "Rechazó" },
            { label: "Liberó", value: "Liberó" },
          ],
        },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Firmado", value: "Firmado" },
            { label: "Pendiente", value: "Pendiente" },
            { label: "Rechazado", value: "Rechazado" },
          ],
        },
        { name: "signedAt", label: "Fecha firma", type: "date" },
        {
          name: "sopId",
          label: "SOP asociado",
          type: "select",
          options: sops,
        },
        {
          name: "recordId",
          label: "Registro asociado",
          type: "select",
          options: records,
        },
        { name: "evidence", label: "Evidencia / comentario" },
      ]}
      columns={[
        { label: "Firmante", accessor: "signer" },
        { label: "Rol", accessor: "role" },
        { label: "Acción", accessor: "action" },
        { label: "SOP", accessor: "sop.code" },
        { label: "Registro", accessor: "record.code" },
      ]}
    />
  );
}
