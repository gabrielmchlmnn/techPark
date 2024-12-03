import prisma from "@/lib/db";

export const getEstablishmentsByUserId = async (userId: string) => {
    try {
        const userIdNumber = Number(userId);
        const establishments = await prisma.establishment.findMany({
            where: {
                userId: userIdNumber,
            },
        });
        return establishments;
    } catch (error) {
        console.error("Erro ao buscar estabelecimentos: ", error);
        throw new Error("Erro ao buscar estabelecimentos.");
    }
};

export const deleteEstablishment = async (id: string) => {
    try {
        // Converte o ID para número dentro do serviço
        const establishmentIdNumber = Number(id);
        console.log(establishmentIdNumber);

        if (isNaN(establishmentIdNumber)) {
            throw new Error("ID inválido.");
        }

        // Executa a exclusão no Prisma
        await prisma.establishment.delete({
            where: {
                id: establishmentIdNumber,
            },
        });
    } catch (error) {
        console.error("Erro ao excluir o estabelecimento: ", error);
        throw new Error("Erro ao excluir o estabelecimento.");
    }
};

export const createEstablishmentWithParkingLots = async (
    name: string,
    adress: string,
    userId: string,
    numberOfParkingLots: number
) => {
    try {
        const userIdNumber = Number(userId);

        // Cria o estabelecimento
        const establishment = await prisma.establishment.create({
            data: {
                name,
                adress,
                userId: userIdNumber,
                parkingLots: {
                    create: Array.from({ length: numberOfParkingLots }, (_, index) => ({
                        number: index + 1,
                        status: "AVAILABLE",
                    })),
                },
            },
            include: {
                parkingLots: true,
            },
        });

        return establishment;
    } catch (error) {
        console.error("Erro ao criar estabelecimento com vagas: ", error);
        throw new Error("Erro ao criar estabelecimento com vagas.");
    }
};


