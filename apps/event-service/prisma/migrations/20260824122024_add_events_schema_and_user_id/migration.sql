-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "events_schema";

-- CreateEnum
CREATE TYPE "events_schema"."EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELED', 'FINISHED');

-- CreateEnum
CREATE TYPE "events_schema"."TicketStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "events_schema"."events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "user_id" TEXT NOT NULL,
    "status" "events_schema"."EventStatus" NOT NULL DEFAULT 'DRAFT',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_schema"."tickets" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" "events_schema"."TicketStatus" NOT NULL DEFAULT 'AVAILABLE',
    "reserved_by" TEXT,
    "reserved_until" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tickets_event_id_status_idx" ON "events_schema"."tickets"("event_id", "status");

-- AddForeignKey
ALTER TABLE "events_schema"."tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events_schema"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
