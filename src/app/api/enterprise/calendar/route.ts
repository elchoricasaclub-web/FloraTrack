import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type CalendarEvent = {
  id: string;
  module: string;
  title: string;
  date: string;
  status: string;
  type: string;
};

type CalendarSourceItem = {
  id: string;
  code?: string;
  number?: string;
  concept?: string;
  topic?: string | null;
  expiresAt?: Date | null;
  dueDate?: Date | null;
  effectiveDate?: Date | null;
  status: string;
};

export async function GET() {
  try {
    const [
      licenses,
      expirations,
      calibrations,
      maintenance,
      training,
      sops,
    ] = await Promise.all([
      prisma.regulatoryLicense.findMany({
        where: {
          expiresAt: {
            not: null,
          },
        },
        include: {
          company: true,
        },
      }),
      prisma.expiration.findMany({
        where: {
          dueDate: {
            not: null,
          },
        },
        include: {
          company: true,
        },
      }),
      prisma.calibrationRecord.findMany({
        where: {
          dueDate: {
            not: null,
          },
        },
        include: {
          equipment: true,
        },
      }),
      prisma.maintenanceRecord.findMany({
        where: {
          dueDate: {
            not: null,
          },
        },
        include: {
          equipment: true,
        },
      }),
      prisma.trainingRecord.findMany({
        where: {
          dueDate: {
            not: null,
          },
        },
      }),
      prisma.sopDocument.findMany({
        where: {
          effectiveDate: {
            not: null,
          },
        },
      }),
    ]);

    const events: CalendarEvent[] = [
      ...licenses.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "Licencias",
        title: `Vence licencia ${item.number}`,
        date: item.expiresAt ? item.expiresAt.toISOString() : "",
        status: item.status,
        type: "Regulatorio",
      })),
      ...expirations.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "Vencimientos",
        title: item.concept || item.code || item.id,
        date: item.dueDate ? item.dueDate.toISOString() : "",
        status: item.status,
        type: "Regulatorio",
      })),
      ...calibrations.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "Calibraciones",
        title: `Calibración ${item.code}`,
        date: item.dueDate ? item.dueDate.toISOString() : "",
        status: item.status,
        type: "Facility",
      })),
      ...maintenance.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "Mantenimiento",
        title: `Mantenimiento ${item.code}`,
        date: item.dueDate ? item.dueDate.toISOString() : "",
        status: item.status,
        type: "Facility",
      })),
      ...training.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "Capacitaciones",
        title: item.topic || item.code || item.id,
        date: item.dueDate ? item.dueDate.toISOString() : "",
        status: item.status,
        type: "Capacitación",
      })),
      ...sops.map((item: CalendarSourceItem) => ({
        id: item.id,
        module: "SOP",
        title: `Fecha efectiva ${item.code}`,
        date: item.effectiveDate ? item.effectiveDate.toISOString() : "",
        status: item.status,
        type: "Documental",
      })),
    ].filter((item) => item.date);

    const sorted = events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      ok: true,
      total: sorted.length,
      data: sorted,
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
