import React, { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";

export const LoginForm = () => {
  const { loading, error, handleSignIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};
