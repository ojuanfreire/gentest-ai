import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { signUp, signIn } from "../services/authService";

// Fazendo mock do cliente Supabase
vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
}));

describe("authService", () => {
  const mockUser = { id: "123", email: "test@example.com" };
  
  // Antes de cada teste, reseta os mocks
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- Testes de Cadastro (SignUp) ---

  it("deve realizar o cadastro com sucesso enviando os metadados corretos", async () => {
    const mockData = { user: mockUser, session: {} };
    
    // Configura o mock para retornar sucesso
    (supabase.auth.signUp as Mock).mockResolvedValue({ data: mockData, error: null });

    const name = "Test User";
    const email = "test@example.com";
    const password = "password123";

    const result = await signUp(name, email, password);

    // Verifica se chamou o supabase com os parâmetros exatos (incluindo o nome nos metadados)
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    expect(result).toEqual(mockUser);
  });

  it("deve lançar um erro se o cadastro falhar", async () => {
    const mockError = { message: "Email already taken" };

    (supabase.auth.signUp as Mock).mockResolvedValue({ data: null, error: mockError });

    await expect(
      signUp("Test User", "test@example.com", "password123")
    ).rejects.toThrow(mockError.message);
  });

  it("deve realizar o login com sucesso", async () => {
    const mockData = { user: mockUser, session: { access_token: "abc" } };

    // Configura o mock do signInWithPassword
    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({ data: mockData, error: null });

    const email = "test@example.com";
    const password = "password123";

    const result = await signIn(email, password);

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: email,
      password: password,
    });

    expect(result).toEqual(mockUser);
  });

  it("deve lançar um erro se o login falhar (ex: senha incorreta)", async () => {
    const mockError = { message: "Invalid login credentials" };

    (supabase.auth.signInWithPassword as Mock).mockResolvedValue({ data: null, error: mockError });

    await expect(
      signIn("test@example.com", "wrongpassword")
    ).rejects.toThrow(mockError.message);
  });
});