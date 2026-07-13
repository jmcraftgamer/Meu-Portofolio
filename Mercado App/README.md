# Central - App de E-commerce

Plataforma de e-commerce moderna inspirada no Mercado Livre, adaptada para um comercio local (supermercado/loja de conveniencia).

## Estrutura do Projeto

```
mercado-app/
  |- server/          # Backend API (Express + TypeScript + SQLite)
  |- web/             # Desktop Web App (React + Vite + Tailwind)
  |- mobile/          # Mobile App (React Native + Expo)
  |- shared/          # Tipos compartilhados
```

## Tecnologias

| Camada   | Tecnologias                                      |
|----------|--------------------------------------------------|
| Backend  | Node.js, Express, TypeScript, SQLite (better-sqlite3), JWT |
| Web      | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| Mobile   | React Native, Expo, React Navigation             |

## Requisitos

- Node.js 18+
- npm 9+

## Setup

### 1. Backend (API)

```bash
cd server
npm install
npm run seed        # Popula o banco com dados iniciais
npm run dev         # Inicia em http://localhost:3001
```

### 2. Web (Desktop)

```bash
cd web
npm install
npm run dev         # Inicia em http://localhost:5173
```

### 3. Mobile (React Native)

```bash
cd mobile
npm install
npx expo start      # Inicia o Expo dev server
```

## Credenciais de Teste

| Tipo    | Email              | Senha     |
|---------|--------------------|-----------|
| Admin   | admin@central.com  | admin123  |
| Cliente | user@teste.com     | user123   |

## Funcionalidades

### Cliente
- [x] Autenticacao (login/cadastro)
- [x] Vitrine de produtos com filtro por categoria
- [x] Carrinho de compras com controle de quantidade
- [x] Checkout com endereco de entrega
- [x] Acompanhamento de pedidos

### Administrador
- [x] Painel de gerenciamento de pedidos em tempo real
- [x] Controle de status (Pendente -> Em separacao -> Saiu para entrega -> Entregue)
- [x] Cadastro, edicao e remocao de produtos
- [x] Controle de estoque e promocoes

### Mobile (5 abas na navegacao inferior)
- [x] Inicio: vitrine principal
- [x] Categorias: filtro por categoria
- [x] Promocoes: produtos em oferta
- [x] Carrinho: itens selecionados e checkout
- [x] Configuracoes: perfil e admin

## API Endpoints

| Metodo | Rota                          | Descricao                | Auth     |
|--------|-------------------------------|--------------------------|----------|
| POST   | /api/auth/register            | Cadastro                 | -        |
| POST   | /api/auth/login               | Login                    | -        |
| GET    | /api/auth/me                  | Dados do usuario         | Token    |
| GET    | /api/products                 | Listar produtos          | -        |
| GET    | /api/products/promotions      | Produtos em promocao     | -        |
| GET    | /api/products/category/:cat   | Produtos por categoria   | -        |
| GET    | /api/products/:id             | Produto por ID           | -        |
| POST   | /api/products                 | Criar produto            | Admin    |
| PUT    | /api/products/:id             | Atualizar produto        | Admin    |
| DELETE | /api/products/:id             | Remover produto          | Admin    |
| GET    | /api/orders                   | Listar pedidos           | Token    |
| POST   | /api/orders                   | Criar pedido             | Token    |
| PUT    | /api/orders/:id/status        | Atualizar status         | Admin    |
