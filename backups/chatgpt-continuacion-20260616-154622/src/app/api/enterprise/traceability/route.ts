import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
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
    });

    const chains = crops.map((crop) => {
      const harvests = crop.harvests || [];
      const samples = harvests.flatMap((harvest) => harvest.samples || []);
      const analyses = samples.flatMap((sample) => sample.analyses || []);
      const coas = analyses
        .map((analysis) => analysis.coa)
        .filter((coa) => coa !== null);

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
        harvests: harvests.map((harvest) => ({
          id: harvest.id,
          code: harvest.code,
          wetWeight: harvest.wetWeight,
          status: harvest.status,
          samples: harvest.samples.map((sample) => ({
            id: sample.id,
            code: sample.code,
            type: sample.type,
            status: sample.status,
            analyses: sample.analyses.map((analysis) => ({
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
    const completeChains = chains.filter((chain) => chain.complete).length;
    const averageScore =
      totalChains > 0
        ? Math.round(
            chains.reduce((sum, chain) => sum + chain.traceabilityScore, 0) /
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
