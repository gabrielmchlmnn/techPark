"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Vaga({ params }: { params: { id: string } }) {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const establishmentId = params.id;

  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const response = await fetch(`/api/parkingLot?establishmentId=${establishmentId}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar vagas de estacionamento.");
        }
        const data = await response.json();
        setParkingLots(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar as vagas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLots();
  }, [establishmentId]);

  const handleParkingLotClick = (parkingLotId: number) => {
    // Redireciona para a página de cadastro de ocupação, passando o id da vaga na URL
    router.push(`/menu/ocupar/${parkingLotId}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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

      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">GERENCIAR VAGAS</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {parkingLots.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">Nenhuma vaga cadastrada neste estabelecimento.</div>
          ) : (
            parkingLots.map((lot: any) => (
              <div
                key={lot.id}
                onClick={() => handleParkingLotClick(lot.id)} // Chama a função ao clicar na vaga
                className={`flex items-center justify-center h-24 rounded-lg text-white font-bold text-lg shadow-md cursor-pointer transform transition-all duration-300 ease-in-out ${
                  lot.status === "OCCUPIED" ? "bg-red-400" : "bg-green-400"
                } hover:scale-105 hover:shadow-xl`}
              >
                Vaga #{lot.number}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/menu")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Voltar ao Menu
          </button>
        </div>
      </div>
    </div>
  );
}
