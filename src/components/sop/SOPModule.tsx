"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function SOPModule() {
  return (
    <DbCrudModule
      title="SOP"
      description="Control documental SOP conectado a Prisma: código, título, área, versión, propietario, fecha efectiva, estado, registros asociados y firmas."
      apiPath="/api/documents/sops"
      buttonLabel="Nuevo SOP"
      icon="📘"
      emptyForm={{
        id: "",
        code: "",
        title: "",
        area: "GACP",
        version: "1.0",
        status: "Borrador",
        owner: "",
        effectiveDate: "",
      }}
      fields={[
        { name: "code", label: "Código SOP", required: true },
        { name: "title", label: "Título", required: true },
        {
          name: "area",
          label: "Área",
          type: "select",
          options: [
            { label: "GACP", value: "GACP" },
            { label: "GMP", value: "GMP" },
            { label: "Calidad", value: "Calidad" },
            { label: "Laboratorio", value: "Laboratorio" },
            { label: "Regulatorio", value: "Regulatorio" },
            { label: "Inventario", value: "Inventario" },
            { label: "Sistema", value: "Sistema" },
          ],
        },
        { name: "version", label: "Versión" },
        { name: "owner", label: "Responsable" },
        { name: "effectiveDate", label: "Fecha efectiva", type: "date" },
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
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Título", accessor: "title" },
        { label: "Área", accessor: "area" },
        { label: "Versión", accessor: "version" },
        { label: "Responsable", accessor: "owner" },
      ]}
    />
  );
}
