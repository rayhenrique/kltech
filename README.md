# KL Tecnologia

Site institucional e plataforma de produtos digitais da **KL Tecnologia** — engenharia de software com foco em saúde pública e governo.

## ✨ Funcionalidades

### Landing Page
- Hero com CTAs e ilustração interativa
- Barra de confiança com scroll infinito (empresas/órgãos cadastrados)
- Seção de serviços para governo e saúde
- Vitrine de produtos digitais com filtros
- Portfólio de projetos
- Stack técnica
- Footer com redes sociais e WhatsApp FAB

### Painel Administrativo (`/admin`)
- Autenticação com Supabase Auth
- Dashboard com estatísticas em tempo real
- **Portfólio** — CRUD de projetos com upload de imagem e categorias livres
- **Vitrine** — CRUD de produtos com upload de imagem e link de WhatsApp automático
- **Empresas** — Gestão da barra de confiança com upload de logo
- **Leads** — Mini CRM com filtros por status (novo, contactado, negociando, fechado, cancelado)
- **Contratos** — Gestão com resumo de receita mensal ativa

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 + shadcn/ui |
| Backend | Supabase (Auth, Database, Storage) |
| Fontes | Geist Sans, Geist Mono |

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/rayhenrique/kltech.git
cd kltech

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para a landing page e [http://localhost:3000/admin](http://localhost:3000/admin) para o painel administrativo.

### Build

```bash
npm run build
npm start
```

## 📁 Estrutura

```
src/
├── app/
│   ├── admin/
│   │   ├── login/              # Página de login
│   │   └── (dashboard)/        # Área protegida
│   │       ├── page.tsx        # Dashboard
│   │       ├── portfolio/      # CRUD projetos
│   │       ├── vitrine/        # CRUD produtos
│   │       ├── empresas/       # CRUD empresas
│   │       ├── leads/          # Mini CRM
│   │       └── contratos/      # CRUD contratos
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Layout raiz
├── components/
│   ├── admin/                  # Componentes do admin
│   ├── ui/                     # shadcn/ui
│   └── *.tsx                   # Seções da landing
└── lib/
    ├── actions/                # Server actions (CRUD)
    ├── queries.ts              # Funções de consulta
    └── supabase/               # Clients Supabase
```

## 📄 Licença

Projeto privado — © KL Tecnologia.
