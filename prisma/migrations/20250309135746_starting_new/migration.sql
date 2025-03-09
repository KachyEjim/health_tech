-- CreateTable
CREATE TABLE "DiagnosticTest" (
    "id" UUID NOT NULL,
    "patientName" VARCHAR(100) NOT NULL,
    "testType" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticTest_id_key" ON "DiagnosticTest"("id");

-- CreateIndex
CREATE INDEX "DiagnosticTest_id_idx" ON "DiagnosticTest"("id");
