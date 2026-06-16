-- CreateTable
CREATE TABLE "CsvValidationMasterPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "systemVersion" TEXT,
    "validationScope" TEXT,
    "validationApproach" TEXT,
    "riskBasedRationale" TEXT,
    "ownerRole" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Borrador',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvSystemInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "moduleName" TEXT,
    "gxpImpact" TEXT NOT NULL DEFAULT 'Si',
    "dataCriticality" TEXT NOT NULL DEFAULT 'Alta',
    "supplier" TEXT,
    "hostingModel" TEXT,
    "validationCategory" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvUserRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "requirementTitle" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "businessProcess" TEXT,
    "regulatoryReference" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Alta',
    "acceptanceCriteria" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvFunctionalRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "ursCode" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "functionDescription" TEXT,
    "moduleName" TEXT,
    "technicalControl" TEXT,
    "testable" TEXT NOT NULL DEFAULT 'Si',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvRiskAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "processName" TEXT NOT NULL,
    "failureMode" TEXT NOT NULL,
    "impact" TEXT,
    "probability" TEXT,
    "detectability" TEXT,
    "riskPriority" TEXT,
    "mitigation" TEXT,
    "residualRisk" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvTraceabilityMatrix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "ursCode" TEXT NOT NULL,
    "frsCode" TEXT,
    "riskCode" TEXT,
    "testScriptCode" TEXT,
    "evidenceRef" TEXT,
    "traceStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvTestScript" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "testTitle" TEXT NOT NULL,
    "moduleName" TEXT,
    "objective" TEXT,
    "preconditions" TEXT,
    "steps" TEXT,
    "expectedResult" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvTestExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "testScriptCode" TEXT NOT NULL,
    "executedBy" TEXT,
    "executionDate" TEXT,
    "actualResult" TEXT,
    "passFail" TEXT NOT NULL DEFAULT 'Pendiente',
    "evidence" TEXT,
    "reviewer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvValidationDeviation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "testExecutionCode" TEXT,
    "deviationTitle" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "rootCause" TEXT,
    "correctiveAction" TEXT,
    "impactAssessment" TEXT,
    "closureStatus" TEXT NOT NULL DEFAULT 'Abierta',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvValidationReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "summary" TEXT,
    "deviationsSummary" TEXT,
    "finalConclusion" TEXT,
    "approvedBy" TEXT,
    "approvalDate" TEXT,
    "reportStatus" TEXT NOT NULL DEFAULT 'Borrador',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CsvPeriodicReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "systemName" TEXT NOT NULL,
    "reviewPeriod" TEXT,
    "reviewer" TEXT,
    "changeSummary" TEXT,
    "incidentsSummary" TEXT,
    "auditTrailSummary" TEXT,
    "continuedValidation" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CsvValidationMasterPlan_code_key" ON "CsvValidationMasterPlan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvSystemInventory_code_key" ON "CsvSystemInventory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvUserRequirement_code_key" ON "CsvUserRequirement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvFunctionalRequirement_code_key" ON "CsvFunctionalRequirement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvRiskAssessment_code_key" ON "CsvRiskAssessment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvTraceabilityMatrix_code_key" ON "CsvTraceabilityMatrix"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvTestScript_code_key" ON "CsvTestScript"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvTestExecution_code_key" ON "CsvTestExecution"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvValidationDeviation_code_key" ON "CsvValidationDeviation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvValidationReport_code_key" ON "CsvValidationReport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CsvPeriodicReview_code_key" ON "CsvPeriodicReview"("code");
