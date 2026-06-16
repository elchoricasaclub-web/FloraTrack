"use client";

import DbCrudModule from "../ui/DbCrudModule";

export default function TransferenciaTecnologicaModule() {
  return (
    <DbCrudModule
      title="Transferencia Tecnológica"
      description="Transferencia de desarrollo a producción: paquete técnico, origen, destino, riesgo, conclusión, responsable y fecha."
      apiPath="/api/product-development/transfer"
      buttonLabel="Nueva Transferencia"
      icon="🔁"
      emptyForm={{
        id: "",
        code: "",
        productName: "",
        fromArea: "Desarrollo",
        toArea: "Producción GMP",
        packageCode: "",
        riskLevel: "Medio",
        conclusion: "",
        owner: "",
        status: "Planificada",
        transferDate: "",
      }}
      fields={[
        { name: "code", label: "Código transferencia", required: true },
        { name: "productName", label: "Producto", required: true },
        { name: "fromArea", label: "Área origen" },
        { name: "toArea", label: "Área destino" },
        { name: "packageCode", label: "Paquete técnico" },
        {
          name: "riskLevel",
          label: "Riesgo",
          type: "select",
          options: [
            { label: "Bajo", value: "Bajo" },
            { label: "Medio", value: "Medio" },
            { label: "Alto", value: "Alto" },
            { label: "Crítico", value: "Crítico" },
          ],
        },
        { name: "conclusion", label: "Conclusión" },
        { name: "owner", label: "Responsable" },
        { name: "transferDate", label: "Fecha transferencia", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Planificada", value: "Planificada" },
            { label: "En ejecución", value: "En ejecución" },
            { label: "Transferida", value: "Transferida" },
            { label: "CAPA requerida", value: "CAPA requerida" },
            { label: "Cerrada", value: "Cerrada" },
          ],
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Producto", accessor: "productName" },
        { label: "Origen", accessor: "fromArea" },
        { label: "Destino", accessor: "toArea" },
        { label: "Riesgo", accessor: "riskLevel" },
      ]}
    />
  );
}
