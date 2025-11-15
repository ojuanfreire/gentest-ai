import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Link } from "react-router-dom";

export const ForgotPasswordForm = () => {
  // O hook agora provê a função handlePasswordReset
  const { loading, error, handlePasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  // Estado local para mensagem de sucesso
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const success = await handlePasswordReset(email);

    if (success) {
      setMessage(
        "Se o e-mail estiver cadastrado, um link de recuperação foi enviado."
      );
      setEmail("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-xl"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Recuperar Senha
        </h2>

        <p className="mb-6 text-center text-slate-400">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <div className="flex flex-col gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            autoComplete="email"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {message && (
          <p className="mt-3 text-center text-sm text-green-500">{message}</p>
        )}

        {error && (
          <p className="mt-3 text-center text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? "Enviando..." : "Enviar Link de Recuperação"}
        </Button>

        <div className="mt-6 text-center text-sm">
          <p className="mt-4 text-slate-400">
            Lembrou a senha?{" "}
            <Link
              to="/"
              className="font-medium text-blue-500 transition-colors hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
