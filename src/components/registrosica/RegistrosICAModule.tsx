"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function RegistrosICAModule() {
  return (
    <DbCrudModule
      title="Registros ICA"
      description="Registros ICA conectados a Prisma: código, genética, titular, estado, auditoría y trazabilidad documental."
      apiPath="/api/regulatory/ica"
      buttonLabel="Nuevo Registro ICA"
      icon="🧬"
      emptyForm={{ id: "", code: "", geneticName: "", holder: "", status: "Borrador" }}
      fields={[
    { name: "code", label: "Código ICA", required: true },
    { name: "geneticName", label: "Genética" },
    { name: "holder", label: "Titular" },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { label: "Borrador", value: "Borrador" },
        { label: "Radicado", value: "Radicado" },
        { label: "Observado", value: "Observado" },
        { label: "Aprobado", value: "Aprobado" }
      ]
    }
  ]}
      columns={[
    { label: "Código", accessor: "code" },
    { label: "Genética", accessor: "geneticName" },
    { label: "Titular", accessor: "holder" }
  ]}
    />
  );
}
