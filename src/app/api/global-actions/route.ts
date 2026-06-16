import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "global-actions.json");

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
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeRecords(records: any[]) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2), "utf8");
}

export async function GET() {
  const records = readRecords();

  return NextResponse.json({
    ok: true,
    total: records.length,
    records: records.slice().reverse(),
  });
}

export async function POST(request: Request) {
  let body: Record<string, string> = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const records = readRecords();

  const record = {
    id: `ACTION-${Date.now()}`,
    createdAt: new Date().toISOString(),
    moduleName: body.moduleName || "FloraTrack",
    buttonText: body.buttonText || "Botón",
    actionType: body.actionType || "button-click",
    pageUrl: body.pageUrl || "",
    status: body.status || "Registrado",
    note: body.note || "Acción registrada desde FloraTrack.",
  };

  records.push(record);
  writeRecords(records);

  return NextResponse.json({
    ok: true,
    record,
  });
}
