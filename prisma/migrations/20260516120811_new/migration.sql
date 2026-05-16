/*
  Warnings:

  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Color";

-- CreateIndex
CREATE INDEX "Task_columnId_position_idx" ON "Task"("columnId", "position");

-- CreateIndex
CREATE INDEX "Task_columnId_idx" ON "Task"("columnId");
