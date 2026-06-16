-- CreateTable
CREATE TABLE "EnterpriseAiProviderConnection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "baseUrlRef" TEXT,
    "secretEnvName" TEXT,
    "dataPolicy" TEXT,
    "enabledModules" TEXT,
    "connectionMode" TEXT NOT NULL DEFAULT 'Configuracion',
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiModelProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "providerCode" TEXT NOT NULL,
    "modelAlias" TEXT NOT NULL,
    "useCase" TEXT NOT NULL,
    "temperaturePolicy" TEXT,
    "maxTokensPolicy" TEXT,
    "costTier" TEXT,
    "validationStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiPromptTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "promptPurpose" TEXT NOT NULL,
    "systemInstruction" TEXT,
    "userInputSchema" TEXT,
    "outputSchema" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiContextSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "moduleName" TEXT,
    "freshnessPolicy" TEXT,
    "allowedForAi" TEXT NOT NULL DEFAULT 'Pendiente',
    "dataSensitivity" TEXT NOT NULL DEFAULT 'Regulado',
    "ownerRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiKnowledgeBase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "kbName" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "domainArea" TEXT NOT NULL,
    "sourceSummary" TEXT,
    "indexingStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "lastRefresh" TEXT,
    "ownerRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiGuardrailPolicy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "policyName" TEXT NOT NULL,
    "restrictionArea" TEXT NOT NULL,
    "ruleText" TEXT NOT NULL,
    "blockedContent" TEXT,
    "escalationRule" TEXT,
    "humanReviewRequired" TEXT NOT NULL DEFAULT 'Si',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiRequestLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "userQuestion" TEXT NOT NULL,
    "providerCode" TEXT,
    "modelAlias" TEXT,
    "contextUsed" TEXT,
    "responseSummary" TEXT,
    "humanReview" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Registrado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiResponseEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "requestCode" TEXT NOT NULL,
    "evaluationType" TEXT NOT NULL,
    "accuracyScore" TEXT,
    "complianceScore" TEXT,
    "reviewer" TEXT,
    "findings" TEXT,
    "actionRequired" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiUsageMeter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "providerCode" TEXT,
    "modelAlias" TEXT,
    "requestCount" TEXT,
    "tokenEstimate" TEXT,
    "costEstimate" TEXT,
    "billingPeriod" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnterpriseAiAutomationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "targetModule" TEXT NOT NULL,
    "promptTemplateCode" TEXT,
    "schedulePolicy" TEXT,
    "lastRunStatus" TEXT NOT NULL DEFAULT 'Nunca ejecutado',
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiProviderConnection_code_key" ON "EnterpriseAiProviderConnection"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiModelProfile_code_key" ON "EnterpriseAiModelProfile"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiPromptTemplate_code_key" ON "EnterpriseAiPromptTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiContextSource_code_key" ON "EnterpriseAiContextSource"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiKnowledgeBase_code_key" ON "EnterpriseAiKnowledgeBase"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiGuardrailPolicy_code_key" ON "EnterpriseAiGuardrailPolicy"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiRequestLog_code_key" ON "EnterpriseAiRequestLog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiResponseEvaluation_code_key" ON "EnterpriseAiResponseEvaluation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiUsageMeter_code_key" ON "EnterpriseAiUsageMeter"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseAiAutomationJob_code_key" ON "EnterpriseAiAutomationJob"("code");
