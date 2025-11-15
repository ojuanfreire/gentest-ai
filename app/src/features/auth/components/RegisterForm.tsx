import React, { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { Link, useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const { loading, error, handleSignUp } = useAuth();
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

    try {
      await handleSignUp(name, email, password);
      navigate("/");
    } catch {
      setFormError("Erro ao registrar. Tente novamente.");
    }
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
