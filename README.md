# GenTest AI

Projeto da disciplina **INF 323 - Engenharia de Software 2**. Plataforma SaaS para geração de artefatos de teste de software com suporte a Inteligência Artificial.

---

## Visão Geral

O GenTest AI é um sistema web que agiliza o trabalho de QAs e desenvolvedores. O usuário fornece um **Caso de Uso** estruturado (ator, pré-condições, fluxo principal, exceções, etc.) e a plataforma gera automaticamente **Casos de Teste** e **esqueletos de código** para frameworks de automação (ex.: Cypress, Playwright).

O idioma principal do sistema é **Português do Brasil (pt-BR)**.

---

## Arquitetura e Stack Tecnológica

O projeto utiliza uma arquitetura moderna em **Monorepo** com separação frontend/backend e funções serverless.

### Camadas e Propósitos

- **Frontend**
  - Tecnologia: **React + TypeScript**
  - Propósito: UI reativa e componentizada
- **Backend (BaaS)**
  - Tecnologia: **Supabase** (Postgres, Auth, APIs)
  - Propósito: Persistência, autenticação e APIs
- **Backend (Serverless)**
  - Tecnologia: **Supabase Edge Functions (TypeScript)**
  - Propósito: Lógica segura de negócios, integração com serviços de IA (F12, F16) e controle de cotas
- **Testes**
  - Ferramentas: **Vitest + React Testing Library**
  - Propósito: TDD (testes unitários e de integração)
- **CI/CD**
  - Ferramenta: **GitHub Actions**
  - Propósito: Execução de testes, análise estática e deploy contínuo

### Estrutura do Monorepo

Raiz do repositório (exemplo):
```
/
├─ app/                # Frontend (React + TS)
│  ├─ src/
│  │  ├─ api/          # Clientes (Supabase, AI Service)
│  │  ├─ components/   # Componentes reutilizáveis
│  │  ├─ features/     # Feature-sliced (Auth, Projects, UseCases)
│  │  ├─ services/     # Lógica de acesso a dados
│  │  ├─ utils/        # Utilitários e validadores
│  │  └─ __tests__/    # Testes (Vitest)
│  └─ package.json
├─ supabase/           # Backend (Supabase)
│  ├─ functions/       # Edge Functions (generate-tests, generate-code)
│  ├─ migrations/      # Migrações SQL
│  └─ config.toml
├─ .github/
│  └─ workflows/       # CI/CD (ci-cd.yml)
└─ README.md
```

---

## Modelo Conceitual de Dados

Fluxo de dados principal:
**Usuário → Projeto → Caso de Uso → Caso de Teste → Esqueleto de Código**

Cada entidade possui atributos e relacionamentos que permitem rastrear geração e versões dos artefatos.

---

## Configuração do Ambiente Local

### Pré-requisitos

- Node.js v18+
- Git
- Supabase CLI
- Conta e projeto no Supabase (para chaves)
- Chave de API de um serviço de IA (ex.: OpenAI, Gemini)

### 1. Configuração do Backend (Supabase)

1. Clone o repositório:
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

2. Inicie os serviços do Supabase (Docker):
```bash
cd supabase
supabase start
```

3. Configure as chaves secretas para as Edge Functions:
- Copie o arquivo de exemplo e edite:
```bash
cp .env.example .env
# edite .env e adicione: OPENAI_API_KEY=sk-...
```

4. Aplique as migrações do banco:
```bash
supabase db push
```

### 2. Configuração do Frontend (React)

1. Navegue até a pasta do app:
```bash
cd ../app
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente:
```bash
cp .env.local.example .env.local
# edite .env.local com:
# VITE_SUPABASE_URL=http://127.0.0.1:54321
# VITE_SUPABASE_ANON_KEY=...
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse: http://localhost:5173

### Variáveis de Ambiente (exemplo)

- .env (supabase/functions)
  - OPENAI_API_KEY=sk-...
  - OTHER_SECRET=...
- .env.local (app)
  - VITE_SUPABASE_URL=
  - VITE_SUPABASE_ANON_KEY=

---

## Execução de Testes (TDD)

O projeto segue metodologia TDD. Testes frontend com Vitest:

- Executar testes uma vez:
```bash
cd app
npm test
```

- Executar em modo watch (TDD):
```bash
npm run test:watch
```

---

## Pipeline de CI/CD

Arquivo: `.github/workflows/ci-cd.yml`

Etapas principais:
1. Checkout do código
2. Setup (Node.js e dependências)
3. Testes (executa suite e bloqueia build se falhar)
4. Análise estática / Smell Detection
   - Se forem detectados code smells, o pipeline cria Issues automaticamente
5. Deploy automático (Vercel / Netlify / Render) quando tudo passar

---

## Autores

- **Juan Freire** — 108220
- **Pedro Henrique Barbosa** — 108223
