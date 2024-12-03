import bcrypt from 'bcryptjs';
import prisma from "@/lib/db";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  cnpj: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

// Função para criar um usuário
export async function createUser({ name, email, password, cnpj }: CreateUserData) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        mail: email,
        password: hashedPassword,
        cnpj,
      },
    });

    return user;
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
    throw new Error("Erro ao criar usuário");
  }
}

export async function loginUser({ email, password }: LoginUserData) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        mail: email,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Senha incorreta");
    }

    return user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Erro ao fazer login");
  }
}