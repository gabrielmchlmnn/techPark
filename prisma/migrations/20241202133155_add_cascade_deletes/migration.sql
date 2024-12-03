-- DropForeignKey
ALTER TABLE "Occupancy" DROP CONSTRAINT "Occupancy_parkingLotId_fkey";

-- DropForeignKey
ALTER TABLE "ParkingLot" DROP CONSTRAINT "ParkingLot_establishmentId_fkey";

-- AddForeignKey
ALTER TABLE "ParkingLot" ADD CONSTRAINT "ParkingLot_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Occupancy" ADD CONSTRAINT "Occupancy_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
