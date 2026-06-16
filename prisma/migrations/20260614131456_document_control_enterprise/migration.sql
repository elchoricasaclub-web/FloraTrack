-- CreateTable
CREATE TABLE "SopDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "owner" TEXT,
    "effectiveDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ControlledRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Borrador',
    "sopId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ControlledRecord_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "SopDocument" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElectronicSignature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "signer" TEXT NOT NULL,
    "role" TEXT,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Firmado',
    "signedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sopId" TEXT,
    "recordId" TEXT,
    "evidence" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ElectronicSignature_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "SopDocument" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ElectronicSignature_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "ControlledRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
