"use client";

import { useState } from "react";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          cnpj,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const result = await response.json();
      setSuccess(result.message);
      
      setName("");
      setEmail("");
      setPassword("");
      setCnpj("");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cadastre-se</h2>
        <p className="text-gray-500 mb-6">
          Preencha as informações necessárias para se cadastrar!
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="20.985.437/0001-39"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">
            Cadastrar-se
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-500 hover:underline font-medium">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
