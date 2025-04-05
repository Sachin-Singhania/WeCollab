-- CreateTable
CREATE TABLE "YoutubeUpload" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YoutubeUpload" ADD CONSTRAINT "YoutubeUpload_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
