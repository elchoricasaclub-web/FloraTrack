import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateRecord } from "../../../lib/recordValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "universal-records.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]", "utf8");
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
  return NextResponse.json({ ok: true, total: records.length, records: records.slice().reverse() });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const input = {
    moduleName: String(formData.get("moduleName") || "Dashboard"),
    title: String(formData.get("title") || ""),
    type: String(formData.get("type") || ""),
    owner: String(formData.get("owner") || ""),
    status: String(formData.get("status") || ""),
    priority: String(formData.get("priority") || ""),
    note: String(formData.get("note") || "")
  };

  const missing = validateRecord(input, [
    { key: "title", label: "Título del registro", disallow: ["nuevo registro floratrack", "nuevo registro"] },
    { key: "type", label: "Tipo" },
    { key: "owner", label: "Responsable", disallow: ["responsable gacp", "usuario actual"] },
    { key: "status", label: "Estado" },
    { key: "priority", label: "Prioridad" },
    { key: "note", label: "Nota técnica", disallow: ["registro creado desde nuevo registro", "registro creado desde el botón nuevo registro del dashboard."] }
  ]);

  if (missing.length > 0) {
    const url = new URL("/new-record", request.url);
    url.searchParams.set("validation", "1");
    url.searchParams.set("fields", missing.join(","));
    return NextResponse.redirect(url, { status: 303 });
  }

  const records = readRecords();

  const record = {
    id: `REC-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };

  records.unshift(record);
  writeRecords(records);

  return NextResponse.redirect(new URL("/records-center", request.url), { status: 303 });
}
