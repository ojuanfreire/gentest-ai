import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

export const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userData = {
    name: user?.user_metadata?.name || "Usuário",
    email: user?.email || "",
    avatarUrl: user?.user_metadata?.avatar_url || null,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        
        <div
          className="group flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => navigate("/")}
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
            <Bot size={22} />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
          </div>
          
          <span className="text-xl font-bold tracking-tight text-white">
            GenTest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">AI</span>
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`group flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
              ${isMenuOpen 
                ? "bg-slate-800 border-slate-700" 
                : "bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
              }`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden shadow-sm">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="hidden flex-col items-start text-left sm:flex">
              <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                {userData.name}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform duration-200 group-hover:text-slate-300 ${
                isMenuOpen ? "rotate-180 text-blue-400" : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 origin-top-right rounded-xl border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl py-2 shadow-2xl ring-1 ring-black/5 focus:outline-none animation-fade-in-down">
              
              <div className="border-b border-slate-700/50 px-4 py-3">
                <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Conectado como</p>
                <p className="truncate text-sm font-medium text-white">
                  {userData.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {userData.email}
                </p>
              </div>

              <div className="px-2 py-2">
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <div className="flex items-center justify-center rounded-md bg-slate-800 p-1.5 text-slate-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                    <LogOut size={16} />
                  </div>
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