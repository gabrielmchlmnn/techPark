import { NextResponse } from 'next/server';
import { getMonthlyRevenueAndFrequentLicensePlate } from '@/app/api/service/occupancyService';

export async function GET(request: Request) {
  try {
    const { totalRevenue, frequentLicensePlate } = await getMonthlyRevenueAndFrequentLicensePlate();

    return NextResponse.json({
      totalRevenue,
      frequentLicensePlate,
    }, { status: 200 });
  } catch (error) {
    console.error('Erro ao obter receita e placa mais frequente:', error);
    return NextResponse.json({ error: 'Erro ao obter receita e placa mais frequente.' }, { status: 500 });
  }
}
