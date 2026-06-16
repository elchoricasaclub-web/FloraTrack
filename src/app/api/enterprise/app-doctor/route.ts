import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

type Issue = {
  severity: "Crítica" | "Alta" | "Media" | "Baja";
  area: string;
  message: string;
  recommendation: string;
};

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function extractImports(source: string) {
  const imports: Array<{ name: string; importPath: string }> = [];
  const regex = /import\s+([A-Za-z0-9_]+)\s+from\s+"([^"]+)";/g;

  let match;

  while ((match = regex.exec(source)) !== null) {
    imports.push({
      name: match[1],
      importPath: match[2],
    });
  }

  return imports;
}

function extractModuleMapKeys(source: string) {
  const keys: string[] = [];
  const regex = /(?:^|\n)\s*(?:"([^"]+)"|([A-Za-z0-9_ÁÉÍÓÚÜÑáéíóúüñ]+)):\s*</g;

  let match;

  while ((match = regex.exec(source)) !== null) {
    keys.push(match[1] || match[2]);
  }

  return unique(keys);
}

function extractLayoutMenuItems(source: string) {
  const items: string[] = [];
  const arrayRegex = /items:\s*\[([\s\S]*?)\]/g;

  let arrayMatch;

  while ((arrayMatch = arrayRegex.exec(source)) !== null) {
    const content = arrayMatch[1];
    const itemRegex = /"([^"]+)"/g;

    let itemMatch;

    while ((itemMatch = itemRegex.exec(content)) !== null) {
      items.push(itemMatch[1]);
    }
  }

  return unique(items);
}

function extractSchemaModels(schema: string) {
  const models: string[] = [];
  const regex = /model\s+([A-Za-z0-9_]+)\s+\{/g;

  let match;

  while ((match = regex.exec(schema)) !== null) {
    models.push(match[1]);
  }

  return unique(models);
}

async function safeCount(delegateName: string) {
  try {
    const delegate = (prisma as any)[delegateName];

    if (!delegate) {
      return {
        ok: false,
        count: 0,
        error: `Delegate Prisma no existe: ${delegateName}`,
      };
    }

    const count = await delegate.count();

    return {
      ok: true,
      count,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  try {
    const root = process.cwd();

    const pagePath = path.join(root, "src/app/page.tsx");
    const layoutPath = path.join(root, "src/components/layout/MainLayout.tsx");
    const schemaPath = path.join(root, "prisma/schema.prisma");
    const packagePath = path.join(root, "package.json");

    const [page, layout, schema, packageJsonRaw] = await Promise.all([
      readSafe(pagePath),
      readSafe(layoutPath),
      readSafe(schemaPath),
      readSafe(packagePath),
    ]);

    const imports = extractImports(page).filter((item) =>
      item.importPath.startsWith("../components/")
    );

    const moduleMapKeys = extractModuleMapKeys(page);
    const menuItems = extractLayoutMenuItems(layout);
    const schemaModels = extractSchemaModels(schema);

    const importChecks = await Promise.all(
      imports.map(async (item) => {
        const target = path.normalize(path.join(root, "src/app", `${item.importPath}.tsx`));
        const ok = await exists(target);

        return {
          ...item,
          file: target.replace(root, ""),
          ok,
        };
      })
    );

    const missingImports = importChecks.filter((item) => !item.ok);

    const menuWithoutRoute = menuItems.filter((item) => !moduleMapKeys.includes(item));
    const routeWithoutMenu = moduleMapKeys.filter((item) => !menuItems.includes(item));

    const criticalFiles = [
      "src/app/page.tsx",
      "src/components/layout/MainLayout.tsx",
      "src/lib/prisma.ts",
      "prisma/schema.prisma",
      "package.json",
      "src/app/api/enterprise/control-tower/route.ts",
      "src/app/api/enterprise/app-doctor/route.ts",
      "src/app/api/enterprise/export-center/route.ts",
      "src/app/api/enterprise/document-generator/route.ts",
      "src/app/api/enterprise/dashboard/route.ts",
      "src/app/api/enterprise/alerts/route.ts",
      "src/app/api/enterprise/calendar/route.ts",
    ];

    const criticalFileChecks = await Promise.all(
      criticalFiles.map(async (item) => ({
        file: item,
        ok: await exists(path.join(root, item)),
      }))
    );

    const missingCriticalFiles = criticalFileChecks.filter((item) => !item.ok);

    const dynamicApiRoutes = [
      "src/app/api/db/[model]/route.ts",
      "src/app/api/regulatory/[model]/route.ts",
      "src/app/api/documents/[model]/route.ts",
      "src/app/api/inventory/[model]/route.ts",
      "src/app/api/facility/[model]/route.ts",
      "src/app/api/evidence/[model]/route.ts",
      "src/app/api/dossier/[model]/route.ts",
      "src/app/api/compliance-regulatory/[model]/route.ts",
      "src/app/api/lab-qa/[model]/route.ts",
      "src/app/api/traceability-plus/[model]/route.ts",
      "src/app/api/supplier-qa/[model]/route.ts",
      "src/app/api/qualification/[model]/route.ts",
      "src/app/api/environmental-monitoring/[model]/route.ts",
      "src/app/api/quality-intelligence/[model]/route.ts",
      "src/app/api/product-development/[model]/route.ts",
    ];

    const dynamicRouteChecks = await Promise.all(
      dynamicApiRoutes.map(async (item) => ({
        routeFile: item,
        ok: await exists(path.join(root, item)),
      }))
    );

    const prismaDelegatesToCheck = [
      "company",
      "user",
      "farm",
      "genetic",
      "crop",
      "harvest",
      "sample",
      "analysis",
      "cOA",
      "auditTrail",
      "regulatoryLicense",
      "regulatoryFramework",
      "regulatoryRequirement",
      "complianceGap",
      "sopDocument",
      "controlledRecord",
      "electronicSignature",
      "supplier",
      "equipment",
      "productionOrder",
      "productionBatch",
      "dossierMaster",
      "documentTemplate",
      "productFormulation",
      "envMonitoringPoint",
      "qualityTrend",
      "productQualityReview",
      "equipmentQualification",
      "supplierQualification",
      "lotGenealogy",
    ];

    const delegateChecks = await Promise.all(
      prismaDelegatesToCheck.map(async (delegate) => ({
        delegate,
        ...(await safeCount(delegate)),
      }))
    );

    const issues: Issue[] = [];

    for (const item of missingImports) {
      issues.push({
        severity: "Crítica",
        area: "Imports",
        message: `Falta el archivo importado por page.tsx: ${item.file}`,
        recommendation: `Crear el componente ${item.name} o corregir la ruta del import.`,
      });
    }

    for (const item of menuWithoutRoute) {
      issues.push({
        severity: "Alta",
        area: "Menú",
        message: `El menú tiene el módulo "${item}", pero no existe en moduleMap.`,
        recommendation: `Agregar "${item}" al moduleMap de src/app/page.tsx.`,
      });
    }

    for (const item of missingCriticalFiles) {
      issues.push({
        severity: "Crítica",
        area: "Archivos críticos",
        message: `Falta archivo crítico: ${item.file}`,
        recommendation: "Recrear el archivo antes de continuar agregando módulos.",
      });
    }

    for (const item of dynamicRouteChecks.filter((route) => !route.ok)) {
      issues.push({
        severity: "Media",
        area: "API",
        message: `No existe la ruta dinámica: ${item.routeFile}`,
        recommendation: "Crear esta ruta si el módulo correspondiente está activo en el menú.",
      });
    }

    for (const item of delegateChecks.filter((delegate) => !delegate.ok)) {
      issues.push({
        severity: "Alta",
        area: "Prisma",
        message: `Problema con delegate Prisma: ${item.delegate}`,
        recommendation: "Verificar schema.prisma, ejecutar prisma migrate dev y prisma generate.",
      });
    }

    const packageJson = packageJsonRaw ? JSON.parse(packageJsonRaw) : {};
    const totalChecks =
      importChecks.length +
      criticalFileChecks.length +
      dynamicRouteChecks.length +
      delegateChecks.length +
      menuItems.length;

    const failedChecks =
      missingImports.length +
      missingCriticalFiles.length +
      dynamicRouteChecks.filter((item) => !item.ok).length +
      delegateChecks.filter((item) => !item.ok).length +
      menuWithoutRoute.length;

    const score =
      totalChecks === 0 ? 0 : Math.max(0, Math.round(((totalChecks - failedChecks) / totalChecks) * 100));

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      app: "FloraTrack Enterprise",
      score,
      summary: {
        imports: importChecks.length,
        missingImports: missingImports.length,
        menuItems: menuItems.length,
        moduleMapRoutes: moduleMapKeys.length,
        menuWithoutRoute: menuWithoutRoute.length,
        routeWithoutMenu: routeWithoutMenu.length,
        schemaModels: schemaModels.length,
        criticalFiles: criticalFileChecks.length,
        missingCriticalFiles: missingCriticalFiles.length,
        dynamicApiRoutes: dynamicRouteChecks.length,
        prismaDelegatesChecked: delegateChecks.length,
        issues: issues.length,
      },
      versions: {
        appName: packageJson.name || "unknown",
        next: packageJson.dependencies?.next || packageJson.devDependencies?.next || "unknown",
        react: packageJson.dependencies?.react || packageJson.devDependencies?.react || "unknown",
        prisma: packageJson.devDependencies?.prisma || packageJson.dependencies?.prisma || "unknown",
        prismaClient:
          packageJson.dependencies?.["@prisma/client"] ||
          packageJson.devDependencies?.["@prisma/client"] ||
          "unknown",
      },
      issues,
      imports: importChecks,
      menu: {
        items: menuItems,
        moduleMapKeys,
        menuWithoutRoute,
        routeWithoutMenu,
      },
      files: {
        critical: criticalFileChecks,
        dynamicApiRoutes: dynamicRouteChecks,
      },
      prisma: {
        schemaModels,
        delegateChecks,
      },
      recommendations: [
        "Antes de crear nuevos módulos, revisar App Doctor y Control Tower.",
        "Si hay delegates Prisma con error, ejecutar prisma migrate dev y prisma generate.",
        "Si hay módulos de menú sin ruta, corregir page.tsx antes de seguir.",
        "Si el navegador muestra error después de migrar, reiniciar npm run dev dentro de Ubuntu.",
      ],
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
