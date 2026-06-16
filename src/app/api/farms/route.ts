import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const farms = await prisma.farm.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true,
        _count: {
          select: {
            crops: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      data: farms,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        {
          ok: false,
          error: "El nombre del predio es obligatorio.",
        },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        name: String(body.name),
        city: body.city ? String(body.city) : null,
        areaHa:
          body.areaHa !== undefined && body.areaHa !== ""
            ? Number(body.areaHa)
            : null,
        status: body.status ? String(body.status) : "Activo",
        companyId: body.companyId ? String(body.companyId) : null,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Predios",
        action: "CREADO EN BASE DE DATOS",
        recordId: farm.id,
        recordLabel: farm.name,
        responsible: "Usuario local",
        status: farm.status,
        snapshot: JSON.stringify(farm),
      },
    });

    return NextResponse.json({
      ok: true,
      data: farm,
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "El ID es obligatorio.",
        },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.update({
      where: {
        id: String(body.id),
      },
      data: {
        name: String(body.name || ""),
        city: body.city ? String(body.city) : null,
        areaHa:
          body.areaHa !== undefined && body.areaHa !== ""
            ? Number(body.areaHa)
            : null,
        status: body.status ? String(body.status) : "Activo",
        companyId: body.companyId ? String(body.companyId) : null,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Predios",
        action: "EDITADO EN BASE DE DATOS",
        recordId: farm.id,
        recordLabel: farm.name,
        responsible: "Usuario local",
        status: farm.status,
        snapshot: JSON.stringify(farm),
      },
    });

    return NextResponse.json({
      ok: true,
      data: farm,
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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "El ID es obligatorio.",
        },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.delete({
      where: {
        id,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Predios",
        action: "ELIMINADO EN BASE DE DATOS",
        recordId: farm.id,
        recordLabel: farm.name,
        responsible: "Usuario local",
        status: farm.status,
        snapshot: JSON.stringify(farm),
      },
    });

    return NextResponse.json({
      ok: true,
      data: farm,
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
