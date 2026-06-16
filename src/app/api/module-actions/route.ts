import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ModuleActionLog = {
  id: string;
  createdAt: string;
  moduleName: string;
  itemTitle: string;
  actionType: string;
  owner?: string;
  status?: string;
  evidence?: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "module-action-logs.json");

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]", "utf8");
  }
}

function readLogs(): ModuleActionLog[] {
  ensureStore();

  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLogs(logs: ModuleActionLog[]) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(logs, null, 2), "utf8");
}

export async function GET() {
  const logs = readLogs();

  return NextResponse.json({
    ok: true,
    total: logs.length,
    logs: logs.slice(-150).reverse(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const log: ModuleActionLog = {
    id: `ACT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    moduleName: String(body.moduleName ?? "Sin módulo"),
    itemTitle: String(body.itemTitle ?? "Sin ítem"),
    actionType: String(body.actionType ?? "open"),
    owner: body.owner ? String(body.owner) : undefined,
    status: body.status ? String(body.status) : undefined,
    evidence: body.evidence ? String(body.evidence) : undefined,
  };

  const logs = readLogs();
  logs.push(log);
  writeLogs(logs);

  return NextResponse.json({
    ok: true,
    log,
  });
}
