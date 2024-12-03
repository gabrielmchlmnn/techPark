import prisma from "@/lib/db";

export const getParkingLotsByEstablishmentId = async (establishmentId: string) => {
  try {
    const establishmentIdNumber = Number(establishmentId);
    const parkingLots = await prisma.parkingLot.findMany({
      where: {
        establishmentId: establishmentIdNumber,
      },
    });
    return parkingLots;
  } catch (error) {
    console.error("Erro ao buscar vagas de estacionamento: ", error);
    throw new Error("Erro ao buscar vagas de estacionamento.");
  }
};
