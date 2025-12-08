import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bot, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

export const LoginForm = () => {
  const { loading, error, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email, password);
      navigate("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Efeitos de Luz de Fundo */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          
          <div className="p-8 sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/20">
                <Bot size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Bem-vindo de volta
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Acesse sua conta no <span className="font-semibold text-slate-300">GenTest AI</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-blue-500">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu endereço de e-mail"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-blue-500">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha segura"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-slate-400 transition-colors hover:text-blue-400"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400 animate-pulse">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="group mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 disabled:opacity-70 border-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Entrando...
                  </>
                ) : (
                  <>
                    Entrar <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div className="border-t border-slate-800/50 bg-slate-900/50 p-4 text-center">
            <p className="text-sm text-slate-400">
              Ainda não possui uma conta?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
              >
                Registre-se agora
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};