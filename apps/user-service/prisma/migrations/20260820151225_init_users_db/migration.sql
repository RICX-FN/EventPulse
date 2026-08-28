-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users_schema";

-- CreateEnum
CREATE TYPE "users_schema"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users_schema"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "users_schema"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users_schema"."users"("email");
