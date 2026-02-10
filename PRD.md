# PRD - KL Tecnologia

## Visão Geral
Plataforma web para exposição de serviços de desenvolvimento full-stack e catálogo de produtos digitais com integração de leads via WhatsApp.

## Personas
1. **Recrutador Tech:** Busca validação de skills (Next.js, Python, Laravel) e histórico de projetos.
2. **Gestor Público:** Busca seriedade, experiência em saúde e tecnologias robustas (Postgres/MySQL).
3. **Pequeno Empresário:** Busca uma solução pronta (CRM, Automação) para resolver um problema imediato.

## User Stories
* **Como recrutador,** quero ver o stack técnico do desenvolvedor para validar se ele atende à vaga.
* **Como gestor público,** quero ler sobre cases na área da saúde para sentir segurança na contratação.
* **Como comprador,** quero ver os detalhes técnicos de um script para saber se ele me atende antes de chamar no WhatsApp.

## Requisitos Funcionais (MVP)
* **CMS via Supabase:** Gerenciamento centralizado de projetos do portfólio e itens da vitrine.
* **Filtro de Vitrine:** Categoria para separar Scripts, Sistemas DigiSat e Sistemas PLW.
* **Lead Routing:** Botões de WhatsApp com mensagens pré-configuradas baseadas no produto visualizado.
* **Área de Depoimentos/Logos:** Exibição de clientes e parceiros (Governo, DigiSat, etc).

## Requisitos Não-Funcionais
* **Performance:** Nota > 90 no Google PageSpeed Insights (LCP rápido).
* **SEO:** Meta tags dinâmicas para cada item do catálogo.
* **Arquitetura:** Client-side first com Next.js (App Router) e Supabase para dados dinâmicos.

## Integrações
* **Supabase Database:** Armazenamento de produtos e projetos.
* **WhatsApp Business API/Link:** Direcionamento de leads.