import { NextResponse } from 'next/server';
import { createOccupancy } from '@/app/api/service/occupancyService';
import { getOccupancyByParkingLotId } from '@/app/api/service/occupancyService';

export async function POST(request: Request) {
  try {
    const { parkingLotId, licensePlate } = await request.json();

    if (!parkingLotId || !licensePlate) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 });
    }

    const newOccupancy = await createOccupancy({ parkingLotId, licensePlate });

    return NextResponse.json(newOccupancy, { status: 201 });
  } catch (error) {
    console.error("Erro na criação da ocupação:", error);
    return NextResponse.json({ error: 'Erro ao cadastrar a ocupação.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parkingLotId = url.searchParams.get('parkingId');

    if (!parkingLotId) {
      return NextResponse.json({ error: 'Parâmetro "parkingId" é obrigatório.' }, { status: 400 });
    }

    const occupancy = await getOccupancyByParkingLotId(Number(parkingLotId));

    if (!occupancy) {
      return NextResponse.json({ message: 'Nenhuma ocupação encontrada para essa vaga.' }, { status: 404 });
    }

    return NextResponse.json(occupancy, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar a ocupação:", error);
    return NextResponse.json({ error: 'Erro ao buscar a ocupação.' }, { status: 500 });
  }
}
