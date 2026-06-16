-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "processType" TEXT NOT NULL DEFAULT 'Derivado',
    "batchSize" REAL,
    "unit" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planificada',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "geneticName" TEXT,
    "sourceLot" TEXT,
    "productionDate" DATETIME,
    "quantity" REAL,
    "unit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Cuarentena',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BatchRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "step" TEXT,
    "operator" TEXT,
    "parameter" TEXT,
    "result" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En proceso',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PackagingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "productName" TEXT,
    "packagingType" TEXT,
    "unitsPackaged" INTEGER,
    "labelControl" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En proceso',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StabilityStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "condition" TEXT,
    "timePoint" TEXT,
    "result" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En estudio',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RetentionSample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "sampleType" TEXT,
    "location" TEXT,
    "quantity" REAL,
    "unit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Retenida',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
