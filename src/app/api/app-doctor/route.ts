import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckStatus = "ok" | "warning" | "critical";

type DoctorCheck = {
  id: string;
  title: string;
  area: string;
  status: CheckStatus;
  score: number;
  message: string;
  detail: string;
};

function exists(filePath: string) {
  return fs.existsSync(filePath);
}

function readText(filePath: string) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function safeJson(filePath: string) {
  try {
    return JSON.parse(readText(filePath));
  } catch {
    return null;
  }
}

function walk(dir: string, matcher?: (filePath: string) => boolean) {
  const results: string[] = [];

  function scan(current: string) {
    if (!exists(current)) return;

    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);

      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git" ||
        entry.name === "dist" ||
        entry.name === "build"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (!matcher || matcher(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  scan(dir);
  return results;
}

function statusFromScore(score: number): CheckStatus {
  if (score >= 80) return "ok";
  if (score >= 50) return "warning";
  return "critical";
}

export async function GET() {
  const root = process.cwd();

  const srcPath = path.join(root, "src");
  const appPath = path.join(root, "src", "app");
  const componentsPath = path.join(root, "src", "components");
  const apiPath = path.join(root, "src", "app", "api");
  const prismaPath = path.join(root, "prisma", "schema.prisma");
  const packagePath = path.join(root, "package.json");
  const pagePath = path.join(root, "src", "app", "page.tsx");
  const layoutPath = path.join(root, "src", "components", "layout", "MainLayout.tsx");

  const packageJson = safeJson(packagePath);
  const pageText = readText(pagePath);
  const layoutText = readText(layoutPath);
  const prismaText = readText(prismaPath);

  const componentFiles = walk(componentsPath, (file) => /\.(tsx|ts)$/.test(file));
  const apiFiles = walk(apiPath, (file) => /route\.ts$/.test(file));
  const appFiles = walk(appPath, (file) => /\.(tsx|ts)$/.test(file));

  const checks: DoctorCheck[] = [];

  const coreFiles = [
    { label: "package.json", file: packagePath },
    { label: "src/app/page.tsx", file: pagePath },
    { label: "MainLayout.tsx", file: layoutPath },
    { label: "Prisma schema", file: prismaPath },
    { label: "src/lib/prisma.ts", file: path.join(root, "src", "lib", "prisma.ts") },
  ];

  const missingCore = coreFiles.filter((item) => !exists(item.file));

  checks.push({
    id: "core-files",
    title: "Archivos base del proyecto",
    area: "Arquitectura",
    status: missingCore.length === 0 ? "ok" : "critical",
    score: missingCore.length === 0 ? 100 : 40,
    message: missingCore.length === 0 ? "Archivos base encontrados." : "Faltan archivos base importantes.",
    detail:
      missingCore.length === 0
        ? "package.json, page.tsx, MainLayout, Prisma y lib/prisma están presentes."
        : `Faltan: ${missingCore.map((item) => item.label).join(", ")}`,
  });

  const nextInstalled = Boolean(packageJson?.dependencies?.next || packageJson?.devDependencies?.next);
  const prismaInstalled = Boolean(packageJson?.dependencies?.["@prisma/client"] || packageJson?.devDependencies?.prisma);
  const scripts = packageJson?.scripts ?? {};
  const hasDev = Boolean(scripts.dev);
  const hasBuild = Boolean(scripts.build);

  let packageScore = 0;
  if (nextInstalled) packageScore += 30;
  if (prismaInstalled) packageScore += 30;
  if (hasDev) packageScore += 20;
  if (hasBuild) packageScore += 20;

  checks.push({
    id: "package",
    title: "Dependencias y scripts",
    area: "Node / Next.js",
    status: statusFromScore(packageScore),
    score: packageScore,
    message: packageScore >= 80 ? "Dependencias principales correctas." : "Revisar dependencias o scripts.",
    detail: `Next: ${nextInstalled ? "OK" : "Falta"} · Prisma: ${prismaInstalled ? "OK" : "Falta"} · dev: ${
      hasDev ? "OK" : "Falta"
    } · build: ${hasBuild ? "OK" : "Falta"}`,
  });

  const modelCount = (prismaText.match(/\nmodel\s+/g) ?? []).length;
  const duplicateModels = Array.from(prismaText.matchAll(/\nmodel\s+(\w+)/g))
    .map((match) => match[1])
    .filter((value, index, array) => array.indexOf(value) !== index);

  checks.push({
    id: "prisma",
    title: "Prisma schema",
    area: "Base de datos",
    status: duplicateModels.length === 0 && modelCount > 0 ? "ok" : "warning",
    score: duplicateModels.length === 0 && modelCount > 0 ? 90 : 55,
    message:
      duplicateModels.length === 0
        ? `Schema Prisma detectado con ${modelCount} modelos.`
        : "Hay modelos Prisma duplicados.",
    detail:
      duplicateModels.length === 0
        ? "No se detectaron modelos duplicados por nombre."
        : `Duplicados: ${Array.from(new Set(duplicateModels)).join(", ")}`,
  });

  const mainModules = [
    "Dashboard",
    "Control Tower",
    "Cultivos",
    "Genéticas",
    "Propagación",
    "Cosecha",
    "Micropropagación",
    "Live Rosin",
    "LIMS",
    "ISO 17025",
    "CAPA",
    "Auditorías",
    "Documentos",
    "CSV",
    "SaaS",
    "IA Regulatoria",
    "AI Gateway",
  ];

  const foundModules = mainModules.filter((module) => {
    const clean = module
      .replace("é", "e")
      .replace("ó", "o")
      .replace("í", "i")
      .replace(" ", "")
      .toLowerCase();

    return (
      pageText.toLowerCase().includes(module.toLowerCase()) ||
      componentFiles.some((file) => file.toLowerCase().replace(/[^a-z0-9]/g, "").includes(clean.replace(/[^a-z0-9]/g, "")))
    );
  });

  const moduleScore = Math.round((foundModules.length / mainModules.length) * 100);

  checks.push({
    id: "modules",
    title: "Cobertura de módulos principales",
    area: "Producto",
    status: statusFromScore(moduleScore),
    score: moduleScore,
    message: `${foundModules.length}/${mainModules.length} módulos estratégicos detectados.`,
    detail: `Detectados: ${foundModules.join(", ") || "Ninguno"}`,
  });

  const importCount = (pageText.match(/^import\s+/gm) ?? []).length;
  const usesMainLayout = pageText.includes("MainLayout");
  const hasUseClient = pageText.includes('"use client"') || pageText.includes("'use client'");

  checks.push({
    id: "page",
    title: "Página principal",
    area: "Frontend",
    status: usesMainLayout && importCount > 5 ? "ok" : "warning",
    score: usesMainLayout && importCount > 5 ? 85 : 60,
    message: usesMainLayout ? "page.tsx usa MainLayout." : "page.tsx no parece usar MainLayout.",
    detail: `Imports detectados: ${importCount} · use client: ${hasUseClient ? "Sí" : "No"} · MainLayout: ${
      usesMainLayout ? "Sí" : "No"
    }`,
  });

  const menuHasSearch = layoutText.includes("Buscar módulo");
  const menuHasFavorites = layoutText.includes("Favoritos");
  const menuHasSaas = layoutText.includes("SaaS");

  let menuScore = 40;
  if (menuHasSearch) menuScore += 20;
  if (menuHasFavorites) menuScore += 20;
  if (menuHasSaas) menuScore += 20;

  checks.push({
    id: "menu",
    title: "Menú lateral",
    area: "UX/UI",
    status: statusFromScore(menuScore),
    score: menuScore,
    message: menuScore >= 80 ? "Menú SaaS limpio detectado." : "Menú necesita revisión.",
    detail: `Buscador: ${menuHasSearch ? "Sí" : "No"} · Favoritos: ${menuHasFavorites ? "Sí" : "No"} · SaaS: ${
      menuHasSaas ? "Sí" : "No"
    }`,
  });

  checks.push({
    id: "components",
    title: "Componentes creados",
    area: "Frontend",
    status: componentFiles.length > 30 ? "ok" : componentFiles.length > 10 ? "warning" : "critical",
    score: componentFiles.length > 30 ? 90 : componentFiles.length > 10 ? 65 : 35,
    message: `${componentFiles.length} archivos de componentes detectados.`,
    detail: `Carpeta analizada: src/components`,
  });

  checks.push({
    id: "api-routes",
    title: "API routes",
    area: "Backend",
    status: apiFiles.length > 10 ? "ok" : apiFiles.length > 3 ? "warning" : "critical",
    score: apiFiles.length > 10 ? 85 : apiFiles.length > 3 ? 60 : 35,
    message: `${apiFiles.length} rutas API detectadas.`,
    detail: `Se revisaron route.ts dentro de src/app/api.`,
  });

  const hasDoctor = exists(path.join(root, "src", "app", "api", "app-doctor", "route.ts"));
  const hasBackupFiles = walk(root, (file) => file.includes(".backup.")).length;

  checks.push({
    id: "backup",
    title: "Backups de desarrollo",
    area: "Seguridad proyecto",
    status: hasBackupFiles > 0 ? "ok" : "warning",
    score: hasBackupFiles > 0 ? 90 : 55,
    message: hasBackupFiles > 0 ? `${hasBackupFiles} backups detectados.` : "No se detectaron backups automáticos.",
    detail: `App Doctor API: ${hasDoctor ? "OK" : "Falta"}`,
  });

  const totalScore = Math.round(checks.reduce((sum, item) => sum + item.score, 0) / checks.length);
  const criticalCount = checks.filter((item) => item.status === "critical").length;
  const warningCount = checks.filter((item) => item.status === "warning").length;
  const okCount = checks.filter((item) => item.status === "ok").length;

  const recommendations: string[] = [];

  if (criticalCount > 0) {
    recommendations.push("Resolver primero los checks críticos antes de seguir agregando módulos.");
  }

  if (warningCount > 0) {
    recommendations.push("Revisar advertencias de Prisma, imports, API routes y cobertura de módulos.");
  }

  if (apiFiles.length < 10) {
    recommendations.push("Conectar tarjetas visuales con APIs reales para que la app pase de demo a producto operativo.");
  }

  if (!hasBuild) {
    recommendations.push("Agregar o corregir script build en package.json.");
  }

  recommendations.push("Ejecutar npm run build para validar compilación real antes de avanzar a producción.");
  recommendations.push("Siguiente fase recomendada: crear acciones reales para botones Abrir, Evidencia y Audit Trail.");

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    root,
    summary: {
      totalScore,
      status: statusFromScore(totalScore),
      okCount,
      warningCount,
      criticalCount,
      componentFiles: componentFiles.length,
      apiRoutes: apiFiles.length,
      appFiles: appFiles.length,
      prismaModels: modelCount,
    },
    checks,
    recommendations,
  });
}
