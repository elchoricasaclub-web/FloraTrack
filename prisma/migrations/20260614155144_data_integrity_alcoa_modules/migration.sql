-- CreateTable
CREATE TABLE "DataIntegrityReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "principle" TEXT NOT NULL,
    "finding" TEXT,
    "evidence" TEXT,
    "score" REAL,
    "responsible" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Abierta',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
