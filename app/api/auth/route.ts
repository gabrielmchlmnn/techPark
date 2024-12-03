import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/app/api/service/userService";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const user = await loginUser({ email, password });

        return NextResponse.json({ message: "Login realizado com sucesso.", user }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "Credenciais inválidas." }, { status: 400 });
    }
}
