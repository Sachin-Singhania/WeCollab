-- DropIndex
DROP INDEX "User_id_idx";

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");
