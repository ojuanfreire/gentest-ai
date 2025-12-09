import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Check,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

export const RegisterForm = () => {
  const { loading, error, signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    const validations = {
      minLength: /.{6,}/,
      hasUpperCase: /[A-Z]/,
      hasLowerCase: /[a-z]/,
      hasDigit: /\d/,
      hasSpecialChar: /[\W_]/,
    };

    if (!validations.minLength.test(password)) {
      return "A senha deve ter no mínimo 6 caracteres.";
    }
    if (!validations.hasUpperCase.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!validations.hasLowerCase.test(password)) {
      return "A senha deve conter pelo menos uma letra minúscula.";
    }
    if (!validations.hasDigit.test(password)) {
      return "A senha deve conter pelo menos um dígito.";
    }
    if (!validations.hasSpecialChar.test(password)) {
      return "A senha deve conter pelo menos um caractere especial.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validatePassword(password);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (name.trim() === "") {
      setFormError("O nome é obrigatório.");
      return;
    }

    if (email.trim() === "") {
      setFormError("O e-mail é obrigatório.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      return;
    }

    try {
      await signUp(name, email, password);
      navigate("/login");
    } catch (error) {
      setFormError("Erro ao registrar. Tente novamente.");
      console.log(error);
    }
  };

  const inputIconWrapperClass = "group relative";
  const inputIconClass =
    "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-blue-500";
  const inputFieldClass =
    "outline-none w-full rounded-lg border border-slate-800 bg-slate-950/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-200 p-4">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          layout
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xl ring-1 ring-white/5"
        >
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-blue-500 shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Crie sua conta
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Junte-se ao{" "}
                <span className="font-semibold text-slate-300">GenTest AI</span>{" "}
                e comece agora.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className={inputIconWrapperClass}>
                <div className={inputIconClass}>
                  <User size={18} />
                </div>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome Completo"
                  autoComplete="name"
                  className={inputFieldClass}
                />
              </div>

              <div className={inputIconWrapperClass}>
                <div className={inputIconClass}>
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  autoComplete="email"
                  className={inputFieldClass}
                />
              </div>

              <div className={inputIconWrapperClass}>
                <div className={inputIconClass}>
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha forte"
                  autoComplete="new-password"
                  className={inputFieldClass}
                />
              </div>

              <div className={inputIconWrapperClass}>
                <div className={inputIconClass}>
                  <Check size={18} />
                </div>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  className={inputFieldClass}
                />
              </div>

              <AnimatePresence>
                {(formError || error) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400"
                  >
                    {formError || error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading}
                className="group mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 disabled:opacity-70 border-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Criando
                    conta...
                  </>
                ) : (
                  <>
                    Registrar{" "}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="border-t border-slate-800/50 bg-slate-900/50 p-4 text-center">
            <p className="text-sm text-slate-400">
              Já possui uma conta?{" "}
              <Link
                to="/"
                className="font-medium text-blue-400 transition-colors hover:text-blue-300 hover:underline"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
