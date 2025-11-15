import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { signUp } from "../services/authService";

// Fazendo mock do cliente Supabase
vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

describe("authService", () => {
  
  // Antes de cada teste, reseta os mocks
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("deve retornar sucesso se o signUp for bem-sucedido", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    const mockData = { user: mockUser, session: {} };
    
    // Configura o mock para retornar sucesso
    (supabase.auth.signUp as Mock).mockResolvedValue({ data: mockData, error: null });

    const name = "Test User";
    const email = "test@example.com";
    const password = "password123";

    await expect(signUp(name, email, password)).resolves.toEqual(mockUser);
  });

  it("deve lançar um erro se o signUp falhar", async () => {
    const mockError = { message: "Email already taken" };

    // Configura o mock para retornar um erro
    (supabase.auth.signUp as Mock).mockResolvedValue({ data: null, error: mockError });

    await expect(
      signUp("Test User", "test@example.com", "password123")
    ).rejects.toThrow(mockError.message);
  });
});