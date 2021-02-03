-- CreateTable
CREATE TABLE "integration" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirement" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_integrations" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "integration_id" INTEGER NOT NULL,
    "requirement" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integration.slug_unique" ON "integration"("slug");

-- CreateIndex
CREATE INDEX "integration.slug_index" ON "integration"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "identity_integration_uniqueness" ON "identity_integrations"("identity_id", "integration_id");

-- CreateIndex
CREATE INDEX "user_identity_index" ON "identity_integrations"("identity_id");

-- CreateIndex
CREATE INDEX "user_integration_index" ON "identity_integrations"("identity_id", "integration_id");

-- AddForeignKey
ALTER TABLE "identity_integrations" ADD FOREIGN KEY ("integration_id") REFERENCES "integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
