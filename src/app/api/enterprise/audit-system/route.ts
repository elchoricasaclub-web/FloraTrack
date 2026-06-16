import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type AuditTrailItem = {
  module: string;
  action: string;
  createdAt: Date;
};

export async function GET() {
  try {
    const auditTrail = (await prisma.auditTrail.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 500,
    })) as AuditTrailItem[];

    const modules = Array.from(new Set(auditTrail.map((item: AuditTrailItem) => item.module))).sort();

    const summary = modules.map((module) => {
      const records = auditTrail.filter((item: AuditTrailItem) => item.module === module);

      return {
        module,
        count: records.length,
        lastEvent: records[0]?.createdAt || null,
      };
    });

    const actions = Array.from(new Set(auditTrail.map((item: AuditTrailItem) => item.action))).sort();

    return NextResponse.json({
      ok: true,
      total: auditTrail.length,
      modules,
      actions,
      summary,
      data: auditTrail,
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
