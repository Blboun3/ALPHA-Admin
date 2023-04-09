-- CreateTable
CREATE TABLE "Warn" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,

    CONSTRAINT "Warn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "open" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRole" (
    "memberId" TEXT NOT NULL,
    "roles" TEXT[],

    CONSTRAINT "LeaveRole_pkey" PRIMARY KEY ("memberId")
);
