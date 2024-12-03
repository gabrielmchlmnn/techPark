import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../service/userService";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, cnpj } = await req.json();
        await createUser({ name, email, password, cnpj });

        return NextResponse.json({message: "Usuário criado com sucesso."}, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Houve um erro na criação do usuário."},
            { status: 400 }
        );
    }
}