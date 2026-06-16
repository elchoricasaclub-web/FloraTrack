-- CreateTable
CREATE TABLE "Deviation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "area" TEXT,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NonConformity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "source" TEXT,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CapaAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "origin" TEXT,
    "rootCause" TEXT,
    "correctiveAction" TEXT,
    "preventiveAction" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "process" TEXT,
    "risk" TEXT,
    "probability" TEXT,
    "impact" TEXT,
    "level" TEXT NOT NULL DEFAULT 'Medio',
    "control" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChangeControl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "area" TEXT,
    "changeType" TEXT,
    "description" TEXT,
    "impact" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Solicitado',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QualityAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "auditType" TEXT,
    "area" TEXT,
    "auditor" TEXT,
    "finding" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Programada',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
