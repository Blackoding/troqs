# TROQS - Plataforma de Trocas

Plataforma para troca de itens desenvolvida com Next.js, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase

## 🛠️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd troqs
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote o URL e as chaves (anon e service_role)

#### 3.2 Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

#### 3.3 Execute o SQL no Supabase
Execute o seguinte SQL no SQL Editor do Supabase:

```sql
-- Criar tabelas
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address JSONB NOT NULL DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  interests TEXT[] NOT NULL,
  opportunities TEXT[] NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'A' CHECK (status IN ('A', 'I')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar coluna images se não existir
ALTER TABLE orders ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Políticas RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para categories
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON categories FOR ALL USING (false);

-- Políticas para orders
CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own orders" ON orders FOR DELETE USING (auth.uid() = user_id);

-- Inserir categorias iniciais
INSERT INTO categories (name) VALUES 
  ('Eletrônicos'),
  ('Imóveis'),
  ('Veículos'),
  ('Serviços'),
  ('Vestuário'),
  ('Esportes'),
  ('Livros'),
  ('Móveis'),
  ('Outros');
```

#### 3.4 Configure o Storage
1. No painel do Supabase, vá para **Storage**
2. Crie um novo bucket chamado `items`
3. Configure as políticas do bucket:

```sql
-- Política para permitir upload de imagens
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'items' AND auth.role() = 'authenticated');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Allow public viewing of images" ON storage.objects
FOR SELECT USING (bucket_id = 'items');

-- Política para permitir usuários deletarem suas próprias imagens
CREATE POLICY "Allow users to delete own images" ON storage.objects
FOR DELETE USING (bucket_id = 'items' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📱 Funcionalidades

### 🔐 Autenticação
- Login/Registro com email e senha
- Sessão persistente
- Proteção de rotas

### 📦 Gestão de Itens
- Cadastro de itens com até 5 imagens
- Upload de imagens para Supabase Storage
- Edição e exclusão de itens próprios
- Ativação/desativação de itens

### 🔍 Feed Público
- Visualização de todos os itens ativos
- Filtros por categoria e status
- Busca por título e descrição
- Navegação entre múltiplas imagens

### 👤 Dashboard
- Gestão de itens próprios
- Formulário de cadastro com máscara de preço
- Upload múltiplo de imagens

## 🎨 Componentes

- **Header**: Navegação e menu do usuário
- **Item**: Card de exibição de item com múltiplas imagens
- **ImageUpload**: Upload de múltiplas imagens com drag & drop
- **Input**: Campo de entrada personalizado
- **Select**: Campo de seleção personalizado
- **SwitchTabs**: Alternância entre abas

## 🔧 Hooks Personalizados

- **useAuth**: Gerenciamento de autenticação
- **usePriceMask**: Máscara de preço em formato brasileiro

## 📁 Estrutura do Projeto

```
src/
├── app/                 # Páginas Next.js
│   ├── dashboard/       # Dashboard do usuário
│   ├── feed/           # Feed público
│   ├── login/          # Página de login
│   └── layout.tsx      # Layout principal
├── components/         # Componentes React
├── contexts/          # Contextos React
├── hooks/             # Hooks personalizados
├── lib/               # Configurações e utilitários
├── services/          # Serviços do Supabase
└── types/             # Tipos TypeScript
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
Configure as variáveis de ambiente e execute:
```bash
npm run build
npm start
```

## 📝 Licença

Este projeto está sob a licença MIT.
