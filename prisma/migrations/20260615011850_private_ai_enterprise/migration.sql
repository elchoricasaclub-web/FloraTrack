-- CreateTable
CREATE TABLE "PrivateAiRuntime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "runtimeName" TEXT NOT NULL,
    "runtimeType" TEXT NOT NULL,
    "deploymentMode" TEXT NOT NULL DEFAULT 'Local',
    "endpointRef" TEXT,
    "hardwareProfile" TEXT,
    "dataBoundary" TEXT,
    "operationalStatus" TEXT NOT NULL DEFAULT 'Planeado',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiLocalModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "runtimeCode" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelFamily" TEXT,
    "modelSize" TEXT,
    "useCase" TEXT,
    "privacyRating" TEXT NOT NULL DEFAULT 'Alta',
    "validationStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Planeado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiDocumentCorpus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "corpusName" TEXT NOT NULL,
    "tenantCode" TEXT NOT NULL,
    "domainArea" TEXT NOT NULL,
    "documentTypes" TEXT,
    "sensitivityLevel" TEXT NOT NULL DEFAULT 'Regulado',
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente QA',
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiVectorIndex" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "corpusCode" TEXT NOT NULL,
    "indexName" TEXT NOT NULL,
    "embeddingModel" TEXT,
    "storageMode" TEXT NOT NULL DEFAULT 'Local',
    "refreshPolicy" TEXT,
    "indexingStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Planeado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiEmbeddingJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "corpusCode" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "sourceScope" TEXT,
    "chunkingPolicy" TEXT,
    "piiScanStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "jobStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiRagPipeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "pipelineName" TEXT NOT NULL,
    "runtimeCode" TEXT NOT NULL,
    "indexCode" TEXT NOT NULL,
    "retrievalPolicy" TEXT,
    "answerPolicy" TEXT,
    "humanReviewRequired" TEXT NOT NULL DEFAULT 'Si',
    "validationStatus" TEXT NOT NULL DEFAULT 'Pendiente CSV',
    "status" TEXT NOT NULL DEFAULT 'Planeado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiPrivacyControl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "controlName" TEXT NOT NULL,
    "controlArea" TEXT NOT NULL,
    "ruleText" TEXT NOT NULL,
    "enforcementMode" TEXT NOT NULL DEFAULT 'Manual',
    "evidenceRequired" TEXT,
    "ownerRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiInferenceTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "pipelineCode" TEXT NOT NULL,
    "testQuestion" TEXT NOT NULL,
    "expectedBehavior" TEXT,
    "actualBehavior" TEXT,
    "riskFinding" TEXT,
    "passFail" TEXT NOT NULL DEFAULT 'Pendiente',
    "reviewedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiDeploymentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "deploymentTarget" TEXT NOT NULL,
    "infrastructureNeeds" TEXT,
    "securityNeeds" TEXT,
    "validationNeeds" TEXT,
    "estimatedPhase" TEXT,
    "ownerRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planeado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrivateAiModelValidation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "modelCode" TEXT NOT NULL,
    "validationScope" TEXT NOT NULL,
    "testDataset" TEXT,
    "acceptanceCriteria" TEXT,
    "limitations" TEXT,
    "approvalDecision" TEXT NOT NULL DEFAULT 'Pendiente',
    "approvedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiRuntime_code_key" ON "PrivateAiRuntime"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiLocalModel_code_key" ON "PrivateAiLocalModel"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiDocumentCorpus_code_key" ON "PrivateAiDocumentCorpus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiVectorIndex_code_key" ON "PrivateAiVectorIndex"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiEmbeddingJob_code_key" ON "PrivateAiEmbeddingJob"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiRagPipeline_code_key" ON "PrivateAiRagPipeline"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiPrivacyControl_code_key" ON "PrivateAiPrivacyControl"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiInferenceTest_code_key" ON "PrivateAiInferenceTest"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiDeploymentPlan_code_key" ON "PrivateAiDeploymentPlan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateAiModelValidation_code_key" ON "PrivateAiModelValidation"("code");
