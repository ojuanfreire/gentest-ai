# GenTest AI

Projeto da disciplina INF 323 - Engenharia de Software 2, focado na construção de uma plataforma SaaS (Software as a Service) para geração de artefatos de teste de software utilizando Inteligência Artificial.

A plataforma permite que usuários gerenciem projetos, escrevam Casos de Uso detalhados e, a partir deles, gerem automaticamente Casos de Teste e esqueletos de código para automação.

📖 Índice

Visão Geral

✨ Funcionalidades Principais

🏛️ Arquitetura e Stack Tecnológica

🔧 Configuração do Ambiente Local

🧪 Executando os Testes (TDD)

🚀 Pipeline de CI/CD

🗺️ Roadmap dos Ciclos de Desenvolvimento

👥 Autores

🔭 Visão Geral

Este projeto é um sistema web completo que visa otimizar o fluxo de trabalho de QAs e Desenvolvedores. O usuário insere um Caso de Uso estruturado (com ator, pré-condições, fluxo principal, etc.), e a aplicação se comunica com um serviço de IA para processar essa entrada e gerar Casos de Teste detalhados.

Em um segundo momento, o usuário pode selecionar um Caso de Teste gerado e solicitar à IA a criação de um "esqueleto de código" para um framework de automação específico (ex: Cypress, Playwright), já com os placeholders corretos para seletores de UI.

O idioma principal do sistema é o Português do Brasil (pt-BR).

✨ Funcionalidades Principais

O escopo do projeto é definido pelos seguintes Casos de Uso:

🔐 Acesso ao Sistema: Cadastro (F1), Login (F2) e Logout (F3) de usuários.

👤 Manter Conta de Usuário: Recuperação de senha (F4) e gerenciamento de perfil (F5).

🏗️ Manter Projetos e Artefatos: Criar (F6), Listar (F7) e Excluir (F8) projetos, além de visualizar e editar Casos de Uso (F9, F11).

🤖 Elaborar Casos de Teste (IA): O core do sistema. O usuário cria um Caso de Uso (F9) e aciona a IA para processar e gerar os Casos de Teste (F12), que são salvos no histórico (F13).

📄 Consultar e Exportar Casos de Teste: Visualizar os testes gerados (F14) e exportá-los para formatos como CSV ou Excel (F15).

** Código para Automação (IA):** A partir de um teste, gerar um esqueleto de código de automação (F16) e permitir que o usuário o copie (F17).

🏛️ Arquitetura e Stack Tecnológica

Para suportar um fluxo de TDD e um pipeline de CI/CD robusto, o projeto utiliza uma arquitetura moderna baseada em um Monorepo com separação clara de responsabilidades (Frontend/Backend).

Stack

Camada

Tecnologia

Propósito

Frontend

React + TypeScript

UI reativa, tipagem estática e componentização.

Backend (BaaS)

Supabase

Cumpre o Requisito S2. Fornece Banco de Dados (Postgres), Autenticação e APIs.

Backend (Serverless)

Supabase Edge Functions

Funções de backend (TypeScript) para lógica de negócios segura, como chamar as APIs de IA (F12, F16) e gerenciar cotas (NF 12.5).

Testes

Vitest + React Testing Library

Ferramental moderno para TDD, permitindo testes unitários e de integração rápidos.

CI/CD

GitHub Actions

Automação de testes, detecção de code smells e deploy contínuo.

Estrutura do Monorepo

O repositório é organizado da seguinte forma para facilitar o desenvolvimento isolado e o CI/CD:

/
|--- 📂 app/                 <-- Frontend (React + TS)
|    |--- 📂 src/
|    |    |--- 📂 api/         # Clientes de API (Supabase, AI Service)
|    |    |--- 📂 components/  # Componentes de UI reutilizáveis (Botões, Inputs)
|    |    |--- 📂 features/    # Arquitetura Feature-Sliced (Auth, Projects, UseCases)
|    |    |--- 📂 services/    # Abstração da lógica de dados (ex: projectService.ts)
|    |    |--- 📂 utils/       # Funções puras (ex: validadores de senha [NF 1.1])
|    |    |--- 📂 __tests__/   # Testes TDD (Vitest)
|    |--- package.json
|
|--- 📂 supabase/            <-- Backend (Supabase)
|    |--- 📂 functions/       # Edge Functions (ex: generate-tests, generate-code)
|    |--- 📂 migrations/      # Migrações SQL para o schema do banco
|    |--- config.toml
|
|--- 📂 .github/             <-- Pipeline de CI/CD
|    |--- 📂 workflows/
|    |    |--- ci-cd.yml       # Define os steps de Teste, Smell Detection e Deploy
|
|--- README.md               <-- Você está aqui


Modelo de Dados Conceitual

O fluxo de dados segue o modelo conceitual:

Usuário → (cria) → Projeto → (contém) → Caso de Uso → (origina) → Caso de Teste → (origina) → Esqueleto de Código

🔧 Configuração do Ambiente Local

Siga os passos abaixo para executar o projeto localmente.

Pré-requisitos

Node.js (v18+)

Git

Supabase CLI

Conta no Supabase (para as chaves de API e banco de dados)

Chave de API de um serviço de IA (ex: OpenAI, Gemini)

1. Configuração do Backend (Supabase)

O Supabase será executado localmente e usará shadow database para migrações seguras.

# 1. Clone o repositório
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
cd SEU-REPOSITORIO

# 2. Inicie os serviços do Supabase (Docker)
cd supabase
supabase start

# 3. Configure as chaves secretas (para as Edge Functions)
# Crie um arquivo .env em /supabase/functions/
# Adicione suas chaves de IA (ex: OPENAI_API_KEY=sk-...)
cp .env.example .env

# 4. Aplique as migrações do banco
supabase db push


2. Configuração do Frontend (React)

O frontend precisa das chaves locais do Supabase para se conectar.

# 1. Navegue até a pasta do app
cd ../app

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie as chaves (anon key e URL) exibidas no terminal do 'supabase start'
cp .env.local.example .env.local

# 4. Edite o .env.local com as chaves:
# VITE_SUPABASE_URL=[http://127.0.0.1:54321](http://127.0.0.1:54321)
# VITE_SUPABASE_ANON_KEY=...

# 5. Inicie o servidor de desenvolvimento
npm run dev


Acesse http://localhost:5173 no seu navegador.

🧪 Executando os Testes (TDD)

O projeto segue uma metodologia TDD. Os testes são escritos antes do código da funcionalidade.

Para executar a suíte de testes do frontend:

# Na pasta /app
cd app

# Executa os testes uma vez
npm test

# Executa os testes em modo 'watch' (TDD)
npm run test:watch


🚀 Pipeline de CI/CD

Este repositório está configurado com um pipeline de CI/CD (.github/workflows/ci-cd.yml) que será executado a cada commit no GitHub.

O pipeline realiza as seguintes etapas:

Checkout: Baixa o código do repositório.

Setup: Instala o Node.js e as dependências (npm install).

Test: Executa a suíte de testes unitários (npm test). O build só continua se todos os testes passarem.

Smell Detection: Executa um script de análise estática para detectar code smells, como "God Classes".

Create Issues: Se smells forem detectados, o pipeline cria automaticamente uma Issue no GitHub detalhando o problema.

Deploy: Se todos os testes passarem, o sistema é colocado em produção automaticamente (ex: Vercel, Netlify, Render).

🗺️ Roadmap dos Ciclos de Desenvolvimento

O desenvolvimento do projeto segue o planejamento de ciclos iterativos:

✅ Ciclo 1: Geração de Testes (Core)

Foco: Implementar os casos de uso "Elaborar Casos de Teste".

Entidades: Caso de Uso e Caso de Teste.

✅ Ciclo 2: Autenticação e Usuários

Foco: Implementar "Acesso a Sistema" e "Manter Conta de Usuário".

Entidades: Usuário.

🔄 Ciclo 3: Projetos e Consultas (Em andamento)

Foco: Implementar "Consultar e Exportar Casos de Teste" e "Manter Projetos".

Entidades: Projeto.

🗓️ Ciclo 4: Geração de Código

Foco: Implementar "Gerar Código para Automação de Teste".

Entidades: Esqueleto de Código.

👥 Autores

Juan Freire - 108220

Pedro Henrique Barbosa - 108223


Pedro Henrique Barbosa - 108223
