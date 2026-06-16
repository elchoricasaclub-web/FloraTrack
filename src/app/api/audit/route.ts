import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const module = url.searchParams.get("module");
    const limit = Number(url.searchParams.get("limit") || 200);

    const audit = await prisma.auditTrail.findMany({
      where: module
        ? {
            module,
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const total = await prisma.auditTrail.count();

    const byModule = await prisma.auditTrail.groupBy({
      by: ["module"],
      _count: {
        module: true,
      },
      orderBy: {
        _count: {
          module: "desc",
        },
      },
    });

    return NextResponse.json({
      ok: true,
      total,
      byModule,
      data: audit,
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

export async function DELETE() {
  try {
    const deleted = await prisma.auditTrail.deleteMany();

    return NextResponse.json({
      ok: true,
      deleted: deleted.count,
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
