import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const [
      companies,
      users,
      farms,
      genetics,
      crops,
      harvests,
      samples,
      analyses,
      coas,
      auditTrail,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.user.count(),
      prisma.farm.count(),
      prisma.genetic.count(),
      prisma.crop.count(),
      prisma.harvest.count(),
      prisma.sample.count(),
      prisma.analysis.count(),
      prisma.cOA.count(),
      prisma.auditTrail.count(),
    ]);

    return NextResponse.json({
      ok: true,
      summary: {
        companies,
        users,
        farms,
        genetics,
        crops,
        harvests,
        samples,
        analyses,
        coas,
        auditTrail,
      },
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
