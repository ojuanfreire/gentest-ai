import React, { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

export const RegisterForm = () => {
  const { loading, error, handleSignUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (name.trim() === "") {
      setFormError("Por favor, informe seu nome.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    await handleSignUp(name, email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-xl"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Criar Conta
        </h2>

        <div className="flex flex-col gap-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome Completo"
            autoComplete="name"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoComplete="new-password"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Senha"
            autoComplete="new-password"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(formError || error) && (
          <p className="mt-3 text-center text-sm text-red-500">
            {formError || error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>

        <div className="mt-6 text-center text-sm">
          <p className="mt-4 text-slate-400">
            Já possui uma conta?{" "}
            <a
              href="#" // Mudar para a rota de "login" depois
              className="font-medium text-blue-500 transition-colors hover:underline"
            >
              Entrar
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
