import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const [crops, harvests, samples, analyses, coas] = await Promise.all([
      prisma.crop.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          farm: {
            include: {
              company: true,
            },
          },
          genetic: true,
          harvests: true,
        },
      }),

      prisma.harvest.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          crop: {
            include: {
              farm: {
                include: {
                  company: true,
                },
              },
              genetic: true,
            },
          },
          samples: true,
        },
      }),

      prisma.sample.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          harvest: {
            include: {
              crop: {
                include: {
                  farm: {
                    include: {
                      company: true,
                    },
                  },
                  genetic: true,
                },
              },
            },
          },
          analyses: true,
        },
      }),

      prisma.analysis.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sample: {
            include: {
              harvest: {
                include: {
                  crop: {
                    include: {
                      farm: {
                        include: {
                          company: true,
                        },
                      },
                      genetic: true,
                    },
                  },
                },
              },
            },
          },
          coa: true,
        },
      }),

      prisma.cOA.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          analysis: {
            include: {
              sample: {
                include: {
                  harvest: {
                    include: {
                      crop: {
                        include: {
                          farm: {
                            include: {
                              company: true,
                            },
                          },
                          genetic: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      totals: {
        crops: crops.length,
        harvests: harvests.length,
        samples: samples.length,
        analyses: analyses.length,
        coas: coas.length,
      },
      crops,
      harvests,
      samples,
      analyses,
      coas,
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
