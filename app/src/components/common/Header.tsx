import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, LogOut, User, ChevronDown } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mock do usuário logado (substituir pelo seu Contexto de Autenticação futuramente)
  const user = {
    name: "Usuário GenTest",
    email: "usuario@gentest.ai",
    avatarUrl: null, // Caso tenha foto, coloque a URL aqui
  };

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Aqui você adicionará a lógica real de logout (ex: supabase.auth.signOut())
    console.log("Efetuando logout...");

    // Limpa dados locais se necessário
    localStorage.removeItem("user_session");

    // Redireciona para login
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Lado Esquerdo: Logo e Nome */}
        <div
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => navigate("/")} // Redireciona para Home/Dashboard
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-900/20">
            <Bot size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            GenTest <span className="text-blue-500">AI</span>
          </span>
        </div>

        {/* Lado Direito: Menu do Usuário */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 py-1.5 pl-2 pr-3 transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {/* Avatar / Círculo com Inicial */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-sm font-bold text-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
            </div>

            {/* Nome (Escondido em mobile muito pequeno se preferir, aqui deixei visível) */}
            <div className="hidden flex-col items-start text-left sm:flex">
              <span className="text-xs font-medium text-slate-200">
                {user.name}
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b border-slate-700 px-4 py-3">
                <p className="text-sm text-white">Logado como</p>
                <p className="truncate text-xs font-medium text-slate-400">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={16} />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
