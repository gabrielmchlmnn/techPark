import { NextRequest, NextResponse } from "next/server";
import { createEstablishmentWithParkingLots, deleteEstablishment, getEstablishmentsByUserId } from "@/app/api/service/establishmentService";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID é necessário." }, { status: 400 });
  }

  try {
    const establishments = await getEstablishmentsByUserId(userId);
    return NextResponse.json(establishments);
  } catch (error) {
    return NextResponse.json({message: "Não foi possível buscar a lista de estabelecimentos deste usuário." }, { status: 400 });
  }
};


export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const establishmentId = url.searchParams.get("id");

    if (!establishmentId) {
        return NextResponse.json({ error: "Id do estabelecimento é necessário." }, { status: 400 });
    }

    try {
      await deleteEstablishment(establishmentId);
  
      return NextResponse.json(
        { message: "Estabelecimento excluído com sucesso"},
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao excluir o estabelecimento." },
        { status: 500 }
      );
    }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, userId, numberOfParkingLots } = body;

    if (!name || !address || !userId || !numberOfParkingLots) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const establishment = await createEstablishmentWithParkingLots(
      name,
      address,
      userId,
      numberOfParkingLots
    );

    return NextResponse.json(
      { message: "Estabelecimento criado com sucesso!", establishment },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar o estabelecimento." },
      { status: 500 }
    );
  }
};

