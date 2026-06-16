"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function MantenimientoModule() {
  const [equipment, setEquipment] = useState<Option[]>([]);

  useEffect(() => {
    async function loadEquipment() {
      const response = await fetch("/api/facility/equipment", {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.ok) {
        setEquipment(
          result.data.map((item: any) => ({
            label: `${item.code} · ${item.name}`,
            value: item.id,
          }))
        );
      }
    }

    loadEquipment();
  }, []);

  return (
    <DbCrudModule
      title="Mantenimiento"
      description="Mantenimientos preventivos y correctivos conectados a Prisma con equipo, tipo, fecha, estado y auditoría."
      apiPath="/api/facility/maintenance"
      buttonLabel="Nuevo Mantenimiento"
      icon="🛠️"
      emptyForm={{
        id: "",
        code: "",
        equipmentName: "",
        type: "Preventivo",
        dueDate: "",
        status: "Pendiente",
        equipmentId: "",
      }}
      fields={[
        { name: "code", label: "Código mantenimiento", required: true },
        { name: "equipmentName", label: "Equipo manual" },
        {
          name: "type",
          label: "Tipo",
          type: "select",
          options: [
            { label: "Preventivo", value: "Preventivo" },
            { label: "Correctivo", value: "Correctivo" },
            { label: "Predictivo", value: "Predictivo" },
            { label: "Calificación", value: "Calificación" },
          ],
        },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Programado", value: "Programado" },
            { label: "Aprobado", value: "Aprobado" },
            { label: "Vencido", value: "Vencido" },
          ],
        },
        {
          name: "equipmentId",
          label: "Equipo asociado",
          type: "select",
          options: equipment,
        },
      ]}
      columns={[
        { label: "Código", accessor: "code" },
        { label: "Equipo", accessor: "equipment.name" },
        { label: "Tipo", accessor: "type" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
