# Deploy KL Tecnologia — VPS Hostinger + CloudPanel

Guia completo para colocar o projeto Next.js no ar em `kltecnologia.com`.

---

## 1. Criar o Site no CloudPanel

1. Acesse o CloudPanel: `https://SEU-IP:8443`
2. Vá em **Sites → Add Site → Create a Node.js Site**
3. Preencha:
   - **Domain Name:** `kltecnologia.com`
   - **Node.js Version:** `18` ou `20` (recomendado 20)
   - **App Port:** `3000`
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

## 8. Configurar o Processo com PM2

O CloudPanel usa PM2 para gerenciar processos Node.js.

```bash
# Verificar se pm2 está instalado
pm2 --version

# Se não estiver, instalar globalmente
npm install -g pm2
```

Criar o arquivo de configuração do PM2:

```bash
nano ecosystem.config.js
```

Cole:

```js
module.exports = {
  apps: [
    {
      name: 'kltech',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/kltecnologia-com/htdocs/kltecnologia.com',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Salvar: `Ctrl+O` → `Enter` → `Ctrl+X`

Iniciar a aplicação:

```bash
# Iniciar
pm2 start ecosystem.config.js

# Verificar se está rodando
pm2 status

# Ver logs em tempo real
pm2 logs kltech

# Salvar para reiniciar automaticamente após reboot
pm2 save
pm2 startup
```

> [!IMPORTANT]
> Se o `pm2 startup` mostrar um comando para executar como root, copie e execute como root (saia do usuário com `exit` primeiro).

---

## 9. Configurar Reverse Proxy no CloudPanel

O CloudPanel já configura um Nginx reverse proxy automaticamente para sites Node.js. Verifique se a porta está correta:

1. No CloudPanel, vá em **Sites → kltecnologia.com → Settings**
2. Confirme que o **App Port** é `3000`
3. Se precisar ajustar o Vhost, vá em **Sites → kltecnologia.com → Vhost**

A configuração do Nginx deve ter algo como:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Se não estiver, adicione manualmente no Vhost e clique **Save**.

---

## 10. Testar

Acesse no navegador:

- **https://kltecnologia.com** — Landing page
- **https://kltecnologia.com/admin** — Painel administrativo

---

## 11. Atualizar o Projeto (Futuro)

Sempre que fizer mudanças e der push no GitHub:

```bash
# Acessar a VPS
ssh root@IP_DA_SUA_VPS
su - kltecnologia-com
cd htdocs/kltecnologia.com

# Puxar mudanças
git pull origin main

# Reinstalar deps (se mudou package.json)
npm install

# Rebuild
npm run build

# Reiniciar
pm2 restart kltech
```

> [!TIP]
> Para facilitar, crie um script `deploy.sh`:
> ```bash
> #!/bin/bash
> cd /home/kltecnologia-com/htdocs/kltecnologia.com
> git pull origin main
> npm install
> npm run build
> pm2 restart kltech
> echo "✅ Deploy concluído!"
> ```
> Salve e dê permissão: `chmod +x deploy.sh`
> Execute: `./deploy.sh`

---

## Resumo dos Comandos

```bash
# Na VPS como usuário do site:
cd htdocs/kltecnologia.com
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## Checklist Final

- [ ] DNS apontando para o IP da VPS
- [ ] SSL ativo (Let's Encrypt)
- [ ] `.env.local` configurado com credenciais Supabase
- [ ] `npm run build` sem erros
- [ ] PM2 rodando (`pm2 status` mostra "online")
- [ ] Site acessível em `https://kltecnologia.com`
- [ ] Admin acessível em `https://kltecnologia.com/admin`
