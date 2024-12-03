"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Establishments() {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Obter o ID do usuário do localStorage
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      // Caso o usuário não esteja logado, redireciona para a tela de login
      router.push("/login");
      return;
    }

    // Função para buscar estabelecimentos
    const fetchEstablishments = async () => {
      try {
        const response = await fetch(`/api/establishment?userId=${userId}`);
        const data = await response.json();
        setEstablishments(data);
      } catch (error) {
        console.error("Erro ao buscar estabelecimentos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, [userId, router]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/establishment?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEstablishments((prev) => prev.filter((establishment) => establishment.id !== id));
      } else {
        alert("Erro ao excluir estabelecimento.");
      }
    } catch (error) {
      console.error("Erro ao excluir estabelecimento", error);
    }
  };

  const handleManageSlots = (id: number) => {
    // Redireciona para a tela de gerenciamento de vagas do estabelecimento
    router.push(`/menu/vaga/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => router.push("/menu/cadastroEstabelecimento")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
          Cadastrar Estabelecimento
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("userId");
            router.push("/login");
          }}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
        >
          Sair
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Nome do Estabelecimento</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Endereço</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : (
              establishments.map((establishment) => (
                <tr key={establishment.id} className="border-t">
                  <td className="px-4 py-2">{establishment.name}</td>
                  <td className="px-4 py-2">{establishment.adress}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(establishment.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 mr-2"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => handleManageSlots(establishment.id)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                    >
                      Gerenciar Vagas
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
