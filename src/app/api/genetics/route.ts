import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const genetics = await prisma.genetic.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            crops: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      data: genetics,
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
          error: "El nombre de la genética es obligatorio.",
        },
        { status: 400 }
      );
    }

    const genetic = await prisma.genetic.create({
      data: {
        name: String(body.name),
        origin: body.origin ? String(body.origin) : null,
        type: body.type ? String(body.type) : null,
        status: body.status ? String(body.status) : "Autorizada",
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Genéticas",
        action: "CREADO EN BASE DE DATOS",
        recordId: genetic.id,
        recordLabel: genetic.name,
        responsible: "Usuario local",
        status: genetic.status,
        snapshot: JSON.stringify(genetic),
      },
    });

    return NextResponse.json({
      ok: true,
      data: genetic,
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

    const genetic = await prisma.genetic.update({
      where: {
        id: String(body.id),
      },
      data: {
        name: String(body.name || ""),
        origin: body.origin ? String(body.origin) : null,
        type: body.type ? String(body.type) : null,
        status: body.status ? String(body.status) : "Autorizada",
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Genéticas",
        action: "EDITADO EN BASE DE DATOS",
        recordId: genetic.id,
        recordLabel: genetic.name,
        responsible: "Usuario local",
        status: genetic.status,
        snapshot: JSON.stringify(genetic),
      },
    });

    return NextResponse.json({
      ok: true,
      data: genetic,
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

    const genetic = await prisma.genetic.delete({
      where: {
        id,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Genéticas",
        action: "ELIMINADO EN BASE DE DATOS",
        recordId: genetic.id,
        recordLabel: genetic.name,
        responsible: "Usuario local",
        status: genetic.status,
        snapshot: JSON.stringify(genetic),
      },
    });

    return NextResponse.json({
      ok: true,
      data: genetic,
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
