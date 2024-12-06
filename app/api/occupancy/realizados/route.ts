import { NextResponse } from 'next/server';
import { getCurrentMonthOccupancyStats } from '@/app/api/service/occupancyService';

export async function GET(request: Request) {
  try {
    const totalOccupancies = await getCurrentMonthOccupancyStats();

    return NextResponse.json({ totalOccupancies }, { status: 200 });
  } catch (error) {
    console.error('Erro ao obter estatísticas do mês atual:', error);
    return NextResponse.json({ error: 'Erro ao obter estatísticas do mês atual.' }, { status: 500 });
  }
}
