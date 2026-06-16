-- CreateTable
CREATE TABLE "SaasTenantAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantName" TEXT NOT NULL,
    "legalName" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Colombia',
    "industry" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'Enterprise',
    "lifecycleStatus" TEXT NOT NULL DEFAULT 'Implementacion',
    "complianceTier" TEXT NOT NULL DEFAULT 'Regulated',
    "primaryContact" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasTenantSite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Colombia',
    "siteType" TEXT,
    "licensedOperations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasUserAccessProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "fullName" TEXT,
    "roleName" TEXT NOT NULL,
    "accessScope" TEXT,
    "trainingStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "mfaStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasModuleEntitlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "serviceLine" TEXT,
    "entitlementLevel" TEXT NOT NULL DEFAULT 'Full',
    "enabledStatus" TEXT NOT NULL DEFAULT 'Habilitado',
    "restrictions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasComplianceSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "subscriptionName" TEXT NOT NULL,
    "regulatoryScope" TEXT,
    "includedStandards" TEXT,
    "renewalDate" TEXT,
    "slaLevel" TEXT NOT NULL DEFAULT 'Enterprise',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasOnboardingChecklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "onboardingStep" TEXT NOT NULL,
    "ownerRole" TEXT,
    "dueDate" TEXT,
    "evidenceRequired" TEXT,
    "completionStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasDataIsolationPolicy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "isolationMode" TEXT NOT NULL DEFAULT 'Logical tenant isolation',
    "dataResidency" TEXT,
    "retentionPolicy" TEXT,
    "backupPolicy" TEXT,
    "exportPolicy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasSecurityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "userEmail" TEXT,
    "description" TEXT,
    "actionTaken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasApiIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "integrationName" TEXT NOT NULL,
    "integrationType" TEXT,
    "endpointScope" TEXT,
    "authType" TEXT,
    "validationStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SaasBillingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "planTier" TEXT NOT NULL,
    "monthlyPrice" TEXT,
    "includedModules" TEXT,
    "userLimit" TEXT,
    "tenantLimit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SaasTenantAccount_code_key" ON "SaasTenantAccount"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasTenantSite_code_key" ON "SaasTenantSite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasUserAccessProfile_code_key" ON "SaasUserAccessProfile"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasModuleEntitlement_code_key" ON "SaasModuleEntitlement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasComplianceSubscription_code_key" ON "SaasComplianceSubscription"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasOnboardingChecklist_code_key" ON "SaasOnboardingChecklist"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasDataIsolationPolicy_code_key" ON "SaasDataIsolationPolicy"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasSecurityEvent_code_key" ON "SaasSecurityEvent"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasApiIntegration_code_key" ON "SaasApiIntegration"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SaasBillingPlan_code_key" ON "SaasBillingPlan"("code");
