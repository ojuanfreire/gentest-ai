import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

export const ForgotPasswordForm = () => {
  const { loading, error, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const success = await resetPassword(email);

    if (success) {
      setMessage(
        "Se o e-mail estiver cadastrado, enviamos um link de recuperação para ele."
      );
      setEmail("");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-200 p-4">
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-blue-500/20">
                <KeyRound size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Esqueceu a senha?
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Sem problemas. Digite seu e-mail abaixo e nós ajudaremos você a
                recuperar o acesso.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Input Email */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-blue-500">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  autoComplete="email"
                  className="outline-none w-full rounded-lg border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Mensagem de Sucesso */}
              {message && (
                <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400 animate-fade-in">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              {/* Mensagem de Erro */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-pulse">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Botão Principal */}
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 disabled:opacity-70 border-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800/50 bg-slate-900/50 p-4 text-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
