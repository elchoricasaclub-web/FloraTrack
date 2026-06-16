import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "cultivos.json");

const blockedValues = [
  "",
  "seleccione",
  "sin definir",
  "n/a",
  "na",
  "responsable",
  "responsable gacp",
  "nuevo cultivo",
  "cultivo"
];

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function invalid(value: unknown) {
  const normalized = clean(value).toLowerCase();
  return blockedValues.includes(normalized) || clean(value).length < 3;
}

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]", "utf8");
  }
}

function readRecords() {
  ensureStore();

  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: any[]) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    records: readRecords()
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const action = clean(body.action || "create");

  if (action === "delete") {
    const id = clean(body.id);

    if (invalid(id)) {
      return NextResponse.json(
        { ok: false, error: "ID_REQUIRED", fields: ["ID"] },
        { status: 400 }
      );
    }

    const records = readRecords().filter((item: any) => item.id !== id);
    writeRecords(records);

    return NextResponse.json({
      ok: true,
      deleted: id
    });
  }

  const missing: string[] = [];

  if (invalid(body.name)) missing.push("Nombre del cultivo");
  if (invalid(body.predio)) missing.push("Predio");
  if (invalid(body.genetica)) missing.push("Genética");
  if (invalid(body.area)) missing.push("Área o zona");
  if (invalid(body.responsable)) missing.push("Responsable");
  if (invalid(body.estado)) missing.push("Estado");
  if (invalid(body.evidencia)) missing.push("Evidencia");
  if (invalid(body.nota)) missing.push("Nota técnica");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "VALIDATION_REQUIRED",
        fields: missing
      },
      { status: 400 }
    );
  }

  const records = readRecords();

  if (action === "update") {
    const id = clean(body.id);

    if (invalid(id)) {
      return NextResponse.json(
        { ok: false, error: "ID_REQUIRED", fields: ["ID"] },
        { status: 400 }
      );
    }

    const updated = records.map((item: any) =>
      item.id === id
        ? {
            ...item,
            updatedAt: new Date().toISOString(),
            name: clean(body.name),
            predio: clean(body.predio),
            genetica: clean(body.genetica),
            area: clean(body.area),
            responsable: clean(body.responsable),
            estado: clean(body.estado),
            evidencia: clean(body.evidencia),
            nota: clean(body.nota)
          }
        : item
    );

    writeRecords(updated);

    return NextResponse.json({
      ok: true,
      record: updated.find((item: any) => item.id === id)
    });
  }

  const record = {
    id: `CULT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: clean(body.name),
    predio: clean(body.predio),
    genetica: clean(body.genetica),
    area: clean(body.area),
    responsable: clean(body.responsable),
    estado: clean(body.estado),
    evidencia: clean(body.evidencia),
    nota: clean(body.nota)
  };

  records.unshift(record);
  writeRecords(records);

  return NextResponse.json({
    ok: true,
    record
  });
}
