import { getParkingLotsByEstablishmentId } from "@/app/api/service/parkingLotService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const establishmentId = url.searchParams.get("establishmentId");

    if (!establishmentId) {
        return NextResponse.json({ error: "O ID do estabelecimento é necessário." }, { status: 400 });
      }

    try {
      const parkingLots = await getParkingLotsByEstablishmentId(establishmentId);
      return NextResponse.json(parkingLots);
    } catch (error) {
      return NextResponse.json({message: "Não foi possível buscar a lista de vagas deste estabelecimento." }, { status: 400 });
    }
};
