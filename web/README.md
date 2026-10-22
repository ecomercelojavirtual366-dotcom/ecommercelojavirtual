# Estilo & Moda — MVP Ecommerce (TCC)

Loja feminina online com vitrine pública, carrinho, pedidos mockados e painel administrativo.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Firebase Auth + Firestore (opcional)
- Pronto para deploy na Vercel

## Funcionalidades

- Home com carousel responsivo
- Catálogo público (qualquer pessoa visualiza)
- Cadastro/login obrigatório ao adicionar ao carrinho
- Carrinho + checkout mockado
- Histórico de pedidos por usuário
- Área admin: cadastro/edição/exclusão de produtos e preços
- Layout responsivo para mobile

## Como rodar

```bash
cd web
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Modo local (sem Firebase)

Se não houver `.env.local`, o app usa `localStorage`:

- Produtos seedados automaticamente
- Conta admin (Firebase / produção):
  - **E-mail:** `ecomercelojavirtual366@gmail.com`
  - Senha: a que você definiu no Firebase Authentication

### Modo Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication > Email/Password**
3. Crie um banco **Firestore**
4. Copie `.env.example` para `.env.local` e preencha as chaves
5. Publique as regras de `firestore.rules` (ajuste a lista de admins se necessário)
6. Cadastre o e-mail admin no Auth e inclua-o em `NEXT_PUBLIC_ADMIN_EMAILS`

## Deploy na Vercel

1. Importe o repositório (pasta `web` como root do projeto, ou configure Root Directory = `web`)
2. Adicione as variáveis `NEXT_PUBLIC_*` do Firebase
3. Deploy

## Estrutura

- `src/app` — páginas (home, coleção, carrinho, pedidos, contato, admin)
- `src/components` — UI (header, carousel, cards, modal de auth)
- `src/context` — auth, carrinho e produtos
- `src/data/seed.ts` — produtos e slides iniciais
