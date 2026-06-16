import EnterpriseCrudModule from "../ui/EnterpriseCrudModule";

export default function GACPModule() {
  return (
    <EnterpriseCrudModule
      storageKey="floratrack_gacp"
      title="GACP"
      description="Gestión de buenas prácticas agrícolas y de recolección, evidencias, responsables, inspecciones, procedimientos y cumplimiento."
      buttonLabel="Nuevo Control GACP"
      icon="✅"
      emptyTitle="No existen controles GACP registrados"
      emptyText="Registre el primer control para iniciar seguimiento de cumplimiento agrícola."
      metrics={[{ label: "Controles GACP", value: "0" }, { label: "Cumplidos", value: "0" }, { label: "Pendientes", value: "0" }, { label: "Críticos", value: "0" }]}
      fields={[{ name: "codigo", label: "Código" }, { name: "area", label: "Área" }, { name: "estado", label: "Estado", type: "select", options: ["Cumple", "Pendiente", "No cumple", "Crítico"] }, { name: "fecha", label: "Fecha", type: "date" }, { name: "observaciones", label: "Observaciones", type: "textarea" }]}
      tableHeaders={["Código", "Área", "Estado", "Fecha"]}
    />
  );
}
