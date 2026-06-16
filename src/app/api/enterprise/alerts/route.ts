import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type AlertItem = {
  id: string;
  type: string;
  module: string;
  title: string;
  detail: string;
  severity: "Crítica" | "Alta" | "Media" | "Baja";
  status: string;
  date: string | null;
};

type AlertSourceItem = {
  id: string;
  code?: string;
  number?: string;
  type?: string | null;
  company?: { name?: string | null } | null;
  authority?: string | null;
  expiresAt?: Date | null;
  concept?: string;
  responsible?: string | null;
  dueDate?: Date | null;
  equipment?: { name?: string | null } | null;
  equipmentName?: string | null;
  topic?: string | null;
  participant?: string | null;
  updatedAt: Date;
  status: string;
  result?: string | null;
  lot?: string | null;
  name?: string;
  stock?: number | null;
};

function severityByDate(date: Date | null | undefined): "Crítica" | "Alta" | "Media" | "Baja" {
  if (!date) {
    return "Media";
  }

  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Crítica";
  }

  if (diffDays <= 7) {
    return "Alta";
  }

  if (diffDays <= 30) {
    return "Media";
  }

  return "Baja";
}

export async function GET() {
  try {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 60);

    const [
      licenses,
      expirations,
      calibrations,
      maintenance,
      training,
      blockedCrops,
      blockedSamples,
      blockedAnalyses,
      blockedRawMaterials,
      blockedInputs,
      blockedProducts,
      rejectedCoas,
    ] = await Promise.all([
      prisma.regulatoryLicense.findMany({
        where: {
          expiresAt: {
            lte: future,
          },
        },
        orderBy: {
          expiresAt: "asc",
        },
        include: {
          company: true,
        },
      }),
      prisma.expiration.findMany({
        where: {
          dueDate: {
            lte: future,
          },
          status: {
            not: "Cumplido",
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        include: {
          company: true,
        },
      }),
      prisma.calibrationRecord.findMany({
        where: {
          dueDate: {
            lte: future,
          },
          status: {
            not: "Aprobado",
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        include: {
          equipment: true,
        },
      }),
      prisma.maintenanceRecord.findMany({
        where: {
          dueDate: {
            lte: future,
          },
          status: {
            not: "Aprobado",
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        include: {
          equipment: true,
        },
      }),
      prisma.trainingRecord.findMany({
        where: {
          dueDate: {
            lte: future,
          },
          status: {
            not: "Aprobado",
          },
        },
        orderBy: {
          dueDate: "asc",
        },
      }),
      prisma.crop.findMany({
        where: {
          status: "Bloqueado",
        },
      }),
      prisma.sample.findMany({
        where: {
          status: "Bloqueado",
        },
      }),
      prisma.analysis.findMany({
        where: {
          status: {
            in: ["Bloqueado", "Rechazado"],
          },
        },
      }),
      prisma.rawMaterial.findMany({
        where: {
          status: {
            in: ["Bloqueado", "Rechazado", "Vencido"],
          },
        },
      }),
      prisma.inputItem.findMany({
        where: {
          status: {
            in: ["Bloqueado", "Agotado"],
          },
        },
      }),
      prisma.product.findMany({
        where: {
          status: {
            in: ["Bloqueado", "Vencido"],
          },
        },
      }),
      prisma.cOA.findMany({
        where: {
          status: {
            in: ["Rechazado", "Bloqueado"],
          },
        },
      }),
    ]);

    const alerts: AlertItem[] = [
      ...licenses.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Vencimiento",
        module: "Licencias",
        title: `Licencia ${item.number}`,
        detail: `${item.type} · ${item.company?.name || "Sin empresa"} · ${item.authority || "Sin autoridad"}`,
        severity: severityByDate(item.expiresAt),
        status: item.status,
        date: item.expiresAt ? item.expiresAt.toISOString() : null,
      })),
      ...expirations.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Vencimiento",
        module: "Vencimientos",
        title: item.concept || item.code || item.id,
        detail: `${item.code} · Responsable: ${item.responsible || "Sin responsable"}`,
        severity: severityByDate(item.dueDate),
        status: item.status,
        date: item.dueDate ? item.dueDate.toISOString() : null,
      })),
      ...calibrations.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Calibración",
        module: "Calibraciones",
        title: item.code || item.id,
        detail: item.equipment?.name || item.equipmentName || "Equipo sin nombre",
        severity: severityByDate(item.dueDate),
        status: item.status,
        date: item.dueDate ? item.dueDate.toISOString() : null,
      })),
      ...maintenance.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Mantenimiento",
        module: "Mantenimiento",
        title: item.code || item.id,
        detail: `${item.type || "Mantenimiento"} · ${item.equipment?.name || item.equipmentName || "Equipo sin nombre"}`,
        severity: severityByDate(item.dueDate),
        status: item.status,
        date: item.dueDate ? item.dueDate.toISOString() : null,
      })),
      ...training.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Capacitación",
        module: "Capacitaciones",
        title: item.topic || item.code || item.id,
        detail: `Participante: ${item.participant || "Sin participante"}`,
        severity: severityByDate(item.dueDate),
        status: item.status,
        date: item.dueDate ? item.dueDate.toISOString() : null,
      })),
      ...blockedCrops.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Bloqueo",
        module: "Cultivos",
        title: item.code || item.id,
        detail: "Cultivo bloqueado por calidad.",
        severity: "Crítica" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...blockedSamples.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Bloqueo",
        module: "Muestras",
        title: item.code || item.id,
        detail: "Muestra bloqueada por calidad.",
        severity: "Crítica" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...blockedAnalyses.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Laboratorio",
        module: "Análisis",
        title: item.code || item.id,
        detail: `${item.type || "Análisis"} · ${item.result || "Sin resultado"}`,
        severity: "Crítica" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...blockedRawMaterials.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Inventario",
        module: "Materias Primas",
        title: item.name || item.code || item.id,
        detail: `${item.code} · Lote ${item.lot || "Sin lote"}`,
        severity: "Alta" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...blockedInputs.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Inventario",
        module: "Insumos",
        title: item.name || item.code || item.id,
        detail: `${item.code} · Stock ${item.stock ?? 0}`,
        severity: "Media" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...blockedProducts.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "Inventario",
        module: "Productos",
        title: item.name || item.code || item.id,
        detail: `${item.code} · Lote ${item.lot || "Sin lote"}`,
        severity: "Alta" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
      ...rejectedCoas.map((item: AlertSourceItem) => ({
        id: item.id,
        type: "COA",
        module: "COA",
        title: item.code || item.id,
        detail: item.result || "COA no cumple.",
        severity: "Crítica" as const,
        status: item.status,
        date: item.updatedAt.toISOString(),
      })),
    ];

    const sortedAlerts = alerts.sort((a, b) => {
      const severityOrder = {
        Crítica: 0,
        Alta: 1,
        Media: 2,
        Baja: 3,
      };

      return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return NextResponse.json({
      ok: true,
      total: sortedAlerts.length,
      critical: sortedAlerts.filter((item) => item.severity === "Crítica").length,
      high: sortedAlerts.filter((item) => item.severity === "Alta").length,
      medium: sortedAlerts.filter((item) => item.severity === "Media").length,
      low: sortedAlerts.filter((item) => item.severity === "Baja").length,
      data: sortedAlerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
