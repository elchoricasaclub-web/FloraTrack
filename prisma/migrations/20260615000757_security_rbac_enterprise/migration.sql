-- CreateTable
CREATE TABLE "RbacRoleTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "roleCategory" TEXT NOT NULL,
    "description" TEXT,
    "defaultScope" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacPermissionMatrix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "roleCode" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "permissionSet" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'Lectura',
    "requiresSignature" TEXT NOT NULL DEFAULT 'No',
    "segregationRisk" TEXT NOT NULL DEFAULT 'Bajo',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacUserRoleAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "roleCode" TEXT NOT NULL,
    "siteScope" TEXT,
    "moduleScope" TEXT,
    "assignedBy" TEXT,
    "assignmentDate" TEXT,
    "trainingVerified" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacAccessReviewCycle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "reviewName" TEXT NOT NULL,
    "reviewPeriod" TEXT,
    "reviewer" TEXT,
    "findings" TEXT,
    "actionsRequired" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacElectronicSignaturePolicy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "policyName" TEXT NOT NULL,
    "applicableModule" TEXT NOT NULL,
    "signatureReason" TEXT,
    "requiredRole" TEXT,
    "meaningOfSignature" TEXT,
    "secondFactorRequired" TEXT NOT NULL DEFAULT 'Si',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacMfaPolicy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "policyName" TEXT NOT NULL,
    "requiredForRoles" TEXT,
    "enforcementMode" TEXT NOT NULL DEFAULT 'Pendiente',
    "exceptionAllowed" TEXT NOT NULL DEFAULT 'No',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacSessionControl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "sessionPolicy" TEXT NOT NULL,
    "timeoutMinutes" TEXT,
    "ipRestriction" TEXT,
    "deviceRestriction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacSegregationRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "conflictingRoles" TEXT NOT NULL,
    "conflictingActions" TEXT,
    "riskDescription" TEXT,
    "mitigationControl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacPermissionException" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "requestedAccess" TEXT NOT NULL,
    "justification" TEXT,
    "approvedBy" TEXT,
    "expiryDate" TEXT,
    "exceptionStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RbacSecurityControlTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "controlName" TEXT NOT NULL,
    "testObjective" TEXT NOT NULL,
    "testResult" TEXT,
    "evidence" TEXT,
    "testedBy" TEXT,
    "testDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RbacRoleTemplate_code_key" ON "RbacRoleTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacPermissionMatrix_code_key" ON "RbacPermissionMatrix"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacUserRoleAssignment_code_key" ON "RbacUserRoleAssignment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacAccessReviewCycle_code_key" ON "RbacAccessReviewCycle"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacElectronicSignaturePolicy_code_key" ON "RbacElectronicSignaturePolicy"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacMfaPolicy_code_key" ON "RbacMfaPolicy"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacSessionControl_code_key" ON "RbacSessionControl"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacSegregationRule_code_key" ON "RbacSegregationRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacPermissionException_code_key" ON "RbacPermissionException"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RbacSecurityControlTest_code_key" ON "RbacSecurityControlTest"("code");
