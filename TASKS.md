# Plano de Desenvolvimento - KL Tecnologia

Este documento unifica os requisitos do BRIEF, PRD, MVP-SCOPE e DESIGN-GUIDELINES em uma lista de tarefas técnicas sequenciais.

## Fase 1: Configuração e Infraestrutura (Setup)
- [x] **Validação do Ambiente**
    - [x] Configurar variáveis de ambiente (`.env`) com credenciais do Supabase.
    - [x] Verificar conexão com Supabase (`npm run dev` e teste de query simples).
- [x] **Design System & Assets**
    - [x] Configurar fontes: **Geist Sans** (se disponível) ou **Inter** no `layout.tsx`.
    - [x] Configurar cores no `globals.css` (Variáveis CSS para Primary, Secondary, Accent, Background conforme `DESIGN-GUIDELINES.md`).
    - [x] Instalar componentes shadcn/ui base: `button`, `card`, `tabs`, `badge`, `sheet` (mobile menu), `separator`.
    - [x] Adicionar/Verificar ícones (Lucide React) para seção de Skills.

## Fase 2: Banco de Dados (Supabase)
- [x] **Modelagem de Dados**
    - [x] Tabela `products` (Existente):
        - Adaptado para schema pt-BR: `titulo`, `descricao`, `preco`, `info_tecnica`, `whatsapp_link`, `image_url`.
        - [x] Migração: Adicionado coluna `slug`.
    - [x] Tabela `projects` (Existente):
        - Adaptado para schema pt-BR: `titulo`, `descricao`, `categoria`, `stack_tecnica`, `image_url`, `link`.
        - [x] Migração: Adicionado coluna `slug`.
    - [x] Tabela `companies` (Trust Bar/Logos):
        - `nome`, `logo_url`, `ordem`.
- [x] **Políticas de Segurança (RLS)**
    - [x] Habilitar RLS em todas as tabelas.
    - [x] Criar policies para leitura pública (`SELECT`) em `products` e `projects`.
    - [x] Validado via script (`anon key` consegue ler dados).
- [x] **Seed Data**
    - [x] Dados já existentes no banco (verificado via script).

## Fase 3: Componentes Base (UI Kit)
- [x] **Layout Principal**
    - [x] `Header/Navbar`: Logo, Links de navegação (âncoras), Botão CTA "Orçamento". Responsivo (Menu hambúrguer).
    - [x] `Footer`: Links rápidos, Copyright, Redes Sociais.
    - [x] `WhatsappFAB`: Botão flutuante do WhatsApp (fixo no canto inferior direito).
- [x] **Componentes de Conteúdo**
    - [x] `ProductCard`: Atualizado para usar tipos `Product` e links com `slug`.
    - [x] `ProjectCard`: Atualizado para usar tipos `Project` e links com `slug`.
    - [x] `SectionTitle`: Componente padronizado para títulos de seção (Tipografia Bold, tracking -0.02em).

## Fase 4: Landing Page (Estrutura)
- [x] **Hero Section**
    - [x] Headline: "Engenharia Full Stack & Soluções Digitais".
    - [x] Sub-headline: Foco em resultados/autoridade.
    - [x] CTA Principal.
    - [x] Imagem/Ilustração técnica à direita.
- [x] **Trust Bar** (Requisito unificado)
    - [x] Faixa com logos de tecnologias ou parceiros (tons de cinza).
- [x] **Seção Institucional (Gov/Saúde)**
    - [x] Layout diferenciado (bg-slate-50 ou similar).
    - [x] Copy focado em "Compliance", "Segurança" e "Experiência Governamental".
- [x] **Vitrine de Produtos (Destaque)**
    - [x] Grid de cards.
    - [ ] Implementar `Tabs` para filtro (Todos, Scripts, Sistemas) - *Nota: Implementado listagem simples no grid por enquanto, tabs ficarão na página dedicada /produtos*.
    - [x] Integração com Supabase (Server Component).
- [x] **Tech Stack / Skills** (Promovido a Must Have)
    - [x] Grid de ícones categorizados (Frontend, Backend, Infra).
- [x] **Seção de Projetos/Cases**
    - [x] Carrossel ou Grid simples de projetos recentes.

## Fase 5: Páginas Internas & Dinâmicas
- [x] **Página de Detalhes do Produto** (`/produtos/[slug]`)
    - [x] Fetch de dados do Supabase via Slug.
    - [x] Exibição detalhada: Descrição completa, Screenshots, Lista de funcionalidades.
    - [x] Botão de compra/contato (Link direto WhatsApp com mensagem pré-preenchida: "Olá, tenho interesse no script X...").
    - [x] Meta tags dinâmicas para SEO (Título, Descrição, OG Image).
- [x] **Página de Detalhes do Projeto** (`/portfolio/[slug]`)
    - [x] (Simplificada para MVP) Descrição do desafio e solução.

## Fase 6: Polimento e Otimização
- [x] **Performance (LCP/CLS)**
    - [x] Otimizar imagens (uso de `next/image` com tamanhos corretos) - *Nota: MVP usa tags img padrão para simplicidade de domínios externos*.
    - [x] Verificar carregamento de fontes (Geist Sans configurada).
- [x] **SEO Técnico**
    - [x] Configurar `metadata` no `layout.tsx` (título base, descrição, keywords).
    - [x] Sitemap.xml e Robots.txt.
- [x] **Responsividade**
    - [x] Testar e ajustar quebras de layout em Mobile e Tablet (Layout fluído com Tailwind).

## Fase 7: Deploy Final
- [x] **Build**
    - [x] Rodar `npm run build` e corrigir erros de lint/types.
- [ ] **Deploy**
    - [ ] Configurar VPS/Vercel (conforme `DEPLOY.md`).
    - [ ] Verificar variáveis de ambiente em produção.
    - [ ] Teste final de fluxo (Navegação -> Interesse -> WhatsApp).
