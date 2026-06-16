-- CreateTable
CREATE TABLE "RegulatoryAiKnowledgePack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "packName" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "regulatoryArea" TEXT NOT NULL,
    "sourceType" TEXT,
    "summary" TEXT,
    "applicability" TEXT,
    "confidenceLevel" TEXT NOT NULL DEFAULT 'Media',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "triggerCondition" TEXT,
    "recommendationLogic" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "operationScope" TEXT NOT NULL,
    "assessmentType" TEXT NOT NULL,
    "score" TEXT,
    "conclusion" TEXT,
    "assessedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "recommendationTitle" TEXT NOT NULL,
    "recommendationText" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Alta',
    "regulatoryImpact" TEXT,
    "targetDate" TEXT,
    "ownerRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiGapFinding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "gapArea" TEXT NOT NULL,
    "gapDescription" TEXT NOT NULL,
    "applicableStandard" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "suggestedCapa" TEXT,
    "evidenceRequired" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiCountryComparison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sourceCountry" TEXT NOT NULL,
    "targetCountry" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "differenceSummary" TEXT,
    "additionalRequirements" TEXT,
    "exportImpact" TEXT,
    "readinessStatus" TEXT NOT NULL DEFAULT 'En analisis',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiOperationProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "operationName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "activities" TEXT,
    "licensesNeeded" TEXT,
    "standardsRecommended" TEXT,
    "premiumCertifications" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Alto',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiEvidenceRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "requirementRef" TEXT,
    "evidenceTitle" TEXT NOT NULL,
    "evidenceReason" TEXT,
    "ownerRole" TEXT,
    "dueDate" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiQuestionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "userQuestion" TEXT NOT NULL,
    "answerSummary" TEXT,
    "sourceScope" TEXT,
    "confidenceLevel" TEXT NOT NULL DEFAULT 'Media',
    "followUpAction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Registrada',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryAiRoadmapItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "roadmapArea" TEXT NOT NULL,
    "roadmapAction" TEXT NOT NULL,
    "phase" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Alta',
    "dependency" TEXT,
    "expectedOutcome" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiKnowledgePack_code_key" ON "RegulatoryAiKnowledgePack"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiRule_code_key" ON "RegulatoryAiRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiAssessment_code_key" ON "RegulatoryAiAssessment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiRecommendation_code_key" ON "RegulatoryAiRecommendation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiGapFinding_code_key" ON "RegulatoryAiGapFinding"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiCountryComparison_code_key" ON "RegulatoryAiCountryComparison"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiOperationProfile_code_key" ON "RegulatoryAiOperationProfile"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiEvidenceRequest_code_key" ON "RegulatoryAiEvidenceRequest"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiQuestionLog_code_key" ON "RegulatoryAiQuestionLog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RegulatoryAiRoadmapItem_code_key" ON "RegulatoryAiRoadmapItem"("code");
