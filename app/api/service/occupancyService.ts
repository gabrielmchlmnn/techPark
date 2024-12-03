import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateOccupancyInput {
    parkingLotId: number;
    licensePlate: string;
}

interface FinalizeOccupancyInput {
    occupancyId: number;
}

export async function createOccupancy({ parkingLotId, licensePlate }: CreateOccupancyInput) {
    const newOccupancy = await prisma.occupancy.create({
        data: {
            parkingLotId,
            licensePlate,
            arriveTime: new Date(),
            leaveTime: new Date(),
            paymentStatus: 'PENDING',
            totalAmount: 15.00,
        },
    });

    await prisma.parkingLot.update({
        where: {
            id: parkingLotId,
        },
        data: {
            status: 'OCCUPIED',
        },
    });

    return newOccupancy;
};

export async function getOccupancyByParkingLotId(parkingLotId: number) {
    try {
        const occupancy = await prisma.occupancy.findFirst({
            where: {
                parkingLotId: parkingLotId,
                paymentStatus: {
                    not: 'PAID'
                },
            },
        });

        return occupancy;
    } catch (error) {
        console.error('Erro ao buscar ocupação:', error);
        throw new Error('Erro ao buscar ocupação');
    }
};


export async function finalizeOccupancy({ occupancyId }: FinalizeOccupancyInput) {
    try {
        const occupancy = await prisma.occupancy.findUnique({
            where: { id: occupancyId },
        });

        if (!occupancy) {
            throw new Error("Ocupação não encontrada");
        }

        const updatedOccupancy = await prisma.occupancy.update({
            where: { id: occupancyId },
            data: {
                paymentStatus: 'PAID',
                leaveTime: new Date(),
            },
        });

        await prisma.parkingLot.update({
            where: { id: updatedOccupancy.parkingLotId },
            data: {
                status: 'AVAILABLE',
            },
        });

        return updatedOccupancy;
    } catch (error) {
        console.error("Erro ao finalizar ocupação:", error);
        throw new Error("Erro ao finalizar ocupação");
    }
};
