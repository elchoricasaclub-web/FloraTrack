-- CreateTable
CREATE TABLE "Iso17025AccreditationScope" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "labName" TEXT NOT NULL,
    "accreditationBody" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Colombia',
    "standardVersion" TEXT NOT NULL DEFAULT 'ISO/IEC 17025',
    "testAreas" TEXT,
    "scopeStatus" TEXT NOT NULL DEFAULT 'En implementacion',
    "expiryDate" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Iso17025RequirementItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "clauseCode" TEXT NOT NULL,
    "clauseTitle" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "evidenceRequired" TEXT,
    "sopRequired" TEXT,
    "responsibleRole" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabMethodValidationRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "methodCode" TEXT NOT NULL,
    "methodName" TEXT NOT NULL,
    "matrixType" TEXT,
    "validationParameters" TEXT,
    "acceptanceCriteria" TEXT,
    "validationStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "approvedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabInstrumentControl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "instrumentName" TEXT NOT NULL,
    "instrumentType" TEXT,
    "serialNumber" TEXT,
    "location" TEXT,
    "calibrationDueDate" TEXT,
    "qualificationStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "maintenanceStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabCalibrationRecord17025" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "instrumentCode" TEXT NOT NULL,
    "calibrationDate" TEXT,
    "dueDate" TEXT,
    "provider" TEXT,
    "certificateNumber" TEXT,
    "result" TEXT,
    "uncertainty" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabMeasurementUncertainty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "methodCode" TEXT NOT NULL,
    "analyte" TEXT NOT NULL,
    "matrixType" TEXT,
    "uncertaintyValue" TEXT,
    "coverageFactor" TEXT,
    "confidenceLevel" TEXT,
    "reviewedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En revision',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabProficiencyTestRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "roundCode" TEXT,
    "analyte" TEXT,
    "methodCode" TEXT,
    "resultEvaluation" TEXT,
    "correctiveAction" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabSampleCustody17025" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sampleCode" TEXT NOT NULL,
    "receivedBy" TEXT,
    "receivedDate" TEXT,
    "conditionAtReceipt" TEXT,
    "storageCondition" TEXT,
    "custodyStatus" TEXT NOT NULL DEFAULT 'Recibida',
    "status" TEXT NOT NULL DEFAULT 'Activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabResultReviewRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sampleCode" TEXT NOT NULL,
    "methodCode" TEXT,
    "analyst" TEXT,
    "resultSummary" TEXT,
    "specificationDecision" TEXT,
    "reviewer" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'Pendiente revision',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabControlChartRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "methodCode" TEXT NOT NULL,
    "qcSample" TEXT,
    "parameterName" TEXT,
    "valueRecorded" TEXT,
    "trendStatus" TEXT NOT NULL DEFAULT 'Normal',
    "investigationRequired" TEXT NOT NULL DEFAULT 'No',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Iso17025AccreditationScope_code_key" ON "Iso17025AccreditationScope"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Iso17025RequirementItem_code_key" ON "Iso17025RequirementItem"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabMethodValidationRecord_code_key" ON "LabMethodValidationRecord"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabInstrumentControl_code_key" ON "LabInstrumentControl"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabCalibrationRecord17025_code_key" ON "LabCalibrationRecord17025"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabMeasurementUncertainty_code_key" ON "LabMeasurementUncertainty"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabProficiencyTestRecord_code_key" ON "LabProficiencyTestRecord"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabSampleCustody17025_code_key" ON "LabSampleCustody17025"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabResultReviewRecord_code_key" ON "LabResultReviewRecord"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LabControlChartRecord_code_key" ON "LabControlChartRecord"("code");
