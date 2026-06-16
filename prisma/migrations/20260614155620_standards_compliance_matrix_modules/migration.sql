-- CreateTable
CREATE TABLE "ComplianceRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "standard" TEXT NOT NULL,
    "chapter" TEXT,
    "requirement" TEXT NOT NULL,
    "area" TEXT,
    "criticality" TEXT NOT NULL DEFAULT 'Media',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "requirementCode" TEXT,
    "area" TEXT,
    "evidence" TEXT,
    "score" REAL,
    "finding" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "responsible" TEXT,
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GapActionPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "gap" TEXT NOT NULL,
    "source" TEXT,
    "rootCause" TEXT,
    "action" TEXT,
    "responsible" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Media',
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
