import { NextResponse } from 'next/server';
import { finalizeOccupancy } from '@/app/api/service/occupancyService'
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const occupancyId = url.searchParams.get('occupancyId');

    if (!occupancyId) {
      return NextResponse.json({ error: 'Parâmetro occupancyId não encontrado.' }, { status: 400 });
    }

    const updatedOccupancy = await finalizeOccupancy({ occupancyId: Number(occupancyId) });
    return NextResponse.json(updatedOccupancy, { status: 200 });
  } catch (error) {
    console.error("Erro na finalização da ocupação:", error);
    return NextResponse.json({ error: 'Erro ao finalizar a ocupação.' }, { status: 500 });
  }
}
