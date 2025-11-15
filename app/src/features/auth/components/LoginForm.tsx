import React, { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const { loading, error, handleSignIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-xl"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          GenTest AI
        </h2>

        <div className="flex flex-col gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-slate-400 transition-colors hover:text-blue-500 hover:underline"
          >
            Esqueci minha senha
          </Link>

          <p className="mt-4 text-slate-400">
            Ainda não possui uma conta?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-500 transition-colors hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
