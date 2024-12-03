"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CadastroOcupacao({ params }: { params: { id: string } }) {
  const [licensePlate, setLicensePlate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOccupied, setIsOccupied] = useState(false);
  const [occupancyId, setOccupancyId] = useState<number | null>(null);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [occupancyInfo, setOccupancyInfo] = useState<any>(null);
  const router = useRouter();

  const parkingLotId = Number(params.id);

  useEffect(() => {
    if (isNaN(parkingLotId)) {
      setError("ID da vaga inválido.");
      return;
    }

    fetchOccupancy();
  }, [parkingLotId]);

  const fetchOccupancy = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/occupancy?parkingId=${parkingLotId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar ocupação.");
      }
      const data = await response.json();

      if (data) {
        setLicensePlate(data.licensePlate);
        setIsOccupied(true);
        setOccupancyId(data.id);
        setIsPaymentPending(data.paymentStatus === "PENDING");
        setOccupancyInfo(data);
      } else {
        setIsOccupied(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!licensePlate) {
        throw new Error("Por favor, insira a placa do veículo.");
      }

      const response = await fetch("/api/occupancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parkingLotId,
          licensePlate,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar ocupação.");
      }

      const result = await response.json();
      setSuccess("Ocupação cadastrada com sucesso!");

      setLicensePlate("");
      fetchOccupancy();
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar a ocupação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeOccupancy = async () => {
    if (!occupancyId) {
      setError("Ocupação não encontrada.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/occupancy/finalize?occupancyId=${occupancyId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao finalizar a ocupação.");
      }

      const result = await response.json();
      setSuccess("Ocupação finalizada com sucesso!");
      setOccupancyInfo(result);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError("Erro ao finalizar a ocupação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cadastrar ocupação de vaga</h2>
        <p className="text-gray-500 mb-6">
          Preencha as informações para cadastrar uma nova ocupação na vaga.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
              Placa do Veículo
            </label>
            <input
              id="licensePlate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="Placa do Veículo"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={isOccupied}
            />
          </div>

          <div className="flex flex-col space-y-4">
            {!isOccupied ? (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Ocupação"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizeOccupancy}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md"
                disabled={!isPaymentPending || loading}
              >
                {loading ? "Finalizando..." : "Finalizar e cobrar"}
              </button>
            )}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-2xl font-bold mb-4">INFORMAÇÕES DE PAGAMENTO</h3>
            <p><strong>Data de Entrada:</strong> {new Date(occupancyInfo.arriveTime).toLocaleString()}</p>
            <p><strong>Data de Saída:</strong> {new Date(occupancyInfo.leaveTime).toLocaleString()}</p>
            <p><strong>Placa do Veículo:</strong> {occupancyInfo.licensePlate}</p>
            <p><strong>Valor:</strong> R$ {occupancyInfo.totalAmount}</p>
            <button
              onClick={() => router.push("/menu")}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md mt-4"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
