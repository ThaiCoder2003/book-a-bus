/*
  Warnings:

  - You are about to drop the column `userName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `userPhone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `basePrice` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `destStationId` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `originStationId` on the `Trip` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `arrivalStationId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureStationId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Bus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Station` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fromOrder` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toOrder` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
ALTER TYPE "SeatType" ADD VALUE 'VIP';

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_destStationId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_originStationId_fkey";

-- DropIndex
DROP INDEX "Ticket_tripId_seatId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userName",
DROP COLUMN "userPhone",
ADD COLUMN     "arrivalStationId" TEXT NOT NULL,
ADD COLUMN     "departureStationId" TEXT NOT NULL,
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Bus" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "Station" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "price",
ADD COLUMN     "fromOrder" INTEGER NOT NULL,
ADD COLUMN     "toOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "arrivalTime",
DROP COLUMN "basePrice",
DROP COLUMN "destStationId",
DROP COLUMN "originStationId",
ADD COLUMN     "routeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route_Station" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "durationFromStart" INTEGER NOT NULL DEFAULT 0,
    "distanceFromStart" INTEGER NOT NULL DEFAULT 0,
    "priceFromStart" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Route_Station_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_Station_routeId_order_key" ON "Route_Station"("routeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Route_Station_routeId_stationId_key" ON "Route_Station"("routeId", "stationId");

-- CreateIndex
CREATE INDEX "Ticket_tripId_seatId_idx" ON "Ticket"("tripId", "seatId");

-- CreateIndex
CREATE INDEX "Ticket_tripId_fromOrder_toOrder_idx" ON "Ticket"("tripId", "fromOrder", "toOrder");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route_Station" ADD CONSTRAINT "Route_Station_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route_Station" ADD CONSTRAINT "Route_Station_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_departureStationId_fkey" FOREIGN KEY ("departureStationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_arrivalStationId_fkey" FOREIGN KEY ("arrivalStationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- add overlap checked
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Ticket"
ADD CONSTRAINT "ticket_seat_overlap_check"
EXCLUDE USING GIST (
  "tripId" WITH =,
  "seatId" WITH =,
  int4range("fromOrder", "toOrder", '[)') WITH &&
);