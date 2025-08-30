# Configuração do Supabase

## Estrutura do Banco de Dados

### Tabelas necessárias:

#### 1. users
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  address JSONB NOT NULL,
  rating DECIMAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. categories
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. orders
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  interests TEXT[] NOT NULL,
  opportunities TEXT[] NOT NULL,
  price DECIMAL NOT NULL,
  category_id UUID REFERENCES categories(id),
  user_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('A', 'I')) DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Políticas de Segurança (RLS)

#### Para a tabela users:
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para todos
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Permitir inserção apenas para usuários autenticados
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Permitir atualização apenas do próprio usuário
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);
```

#### Para a tabela categories:
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para todos
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Permitir inserção apenas para administradores
CREATE POLICY "Only admins can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'admin');
```

#### Para a tabela orders:
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para todos
CREATE POLICY "Orders are viewable by everyone" ON orders
  FOR SELECT USING (true);

-- Permitir inserção apenas para usuários autenticados
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Permitir atualização apenas do próprio pedido
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Permitir exclusão apenas do próprio pedido
CREATE POLICY "Users can delete their own orders" ON orders
  FOR DELETE USING (auth.uid()::text = user_id);
```

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yytuiikkqxtsnojjmwtl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dHVpa2txeHRzbm9jamptd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1Nzc4ODAsImV4cCI6MjA3MjE1Mzg4MH0.Ng74mU2MSEddo8QOjhvDYlnRO_h1jxcmXR-FoKDvM1E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dHVpa2txeHRzbm9jamptd3RsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3Nzg4MCwiZXhwIjoyMDcyMTUzODgwfQ._SKBUQfo70SPGROknA-eDCVoIFoPuiNoyPEe5QXwE98
```

## Dados Iniciais

### Inserir categorias padrão:
```sql
INSERT INTO categories (name) VALUES 
  ('Eletrônicos'),
  ('Roupas'),
  ('Acessórios'),
  ('Alimentos'),
  ('Livros'),
  ('Esportes'),
  ('Casa e Jardim'),
  ('Automóveis'),
  ('Música'),
  ('Arte e Cultura');
```

### Inserir usuário de teste:
```sql
INSERT INTO users (id, name, email, address) VALUES (
  'default-user-id',
  'Usuário Teste',
  'teste@exemplo.com',
  '{
    "city": "São Paulo",
    "country": "Brasil",
    "line": "Apto 123",
    "neighborhood": "Centro",
    "number": "123",
    "state": "SP",
    "street": "Rua das Flores",
    "zipCode": "01234-567"
  }'
);
```

## Funcionalidades Implementadas

1. **Autenticação**: Sistema completo de login/registro com Supabase Auth
2. **Usuários**: CRUD completo para usuários
3. **Categorias**: CRUD completo para categorias
4. **Pedidos**: CRUD completo para pedidos com relacionamentos
5. **Upload de Arquivos**: Sistema de upload para imagens
6. **Busca e Filtros**: Busca por categoria, preço, interesses, etc.

## Próximos Passos

1. Configurar as tabelas no Supabase Dashboard
2. Aplicar as políticas de segurança
3. Inserir dados iniciais
4. Testar as funcionalidades
5. Implementar upload de imagens para o Storage do Supabase
