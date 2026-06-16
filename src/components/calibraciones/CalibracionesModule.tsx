"use client";

import { useEffect, useState } from "react";
import DbCrudModule from "../ui/DbCrudModule";

type Option = {
  label: string;
  value: string;
};

export default function CalibracionesModule() {
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
      title="Calibraciones"
      description="Calibraciones conectadas a Prisma con equipo asociado, fecha límite, estado y auditoría."
      apiPath="/api/facility/calibrations"
      buttonLabel="Nueva Calibración"
      icon="📏"
      emptyForm={{
        id: "",
        code: "",
        equipmentName: "",
        dueDate: "",
        status: "Pendiente",
        equipmentId: "",
      }}
      fields={[
        { name: "code", label: "Código calibración", required: true },
        { name: "equipmentName", label: "Equipo manual" },
        { name: "dueDate", label: "Fecha límite", type: "date" },
        {
          name: "status",
          label: "Estado",
          type: "select",
          options: [
            { label: "Pendiente", value: "Pendiente" },
            { label: "Programada", value: "Programada" },
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
        { label: "Equipo manual", accessor: "equipmentName" },
        { label: "Fecha límite", accessor: "dueDate" },
      ]}
    />
  );
}
