-- CreateTable
CREATE TABLE "RegulatoryDossier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Licencia',
    "authority" TEXT,
    "companyName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DossierSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "dossierCode" TEXT,
    "sectionNumber" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DossierAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "dossierCode" TEXT,
    "fileName" TEXT,
    "documentType" TEXT,
    "version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuthoritySubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "dossierCode" TEXT,
    "authority" TEXT,
    "submissionNumber" TEXT,
    "submittedAt" DATETIME,
    "responseDueDate" DATETIME,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Preparación',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DossierMaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Regulatorio',
    "authority" TEXT,
    "companyName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DossierSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "dossierCode" TEXT,
    "authority" TEXT,
    "filingNumber" TEXT,
    "submittedAt" DATETIME,
    "responseStatus" TEXT,
    "observations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Preparación',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryFramework" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "country" TEXT,
    "authority" TEXT,
    "standard" TEXT NOT NULL,
    "scope" TEXT,
    "version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "effectiveDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "frameworkCode" TEXT,
    "area" TEXT,
    "requirement" TEXT NOT NULL,
    "evidence" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "requirementCode" TEXT,
    "gap" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Media',
    "actionPlan" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompliancePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT,
    "objective" TEXT,
    "progress" REAL,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AnalyticalMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "matrix" TEXT,
    "technique" TEXT,
    "version" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductSpecification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "limitValue" TEXT,
    "methodCode" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChainOfCustodyRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sampleCode" TEXT,
    "fromPerson" TEXT,
    "toPerson" TEXT,
    "location" TEXT,
    "transferDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Transferida',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OosInvestigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sampleCode" TEXT,
    "analysisCode" TEXT,
    "result" TEXT,
    "issue" TEXT NOT NULL,
    "rootCause" TEXT,
    "action" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LotGenealogy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "parentLot" TEXT,
    "childLot" TEXT,
    "productName" TEXT,
    "transformationType" TEXT,
    "quantity" REAL,
    "unit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TraceabilityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "module" TEXT,
    "recordCode" TEXT,
    "batchCode" TEXT,
    "description" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Registrado',
    "eventDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaterialConsumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "materialName" TEXT,
    "materialLot" TEXT,
    "quantity" REAL,
    "unit" TEXT,
    "processStep" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Consumido',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProcessYield" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "batchCode" TEXT,
    "processName" TEXT,
    "inputQuantity" REAL,
    "outputQuantity" REAL,
    "unit" TEXT,
    "yieldPercent" REAL,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Registrado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierQualification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "category" TEXT,
    "qualificationType" TEXT,
    "score" REAL,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En evaluación',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierAuditRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "auditType" TEXT,
    "auditor" TEXT,
    "findings" TEXT,
    "score" REAL,
    "status" TEXT NOT NULL DEFAULT 'Programada',
    "auditDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierMaterialApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "supplierName" TEXT,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT,
    "specification" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "owner" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SupplierRiskProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "riskArea" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "mitigation" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipmentQualification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "equipmentName" TEXT NOT NULL,
    "qualificationType" TEXT NOT NULL DEFAULT 'IQ',
    "protocolCode" TEXT,
    "reportCode" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planificada',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QualificationTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "qualificationCode" TEXT,
    "testName" TEXT NOT NULL,
    "acceptanceCriteria" TEXT,
    "result" TEXT,
    "executedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "executedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CriticalUtilitySystem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "systemType" TEXT,
    "area" TEXT,
    "criticality" TEXT NOT NULL DEFAULT 'Alta',
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClassifiedArea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "classification" TEXT,
    "pressureCascade" TEXT,
    "temperatureRange" TEXT,
    "humidityRange" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Calificada',
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnvMonitoringPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "areaName" TEXT NOT NULL,
    "pointType" TEXT,
    "classification" TEXT,
    "frequency" TEXT,
    "limitValue" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnvMonitoringRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "areaName" TEXT,
    "runType" TEXT,
    "performedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Programada',
    "runDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnvMonitoringResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "runCode" TEXT,
    "pointCode" TEXT,
    "parameter" TEXT NOT NULL,
    "resultValue" TEXT,
    "limitValue" TEXT,
    "unit" TEXT,
    "analyst" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EnvironmentalExcursion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "pointCode" TEXT,
    "parameter" TEXT,
    "resultValue" TEXT,
    "limitValue" TEXT,
    "issue" TEXT NOT NULL,
    "rootCause" TEXT,
    "action" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QualityTrend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "period" TEXT,
    "value" REAL,
    "unit" TEXT,
    "trend" TEXT NOT NULL DEFAULT 'Estable',
    "conclusion" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductQualityReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "batches" INTEGER,
    "deviations" INTEGER,
    "complaints" INTEGER,
    "oosCount" INTEGER,
    "conclusion" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StabilityTrendReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "batchCode" TEXT,
    "condition" TEXT,
    "parameter" TEXT NOT NULL,
    "resultValue" TEXT,
    "trend" TEXT NOT NULL DEFAULT 'Estable',
    "conclusion" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En revisión',
    "reviewDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProcessCapabilityReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "processName" TEXT NOT NULL,
    "batchCode" TEXT,
    "parameter" TEXT NOT NULL,
    "cpk" REAL,
    "sigmaLevel" REAL,
    "conclusion" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En análisis',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductFormulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "dosageForm" TEXT,
    "targetStrength" TEXT,
    "activeIngredient" TEXT,
    "excipients" TEXT,
    "processStatus" TEXT NOT NULL DEFAULT 'Desarrollo',
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BillOfMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT,
    "quantity" REAL,
    "unit" TEXT,
    "supplierName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ManufacturingInstruction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "processStep" TEXT NOT NULL,
    "stepNumber" INTEGER,
    "instruction" TEXT,
    "criticalParameter" TEXT,
    "acceptanceCriteria" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TechTransferRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "fromArea" TEXT,
    "toArea" TEXT,
    "packageCode" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "conclusion" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planificada',
    "transferDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "targetIndustries" TEXT,
    "maturityLevel" TEXT NOT NULL DEFAULT 'MVP',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceCapability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceCode" TEXT NOT NULL,
    "capabilityName" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "processArea" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Alta',
    "status" TEXT NOT NULL DEFAULT 'Planeada',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyRegulatoryProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Colombia',
    "operationTypes" TEXT NOT NULL,
    "licenseScope" TEXT,
    "productScope" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegulatoryOperationScope" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operationType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "requiredLicenses" TEXT,
    "requiredCertifications" TEXT,
    "requiredAuthorities" TEXT,
    "applicableStandards" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CertificationStandardCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "standardType" TEXT NOT NULL,
    "applicability" TEXT NOT NULL,
    "mandatoryLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CertificationRequirementMatrix" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "standardCode" TEXT NOT NULL,
    "clauseCode" TEXT NOT NULL,
    "requirementText" TEXT NOT NULL,
    "evidenceRequired" TEXT,
    "sopRequired" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "responsibleRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EvidenceVaultItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "requirementRef" TEXT,
    "evidenceTitle" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "ownerRole" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "storageRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceChecklistTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "standardCode" TEXT,
    "operationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComplianceChecklistQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateCode" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "requirementRef" TEXT,
    "evidenceExpected" TEXT,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medio',
    "orderNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyCertificationPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "certificationCode" TEXT NOT NULL,
    "targetScope" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'Planeada',
    "targetDate" TEXT,
    "responsibleRole" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyServiceSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "modulesEnabled" TEXT NOT NULL,
    "countryScope" TEXT NOT NULL DEFAULT 'Colombia',
    "status" TEXT NOT NULL DEFAULT 'Activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JurisdictionRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "ruleTitle" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "mandatoryLevel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Vigente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinBiomassBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sourceHarvestCode" TEXT,
    "geneticCode" TEXT,
    "biomassType" TEXT NOT NULL DEFAULT 'Fresca congelada',
    "weightReceived" TEXT,
    "temperatureAtReceipt" TEXT,
    "coldChainStatus" TEXT NOT NULL DEFAULT 'Pendiente verificacion',
    "qcStatus" TEXT NOT NULL DEFAULT 'Cuarentena',
    "storageLocation" TEXT,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Recibida',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinColdChainLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "biomassBatchCode" TEXT NOT NULL,
    "checkpoint" TEXT NOT NULL,
    "temperatureStatus" TEXT,
    "recordedAt" TEXT,
    "location" TEXT,
    "deviationFound" TEXT NOT NULL DEFAULT 'No',
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Registrado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinWashBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "biomassBatchCode" TEXT NOT NULL,
    "washRunType" TEXT,
    "equipmentCode" TEXT,
    "waterQuality" TEXT,
    "iceLot" TEXT,
    "operatorName" TEXT,
    "inputWeight" TEXT,
    "outputWetHash" TEXT,
    "processStatus" TEXT NOT NULL DEFAULT 'En proceso',
    "status" TEXT NOT NULL DEFAULT 'Abierto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinMicronFraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "washBatchCode" TEXT NOT NULL,
    "micronRange" TEXT NOT NULL,
    "wetWeight" TEXT,
    "dryWeight" TEXT,
    "qcStatus" TEXT NOT NULL DEFAULT 'Cuarentena',
    "disposition" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Activa',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinFreezeDryBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "fractionCode" TEXT NOT NULL,
    "equipmentCode" TEXT,
    "cycleCode" TEXT,
    "moistureStatus" TEXT NOT NULL DEFAULT 'Pendiente',
    "startDate" TEXT,
    "endDate" TEXT,
    "operatorName" TEXT,
    "qcStatus" TEXT NOT NULL DEFAULT 'Cuarentena',
    "status" TEXT NOT NULL DEFAULT 'En ciclo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinIntermediateProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "freezeDryBatchCode" TEXT NOT NULL,
    "productType" TEXT NOT NULL DEFAULT 'Bubble Hash seco',
    "weight" TEXT,
    "qcStatus" TEXT NOT NULL DEFAULT 'Cuarentena',
    "storageCondition" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Intermedio',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinPressBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "intermediateCode" TEXT NOT NULL,
    "pressEquipmentCode" TEXT,
    "pressRunCode" TEXT,
    "temperatureRecord" TEXT,
    "pressureRecord" TEXT,
    "timeRecord" TEXT,
    "inputWeight" TEXT,
    "outputWeight" TEXT,
    "yieldPercent" TEXT,
    "operatorName" TEXT,
    "qcStatus" TEXT NOT NULL DEFAULT 'Cuarentena',
    "status" TEXT NOT NULL DEFAULT 'Prensado',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinFinishedBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "pressBatchCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "batchSize" TEXT,
    "packagingType" TEXT,
    "storageCondition" TEXT,
    "sampleCode" TEXT,
    "coaCode" TEXT,
    "releaseDecision" TEXT NOT NULL DEFAULT 'Pendiente QA',
    "qaResponsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Cuarentena',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinYieldReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "sourceBatchCode" TEXT NOT NULL,
    "processStage" TEXT NOT NULL,
    "inputWeight" TEXT,
    "outputWeight" TEXT,
    "yieldPercent" TEXT,
    "trendConclusion" TEXT,
    "reviewedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'En revision',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LiveRosinReleaseRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "finishedBatchCode" TEXT NOT NULL,
    "coaCode" TEXT,
    "disposition" TEXT,
    "releaseDecision" TEXT NOT NULL DEFAULT 'Pendiente',
    "releasedBy" TEXT,
    "releaseDate" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceLine_code_key" ON "ServiceLine"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationStandardCatalog_code_key" ON "CertificationStandardCatalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ComplianceChecklistTemplate_code_key" ON "ComplianceChecklistTemplate"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinBiomassBatch_code_key" ON "LiveRosinBiomassBatch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinColdChainLog_code_key" ON "LiveRosinColdChainLog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinWashBatch_code_key" ON "LiveRosinWashBatch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinMicronFraction_code_key" ON "LiveRosinMicronFraction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinFreezeDryBatch_code_key" ON "LiveRosinFreezeDryBatch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinIntermediateProduct_code_key" ON "LiveRosinIntermediateProduct"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinPressBatch_code_key" ON "LiveRosinPressBatch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinFinishedBatch_code_key" ON "LiveRosinFinishedBatch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinYieldReview_code_key" ON "LiveRosinYieldReview"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LiveRosinReleaseRecord_code_key" ON "LiveRosinReleaseRecord"("code");
