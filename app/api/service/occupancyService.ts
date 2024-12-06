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

export async function getCurrentMonthOccupancyStats() {
    try {
        const currentDate = new Date();
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Certifique-se de que os valores no banco estejam no mesmo fuso horário usado nos filtros.
        const totalOccupancies = await prisma.occupancy.count({
            where: {
                arriveTime: {
                    gte: currentMonthStart.toISOString(), // Converte para string ISO
                    lt: nextMonthStart.toISOString(), // Converte para string ISO
                },
            },
        });

        return totalOccupancies;
    } catch (error) {
        console.error("Erro ao obter estatísticas de ocupações no mês atual:", error);
        throw new Error("Erro ao obter estatísticas de ocupações no mês atual");
    }
}

export async function getMonthlyRevenueAndFrequentLicensePlate() {
    try {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const nextMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

        // Total arrecadado no mês atual
        const totalRevenue = await prisma.occupancy.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                arriveTime: {
                    gte: currentMonthStart,
                    lt: nextMonthStart,
                },
            },
        });

        // Placa mais frequente no mês atual
        const frequentLicensePlate = await prisma.occupancy.groupBy({
            by: ['licensePlate'],
            _count: {
                licensePlate: true,
            },
            where: {
                arriveTime: {
                    gte: currentMonthStart,
                    lt: nextMonthStart,
                },
            },
            orderBy: {
                _count: {
                    licensePlate: 'desc',
                },
            },
            take: 1,
        });

        return {
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            frequentLicensePlate: frequentLicensePlate[0]?.licensePlate || null,
        };
    } catch (error) {
        console.error("Erro ao obter receita e placa mais frequente:", error);
        throw new Error("Erro ao obter receita e placa mais frequente");
    }
};

