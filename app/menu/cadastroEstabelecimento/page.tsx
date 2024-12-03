"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroEstabelecimento() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [numberOfParkingLots, setNumberOfParkingLots] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }

      const response = await fetch("http://localhost:3000/api/establishment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          userId,
          numberOfParkingLots: Number(numberOfParkingLots),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar estabelecimento");
      }

      const result = await response.json();
      setSuccess(result.message);

      setName("");
      setAddress("");
      setNumberOfParkingLots(0);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar estabelecimento. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cadastrar Estabelecimento</h2>
        <p className="text-gray-500 mb-6">
          Preencha as informações para cadastrar um novo estabelecimento!
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Estabelecimento
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do Estabelecimento"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="numberOfParkingLots" className="block text-sm font-medium text-gray-700">
              Número de Vagas
            </label>
            <input
              id="numberOfParkingLots"
              type="number"
              value={numberOfParkingLots}
              onChange={(e) => setNumberOfParkingLots(e.target.value)}
              placeholder="0"
              min={0}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Cadastrar
            </button>
            <button
              onClick={() => router.push("/menu")}
              type="button"
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
