import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "cosecha.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf8");
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

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function invalid(value: unknown) {
  const valueClean = clean(value);
  const normalized = valueClean.toLowerCase();
  const blocked = ["", "seleccione", "responsable", "responsable gacp", "n/a", "na", "sin definir"];
  return blocked.includes(normalized) || valueClean.length < 3;
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
  const records = readRecords();

  if (action === "delete") {
    const id = clean(body.id);

    if (invalid(id)) {
      return NextResponse.json({ ok: false, fields: ["ID"] }, { status: 400 });
    }

    writeRecords(records.filter((record: any) => record.id !== id));

    return NextResponse.json({
      ok: true,
      deleted: id
    });
  }

  const missing: string[] = [];

  if (invalid(body.harvestCode)) missing.push("Código de cosecha");
  if (invalid(body.cultivo)) missing.push("Cultivo asociado");
  if (invalid(body.genetica)) missing.push("Genética");
  if (invalid(body.area)) missing.push("Área o zona");
  if (invalid(body.cantidad)) missing.push("Cantidad cosechada");
  if (invalid(body.estado)) missing.push("Estado");
  if (invalid(body.responsable)) missing.push("Responsable");
  if (invalid(body.evidencia)) missing.push("Evidencia");
  if (invalid(body.nota)) missing.push("Nota técnica");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        fields: missing
      },
      { status: 400 }
    );
  }

  if (action === "update") {
    const id = clean(body.id);

    const updated = records.map((record: any) =>
      record.id === id
        ? {
            ...record,
            updatedAt: new Date().toISOString(),
            harvestCode: clean(body.harvestCode),
            cultivo: clean(body.cultivo),
            genetica: clean(body.genetica),
            area: clean(body.area),
            cantidad: clean(body.cantidad),
            estado: clean(body.estado),
            responsable: clean(body.responsable),
            evidencia: clean(body.evidencia),
            nota: clean(body.nota)
          }
        : record
    );

    writeRecords(updated);

    return NextResponse.json({
      ok: true,
      record: updated.find((record: any) => record.id === id)
    });
  }

  const record = {
    id: `COS-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    harvestCode: clean(body.harvestCode),
    cultivo: clean(body.cultivo),
    genetica: clean(body.genetica),
    area: clean(body.area),
    cantidad: clean(body.cantidad),
    estado: clean(body.estado),
    responsable: clean(body.responsable),
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
