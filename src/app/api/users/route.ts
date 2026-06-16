import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: users,
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

    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nombre, correo y rol son obligatorios.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: String(body.name),
        email: String(body.email).toLowerCase(),
        role: String(body.role),
        status: body.status ? String(body.status) : "Activo",
        companyId: body.companyId ? String(body.companyId) : null,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Usuarios",
        action: "CREADO EN BASE DE DATOS",
        recordId: user.id,
        recordLabel: user.name,
        responsible: "Usuario local",
        status: user.status,
        snapshot: JSON.stringify(user),
      },
    });

    return NextResponse.json({
      ok: true,
      data: user,
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

    const user = await prisma.user.update({
      where: {
        id: String(body.id),
      },
      data: {
        name: String(body.name || ""),
        email: String(body.email || "").toLowerCase(),
        role: String(body.role || "Operador GACP"),
        status: body.status ? String(body.status) : "Activo",
        companyId: body.companyId ? String(body.companyId) : null,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Usuarios",
        action: "EDITADO EN BASE DE DATOS",
        recordId: user.id,
        recordLabel: user.name,
        responsible: "Usuario local",
        status: user.status,
        snapshot: JSON.stringify(user),
      },
    });

    return NextResponse.json({
      ok: true,
      data: user,
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

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    await prisma.auditTrail.create({
      data: {
        module: "Usuarios",
        action: "ELIMINADO EN BASE DE DATOS",
        recordId: user.id,
        recordLabel: user.name,
        responsible: "Usuario local",
        status: user.status,
        snapshot: JSON.stringify(user),
      },
    });

    return NextResponse.json({
      ok: true,
      data: user,
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
