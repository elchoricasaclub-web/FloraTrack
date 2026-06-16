import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      data: companies,
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

    if (!body.name || String(body.name).trim() === "") {
      return NextResponse.json(
        {
          ok: false,
          error: "El nombre de la empresa es obligatorio.",
        },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: String(body.name),
        nit: body.nit ? String(body.nit) : null,
        city: body.city ? String(body.city) : null,
        status: body.status ? String(body.status) : "Activa",
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Empresas",
        action: "CREADO EN BASE DE DATOS",
        recordId: company.id,
        recordLabel: company.name,
        responsible: "Usuario local",
        status: company.status,
        snapshot: JSON.stringify(company),
      },
    });

    return NextResponse.json({
      ok: true,
      data: company,
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

    const company = await prisma.company.update({
      where: {
        id: String(body.id),
      },
      data: {
        name: String(body.name || ""),
        nit: body.nit ? String(body.nit) : null,
        city: body.city ? String(body.city) : null,
        status: body.status ? String(body.status) : "Activa",
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Empresas",
        action: "EDITADO EN BASE DE DATOS",
        recordId: company.id,
        recordLabel: company.name,
        responsible: "Usuario local",
        status: company.status,
        snapshot: JSON.stringify(company),
      },
    });

    return NextResponse.json({
      ok: true,
      data: company,
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

    const company = await prisma.company.delete({
      where: {
        id,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Empresas",
        action: "ELIMINADO EN BASE DE DATOS",
        recordId: company.id,
        recordLabel: company.name,
        responsible: "Usuario local",
        status: company.status,
        snapshot: JSON.stringify(company),
      },
    });

    return NextResponse.json({
      ok: true,
      data: company,
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
