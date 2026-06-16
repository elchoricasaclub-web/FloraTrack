import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const tables = {
  biomass: "LiveRosinBiomassBatch",
  coldChain: "LiveRosinColdChainLog",
  wash: "LiveRosinWashBatch",
  fractions: "LiveRosinMicronFraction",
  freezeDry: "LiveRosinFreezeDryBatch",
  intermediate: "LiveRosinIntermediateProduct",
  press: "LiveRosinPressBatch",
  finished: "LiveRosinFinishedBatch",
  yields: "LiveRosinYieldReview",
  release: "LiveRosinReleaseRecord",
};

async function rawCount(table: string) {
  try {
    const result: any = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM "${table}"`
    );

    return Number(result?.[0]?.count || 0);
  } catch {
    return 0;
  }
}

async function rawRecent(table: string, take = 20) {
  try {
    return await prisma.$queryRawUnsafe(
      `SELECT * FROM "${table}" ORDER BY "createdAt" DESC LIMIT ${take}`
    );
  } catch {
    return [];
  }
}

function isOpen(value: unknown) {
  const status = String(value || "").toLowerCase();

  if (!status) return true;

  const closed = [
    "cerrado",
    "cerrada",
    "liberado",
    "liberada",
    "aprobado",
    "aprobada",
    "cumple",
    "rechazado",
    "rechazada",
  ];

  return !closed.some((item) => status.includes(item));
}

export async function GET() {
  try {
    const counters = {
      biomass: await rawCount(tables.biomass),
      coldChain: await rawCount(tables.coldChain),
      wash: await rawCount(tables.wash),
      fractions: await rawCount(tables.fractions),
      freezeDry: await rawCount(tables.freezeDry),
      intermediate: await rawCount(tables.intermediate),
      press: await rawCount(tables.press),
      finished: await rawCount(tables.finished),
      yields: await rawCount(tables.yields),
      release: await rawCount(tables.release),
    };

    const finishedRecords: any[] = await rawRecent(tables.finished, 50);
    const releaseRecords: any[] = await rawRecent(tables.release, 50);
    const coldChainRecords: any[] = await rawRecent(tables.coldChain, 50);

    const quarantineBatches = finishedRecords.filter((item) =>
      isOpen(item.releaseDecision || item.status)
    ).length;

    const pendingRelease = releaseRecords.filter((item) =>
      isOpen(item.releaseDecision || item.status)
    ).length;

    const coldChainDeviations = coldChainRecords.filter((item) =>
      String(item.deviationFound || "").toLowerCase().includes("si") ||
      String(item.deviationFound || "").toLowerCase().includes("sí") ||
      String(item.status || "").toLowerCase().includes("desvi")
    ).length;

    const totalRecords = Object.values(counters).reduce(
      (sum, count) => sum + Number(count || 0),
      0
    );

    const readiness = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          55 +
            Math.min(30, totalRecords * 2) -
            quarantineBatches * 5 -
            pendingRelease * 5 -
            coldChainDeviations * 8
        )
      )
    );

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      module: "Live Rosin Solventless Enterprise",
      readiness,
      totalRecords,
      alerts: {
        quarantineBatches,
        pendingRelease,
        coldChainDeviations,
      },
      counters,
      recent: {
        biomass: await rawRecent(tables.biomass),
        wash: await rawRecent(tables.wash),
        press: await rawRecent(tables.press),
        finished: finishedRecords,
        release: releaseRecords,
      },
      recommendations: [
        "Ninguna biomasa debe avanzar sin trazabilidad desde genética, cultivo y cosecha autorizada.",
        "Toda cadena de frío debe tener registros y desviaciones investigadas.",
        "Todo producto intermedio debe permanecer en cuarentena hasta revisión QA.",
        "Todo lote terminado requiere muestra, COA, disposición y liberación QA.",
        "Los rendimientos deben revisarse por tendencia para detectar desviaciones de proceso.",
      ],
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
