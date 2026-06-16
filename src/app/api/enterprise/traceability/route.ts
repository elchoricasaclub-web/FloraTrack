import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type TraceFacility = {
  id: string;
  name: string;
  city?: string | null;
  areaHa?: number | null;
  status: string;
};

type TraceGenetic = {
  id: string;
  name: string;
  origin?: string | null;
  type?: string | null;
  status: string;
};

type TraceCoa = {
  id: string;
  code: string;
  result?: string | null;
  status: string;
};

type TraceAnalysis = {
  id: string;
  code: string;
  type?: string | null;
  result?: string | null;
  status: string;
  coa?: TraceCoa | null;
};

type TraceSample = {
  id: string;
  code: string;
  type?: string | null;
  status: string;
  analyses: TraceAnalysis[];
};

type TraceHarvest = {
  id: string;
  code: string;
  wetWeight?: number | null;
  status: string;
  samples: TraceSample[];
};

type TraceCrop = {
  id: string;
  code: string;
  stage: string;
  status: string;
  farm?: TraceFacility | null;
  genetic?: TraceGenetic | null;
  harvests: TraceHarvest[];
};

type TraceChain = {
  complete: boolean;
  traceabilityScore: number;
};

export async function GET() {
  try {
    const crops = (await prisma.crop.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        farm: true,
        genetic: true,
        harvests: {
          include: {
            samples: {
              include: {
                analyses: {
                  include: {
                    coa: true,
                  },
                },
              },
            },
          },
        },
      },
    })) as TraceCrop[];

    const chains = crops.map((crop: TraceCrop) => {
      const harvests = crop.harvests || [];
      const samples = harvests.flatMap((harvest: TraceHarvest) => harvest.samples || []);
      const analyses = samples.flatMap((sample: TraceSample) => sample.analyses || []);
      const coas = analyses
        .map((analysis: TraceAnalysis) => analysis.coa)
        .filter((coa): coa is TraceCoa => coa !== null && coa !== undefined);

      const complete =
        !!crop.farm &&
        !!crop.genetic &&
        harvests.length > 0 &&
        samples.length > 0 &&
        analyses.length > 0 &&
        coas.length > 0;

      return {
        cropId: crop.id,
        cropCode: crop.code,
        stage: crop.stage,
        status: crop.status,
        farm: crop.farm
          ? {
              id: crop.farm.id,
              name: crop.farm.name,
              city: crop.farm.city,
              areaHa: crop.farm.areaHa,
              status: crop.farm.status,
            }
          : null,
        genetic: crop.genetic
          ? {
              id: crop.genetic.id,
              name: crop.genetic.name,
              origin: crop.genetic.origin,
              type: crop.genetic.type,
              status: crop.genetic.status,
            }
          : null,
        harvests: harvests.map((harvest: TraceHarvest) => ({
          id: harvest.id,
          code: harvest.code,
          wetWeight: harvest.wetWeight,
          status: harvest.status,
          samples: harvest.samples.map((sample: TraceSample) => ({
            id: sample.id,
            code: sample.code,
            type: sample.type,
            status: sample.status,
            analyses: sample.analyses.map((analysis: TraceAnalysis) => ({
              id: analysis.id,
              code: analysis.code,
              type: analysis.type,
              result: analysis.result,
              status: analysis.status,
              coa: analysis.coa
                ? {
                    id: analysis.coa.id,
                    code: analysis.coa.code,
                    result: analysis.coa.result,
                    status: analysis.coa.status,
                  }
                : null,
            })),
          })),
        })),
        counts: {
          harvests: harvests.length,
          samples: samples.length,
          analyses: analyses.length,
          coas: coas.length,
        },
        complete,
        traceabilityScore: complete
          ? 100
          : Math.round(
              ([
                !!crop.farm,
                !!crop.genetic,
                harvests.length > 0,
                samples.length > 0,
                analyses.length > 0,
                coas.length > 0,
              ].filter(Boolean).length /
                6) *
                100
            ),
      };
    });

    const totalChains = chains.length;
    const completeChains = chains.filter((chain: TraceChain) => chain.complete).length;
    const averageScore =
      totalChains > 0
        ? Math.round(
            chains.reduce((sum: number, chain: TraceChain) => sum + chain.traceabilityScore, 0) /
              totalChains
          )
        : 0;

    return NextResponse.json({
      ok: true,
      totalChains,
      completeChains,
      incompleteChains: totalChains - completeChains,
      averageScore,
      chains,
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
