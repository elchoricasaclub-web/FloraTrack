import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type ModelName = "crops" | "harvests" | "samples" | "analyses" | "coas";

const modelConfig = {
  crops: {
    delegate: "crop",
    module: "Cultivos",
    include: {
      farm: true,
      genetic: true,
      _count: {
        select: {
          harvests: true,
        },
      },
    },
  },
  harvests: {
    delegate: "harvest",
    module: "Cosecha",
    include: {
      crop: {
        include: {
          farm: true,
          genetic: true,
        },
      },
      _count: {
        select: {
          samples: true,
        },
      },
    },
  },
  samples: {
    delegate: "sample",
    module: "Muestras",
    include: {
      harvest: {
        include: {
          crop: true,
        },
      },
      _count: {
        select: {
          analyses: true,
        },
      },
    },
  },
  analyses: {
    delegate: "analysis",
    module: "Análisis",
    include: {
      sample: true,
      coa: true,
    },
  },
  coas: {
    delegate: "cOA",
    module: "COA",
    include: {
      analysis: {
        include: {
          sample: true,
        },
      },
    },
  },
} as const;

function getConfig(model: string) {
  if (!["crops", "harvests", "samples", "analyses", "coas"].includes(model)) {
    return null;
  }

  return modelConfig[model as ModelName];
}

function buildData(model: ModelName, body: Record<string, unknown>) {
  if (model === "crops") {
    return {
      code: String(body.code || ""),
      stage: String(body.stage || "Planeación"),
      status: String(body.status || "Activo"),
      farmId: body.farmId ? String(body.farmId) : null,
      geneticId: body.geneticId ? String(body.geneticId) : null,
    };
  }

  if (model === "harvests") {
    return {
      code: String(body.code || ""),
      wetWeight:
        body.wetWeight !== undefined && body.wetWeight !== ""
          ? Number(body.wetWeight)
          : null,
      status: String(body.status || "Pendiente"),
      cropId: body.cropId ? String(body.cropId) : null,
    };
  }

  if (model === "samples") {
    return {
      code: String(body.code || ""),
      type: body.type ? String(body.type) : null,
      status: String(body.status || "Pendiente"),
      harvestId: body.harvestId ? String(body.harvestId) : null,
    };
  }

  if (model === "analyses") {
    return {
      code: String(body.code || ""),
      type: body.type ? String(body.type) : null,
      result: body.result ? String(body.result) : null,
      status: String(body.status || "Pendiente"),
      sampleId: body.sampleId ? String(body.sampleId) : null,
    };
  }

  return {
    code: String(body.code || ""),
    result: body.result ? String(body.result) : null,
    status: String(body.status || "Pendiente"),
    analysisId: String(body.analysisId || ""),
  };
}

async function createAudit(module: string, action: string, record: any) {
  await prisma.auditTrail.create({
    data: {
      module,
      action,
      recordId: record.id,
      recordLabel: record.code || record.name || record.id,
      responsible: "Usuario local",
      status: record.status || "Sin estado",
      snapshot: JSON.stringify(record),
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await context.params;
    const config = getConfig(model);

    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          error: "Modelo no permitido.",
        },
        { status: 400 }
      );
    }

    const delegate = (prisma as any)[config.delegate];

    const data = await delegate.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: config.include,
    });

    return NextResponse.json({
      ok: true,
      data,
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

export async function POST(
  request: Request,
  context: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await context.params;
    const config = getConfig(model);

    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          error: "Modelo no permitido.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.code || String(body.code).trim() === "") {
      return NextResponse.json(
        {
          ok: false,
          error: "El código es obligatorio.",
        },
        { status: 400 }
      );
    }

    if (model === "coas" && (!body.analysisId || String(body.analysisId).trim() === "")) {
      return NextResponse.json(
        {
          ok: false,
          error: "El análisis asociado es obligatorio para crear un COA.",
        },
        { status: 400 }
      );
    }

    const delegate = (prisma as any)[config.delegate];

    const record = await delegate.create({
      data: buildData(model as ModelName, body),
    });

    await createAudit(config.module, "CREADO EN BASE DE DATOS", record);

    return NextResponse.json({
      ok: true,
      data: record,
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

export async function PUT(
  request: Request,
  context: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await context.params;
    const config = getConfig(model);

    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          error: "Modelo no permitido.",
        },
        { status: 400 }
      );
    }

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

    const delegate = (prisma as any)[config.delegate];

    const record = await delegate.update({
      where: {
        id: String(body.id),
      },
      data: buildData(model as ModelName, body),
    });

    await createAudit(config.module, "EDITADO EN BASE DE DATOS", record);

    return NextResponse.json({
      ok: true,
      data: record,
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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ model: string }> }
) {
  try {
    const { model } = await context.params;
    const config = getConfig(model);

    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          error: "Modelo no permitido.",
        },
        { status: 400 }
      );
    }

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

    const delegate = (prisma as any)[config.delegate];

    const record = await delegate.delete({
      where: {
        id,
      },
    });

    await createAudit(config.module, "ELIMINADO EN BASE DE DATOS", record);

    return NextResponse.json({
      ok: true,
      data: record,
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
