import EnterpriseCrudModule from "../ui/EnterpriseCrudModule";

export default function RetirosModule() {
  return (
    <EnterpriseCrudModule
      storageKey="floratrack_retiros"
      title="Retiros de Mercado"
      description="Gestión de recall, retiros voluntarios, bloqueos preventivos, lotes afectados, notificaciones, autoridades, clientes y cierre regulatorio."
      buttonLabel="Nuevo Retiro"
      icon="📦"
      emptyTitle="No existen retiros registrados"
      emptyText="Registre el primer retiro o simulacro para validar el sistema de respuesta."
      metrics={[{ label: "Retiros", value: "0" }, { label: "Simulacros", value: "0" }, { label: "Activos", value: "0" }, { label: "Cerrados", value: "0" }]}
      fields={[{ name: "codigo", label: "Código" }, { name: "lote", label: "Lote afectado" }, { name: "tipo", label: "Tipo", type: "select", options: ["Simulacro", "Preventivo", "Voluntario", "Obligatorio"] }, { name: "estado", label: "Estado", type: "select", options: ["Abierto", "En ejecución", "Cerrado"] }, { name: "accion", label: "Acciones ejecutadas", type: "textarea" }]}
      tableHeaders={["Código", "Lote", "Tipo", "Estado"]}
    />
  );
}
