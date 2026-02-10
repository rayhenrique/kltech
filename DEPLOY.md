# Deploy KL Tecnologia — VPS Hostinger + CloudPanel

Guia completo para colocar o projeto Next.js no ar em `kltecnologia.com`.

---

## 1. Criar o Site no CloudPanel

1. Acesse o CloudPanel: `https://SEU-IP:8443`
2. Vá em **Sites → Add Site → Create a Node.js Site**
3. Preencha:
   - **Domain Name:** `kltecnologia.com`
   - **Node.js Version:** `18` ou `20` (recomendado 20)
   - **App Port:** `3002` *(portas 3000, 3001 e 3360 já estão ocupadas)*
4. Clique em **Create**

> [!TIP]
> O CloudPanel vai criar automaticamente o usuário do sistema e o diretório do site em `/home/kltecnologia-com/htdocs/kltecnologia.com/`.

---

## 2. Configurar DNS

No painel da **Hostinger** (ou onde seu domínio está registrado):

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | `@` | `IP_DA_SUA_VPS` | 3600 |
| A | `www` | `IP_DA_SUA_VPS` | 3600 |

> [!IMPORTANT]
> A propagação do DNS pode levar até 24h, mas geralmente leva minutos.

---

## 3. SSL (HTTPS)

No CloudPanel:
1. Vá em **Sites → kltecnologia.com → SSL/TLS**
2. Clique em **Actions → New Let's Encrypt Certificate**
3. Marque `kltecnologia.com` e `www.kltecnologia.com`
4. Clique em **Create and Install**

> [!NOTE]
> O DNS precisa estar propagado para o Let's Encrypt funcionar. Se der erro, aguarde alguns minutos e tente novamente.

---

## 4. Acessar a VPS via SSH

```bash
ssh root@IP_DA_SUA_VPS
```

Depois troque para o usuário do site:

```bash
su - kltecnologia-com
```

> [!TIP]
> O nome do usuário é baseado no domínio. Verifique no CloudPanel em **Sites → kltecnologia.com → Settings** o campo "User".

---

## 5. Clonar o Repositório

```bash
# Entrar no diretório do site
cd htdocs

# Remover o conteúdo padrão do CloudPanel
rm -rf kltecnologia.com

# Clonar o repositório
git clone https://github.com/rayhenrique/kltech.git kltecnologia.com

# Entrar no projeto
cd kltecnologia.com
```

---

## 6. Configurar Variáveis de Ambiente

```bash
nano .env.local
```

Cole o conteúdo (use os valores reais do seu projeto Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xqsacaodrhxqqlrvjffp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI
PORT=3002
```

Salvar: `Ctrl+O` → `Enter` → `Ctrl+X`

> [!CAUTION]
> Nunca commite o `.env.local` no Git. Ele já está no `.gitignore`.

---

## 7. Instalar Dependências e Fazer Build

```bash
# Instalar dependências
npm install

# Fazer o build de produção
npm run build
```

> [!NOTE]
> O build pode levar 1-2 minutos. Ao final deve mostrar `✓ Compiled successfully` e listar todas as rotas.

---

## 8. Iniciar a Aplicação com PM2

Após o build (passo 7), inicie a aplicação com PM2:

```bash
# Iniciar o Next.js em produção na porta 3002
pm2 start npm --name "kltech" -- start -- -p 3002

# Salvar a lista de processos
pm2 save

# Verificar se está rodando (deve mostrar "online")
pm2 status
```

Agora configure o **auto-start** após reboot da VPS. Saia para root e execute:

```bash
# Sair para root (se estiver no usuário kltecnologia)
exit

# Gerar o serviço de startup
pm2 startup systemd -u kltecnologia --hp /home/kltecnologia
```

> [!TIP]
> Não precisa criar `ecosystem.config.js`. O flag `-p 3002` força a porta diretamente.

---

## 9. Verificar Reverse Proxy no CloudPanel

O CloudPanel já configura o Nginx reverse proxy automaticamente. Apenas confirme:

1. No CloudPanel, vá em **Sites → kltecnologia.com → Settings**
2. Confirme que o **App Port** é `3002`

---

## 10. Testar

Acesse no navegador:

- **https://kltecnologia.com** — Landing page
- **https://kltecnologia.com/admin** — Painel administrativo

---

## 11. Atualizar o Projeto (Futuro)

Sempre que fizer mudanças locais e enviar ao GitHub, siga este fluxo para atualizar na VPS:

### Passo 1 — No seu PC (Windows)

```bash
# Commitar e enviar mudanças
cd c:\xampp\htdocs\kltech
git add -A
git commit -m "feat: descrição da mudança"
git push origin main
```

### Passo 2 — Na VPS (SSH)

```bash
# Conectar na VPS
ssh root@IP_DA_SUA_VPS

# Trocar para o usuário do site
su - kltecnologia-com

# Ir até o projeto
cd htdocs/kltecnologia.com

# Puxar as mudanças do GitHub
git pull origin main

# Reinstalar dependências (se mudou package.json)
npm install

# Refazer o build de produção
npm run build

# Reiniciar a aplicação
pm2 restart kltech

# Verificar se está rodando
pm2 status
```

### Script Automático (Recomendado)

Para não repetir todos os passos, crie um script na VPS:

```bash
nano ~/deploy-kltech.sh
```

Cole:

```bash
#!/bin/bash
echo "🚀 Atualizando KL Tecnologia..."
cd /home/kltecnologia-com/htdocs/kltecnologia.com

echo "📥 Puxando mudanças do GitHub..."
git pull origin main

echo "📦 Instalando dependências..."
npm install

echo "🔨 Fazendo build de produção..."
npm run build

echo "♻️ Reiniciando aplicação..."
pm2 restart kltech

echo ""
pm2 status
echo ""
echo "✅ Deploy concluído! Site atualizado."
```

Dar permissão e usar:

```bash
chmod +x ~/deploy-kltech.sh

# Para atualizar, basta rodar:
~/deploy-kltech.sh
```

---

## Comandos Úteis na VPS

```bash
# Ver status de todos os processos PM2
pm2 status

# Ver logs em tempo real
pm2 logs kltech

# Ver últimas 100 linhas de log
pm2 logs kltech --lines 100

# Reiniciar aplicação
pm2 restart kltech

# Parar aplicação
pm2 stop kltech

# Verificar qual porta está sendo usada
pm2 describe kltech | grep PORT
```

---

## Resumo dos Comandos (Deploy Inicial)

```bash
# Na VPS como usuário do site:
cd htdocs/kltecnologia.com
npm install
npm run build
pm2 start npm --name "kltech" -- start -- -p 3002
pm2 save
# Como root: pm2 startup systemd -u kltecnologia --hp /home/kltecnologia
```

## Checklist Final

- [ ] DNS apontando para o IP da VPS
- [ ] SSL ativo (Let's Encrypt)
- [ ] `.env.local` configurado com credenciais Supabase + `PORT=3002`
- [ ] `npm run build` sem erros
- [ ] PM2 rodando (`pm2 status` mostra "online")
- [ ] App Port no CloudPanel configurado como `3002`
- [ ] Site acessível em `https://kltecnologia.com`
- [ ] Admin acessível em `https://kltecnologia.com/admin`
