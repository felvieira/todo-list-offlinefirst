# 📝 Myndo - Task Manager

**Gerenciador de tarefas offline-first com sincronização em nuvem**

Sistema PWA (Progressive Web App) de gerenciamento de tarefas com funcionalidade offline-first, sincronização automática com Supabase, e autenticação de usuários.

---

## 🚀 Quick Start

### **1. Pré-requisitos**

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Git

### **2. Instalação**

```bash
# Clone o repositório
git clone <seu-repositorio>
cd mynd-taskmanager-offline-first

# Instale as dependências
npm install
```

### **3. Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Feature Flags
VITE_ENABLE_GOOGLE_AUTH=false  # true para ativar login com Google
```

**Como obter as credenciais do Supabase:**
1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto ou selecione um existente
3. Vá em: Settings → API
4. Copie:
   - `URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`

### **4. Configurar Banco de Dados**

Execute o SQL de inicialização no Supabase:

1. Dashboard do Supabase → SQL Editor
2. Clique em "New Query"
3. Abra o arquivo `supabase/init.sql` deste projeto
4. Copie todo o conteúdo e cole no editor
5. Clique em "Run" ou pressione `Ctrl+Enter`

Isso irá criar:
- ✅ Tabela `todos` com todos os campos necessários
- ✅ Índices para performance
- ✅ Row Level Security (RLS) configurado
- ✅ Políticas de acesso por usuário
- ✅ Triggers automáticos

### **5. Rodar o Projeto**

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

O app estará disponível em: **http://localhost:3333**

---

## 🎯 Funcionalidades

### **Gerenciamento de Tarefas**
- ✅ Criar, editar, deletar tarefas
- ✅ Marcar tarefas como concluídas
- ✅ Prioridades (baixa, média, alta)
- ✅ Descrição opcional
- ✅ Timestamps automáticos

### **Autenticação**
- ✅ Login com email e senha (online e offline)
- ✅ Cadastro de novos usuários
- ✅ Login com Google OAuth (opcional)
- ✅ **Login offline** após primeiro acesso online
- ✅ Cache seguro de credenciais (SHA-256)
- ✅ Proteção de rotas
- ✅ Logout

### **Offline-First**
- ✅ Funciona 100% offline
- ✅ Armazenamento local com IndexedDB (Dexie)
- ✅ Sincronização automática quando online
- ✅ Queue de operações pendentes
- ✅ Indicador de status de conexão

### **Feedback Visual**
- ✅ Notificações toast para todas operações
- ✅ Indicador de sincronização no header
  - 🟢 Verde: Online e sincronizado
  - 🔵 Azul: Sincronizando...
  - 🔴 Vermelho: Offline
- ✅ **Badge "Modo Offline"** quando logado offline
- ✅ Mensagens contextuais sobre salvamento local/remoto
- ✅ Feedback de sucesso/erro em tempo real

### **PWA (Progressive Web App)**
- ✅ Instalável no desktop e mobile
- ✅ Service Worker com cache inteligente
  - Cache apenas requests GET do Supabase
  - Mutations (POST/PUT/DELETE) sempre vão para a rede
  - Cache de fonts do Google
- ✅ Funciona como app nativo
- ✅ Atualizações automáticas
- ✅ Suporte offline completo

### **Otimizações Técnicas**
- ✅ **Optimistic Updates**: Tarefa aparece instantaneamente ao criar
- ✅ **Smart Sync**: Verifica status online no momento da execução
- ✅ **Timeout Protection**: Sync com timeout de 4 segundos
- ✅ **Fallback Automático**: Query busca do IndexedDB se falhar o servidor
- ✅ **Cache Seletivo**: Service Worker cacheia apenas leituras, nunca escritas
- ✅ **Background Sync**: Queue de operações pendentes sincroniza automaticamente

---

## 🔧 Configurações Opcionais

### **Ativar Login com Google**

Por padrão, o login com Google está **desativado**. Para ativar:

**1. Configure o Google Cloud Console:**
- Acesse [console.cloud.google.com](https://console.cloud.google.com)
- Crie um projeto ou selecione existente
- Configure OAuth Consent Screen
- Crie OAuth 2.0 Client ID (Web application)
- Adicione authorized redirect URI: `https://[seu-projeto].supabase.co/auth/v1/callback`

**2. Configure no Supabase:**
- Dashboard → Authentication → Providers
- Ative "Google"
- Cole Client ID e Client Secret do Google

**3. Ative a feature flag:**
```env
VITE_ENABLE_GOOGLE_AUTH=true
```

**4. Reinicie o servidor:**
```bash
npm run dev
```

---

## 📱 Como Usar

### **Primeiro Acesso**
1. Acesse o app (http://localhost:3333)
2. Clique em "Criar conta"
3. Preencha email e senha
4. Confirme seu email (verifique a caixa de entrada)
5. Faça login

### **Criar Tarefa**
1. Digite no campo de input no rodapé da página
2. (Opcional) Clique para expandir e adicionar:
   - Descrição
   - Prioridade
3. Pressione Enter ou clique no botão "+"

### **Gerenciar Tarefas**
- **Marcar como concluída**: Clique no checkbox
- **Deletar**: Hover na tarefa → Clique no ícone de lixeira → Confirme
- **Fechar input expandido**: Clique fora do formulário

### **Modo Offline**
- Todas as operações funcionam offline
- **Login offline**: Após fazer login online uma vez, você pode fazer login offline
  - Credenciais são cacheadas com segurança (SHA-256 hash)
  - Cache expira após 30 dias sem conexão online
  - Badge amarelo "Modo Offline" aparece no header quando logado offline
- Mudanças são salvas localmente (IndexedDB)
- Sincroniza automaticamente quando volta online
- Indicadores visuais:
  - 🟡 Badge "Modo Offline" (quando logado offline)
  - 🔴 Indicador de conexão offline
  - 🟢 Indicador de sincronização completa

---

## 🏗️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: Zustand + React Query
- **Database Local**: Dexie (IndexedDB)
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **PWA**: Vite PWA Plugin + Workbox
- **Testes E2E**: Playwright (MCP Best Practices)

---

## 📂 Estrutura do Projeto

```
myndo/
├── public/                 # Assets estáticos e ícones PWA
├── src/
│   ├── app/               # Configuração principal e rotas
│   │   ├── App.tsx        # Roteamento e providers
│   │   ├── providers.tsx  # React Query provider
│   │   └── pages/         # Páginas principais
│   │       └── HomePage.tsx
│   ├── features/
│   │   ├── auth/          # Autenticação
│   │   │   ├── context/   # AuthContext
│   │   │   ├── pages/     # Login/SignUp
│   │   │   └── components/# ProtectedRoute
│   │   └── todos/         # Funcionalidade de tarefas
│   │       ├── api/       # Queries e mutations
│   │       ├── components/# TodoList, TodoItem, AddTodo
│   │       ├── hooks/     # Hooks customizados
│   │       ├── store/     # Zustand store
│   │       └── types.ts   # Types
│   ├── services/
│   │   ├── db/            # Dexie (IndexedDB)
│   │   └── supabase/      # Cliente Supabase
│   ├── shared/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Hooks compartilhados
│   │   ├── lib/           # Utilitários
│   │   └── ui/            # Componentes de UI
│   └── styles/            # CSS global
├── tests/                 # Testes E2E com Playwright
│   ├── helpers.ts         # Page Object Model e funções auxiliares
│   ├── auth.spec.ts       # Testes de autenticação
│   ├── todos-online.spec.ts   # Testes online
│   ├── todos-offline.spec.ts  # Testes offline
│   └── README.md          # Documentação dos testes
├── supabase/
│   └── init.sql           # SQL de inicialização
├── playwright.config.ts   # Configuração do Playwright
├── .env                   # Variáveis de ambiente (não commitado)
├── .env.example           # Template das variáveis
└── README.md              # Este arquivo
```

---

## 🐛 Troubleshooting

### **Erro: "Missing Supabase environment variables"**
- Verifique se o arquivo `.env` existe
- Confirme que as variáveis estão corretas
- Reinicie o servidor (`npm run dev`)

### **Tarefas não aparecem**
- Verifique se executou o SQL de inicialização no Supabase
- Confirme que está logado
- Abra DevTools (F12) → Console para ver erros

### **Não sincroniza**
- Verifique sua conexão com internet
- Veja o indicador de status no topo da tela
- Abra DevTools → Network para ver requisições

### **Erro ao fazer login**
- Confirme seu email (verifique caixa de entrada)
- Verifique se o Supabase Auth está ativo
- Tente resetar a senha

### **"Credenciais offline expiraram"**
- Isso acontece após 30 dias sem fazer login online
- Conecte-se à internet e faça login novamente
- O cache será renovado por mais 30 dias

### **"Login offline indisponível"**
- Você nunca fez login online neste dispositivo antes
- Faça o primeiro login com internet
- Após isso, poderá fazer login offline

### **Google Auth não funciona**
- Verifique se `VITE_ENABLE_GOOGLE_AUTH=true` no `.env`
- Confirme a configuração no Google Cloud Console
- Verifique a Callback URL no Google
- Configure o provider no Supabase Dashboard

---

## 🧪 Testes

O projeto inclui testes E2E (end-to-end) com **Playwright** seguindo as **melhores práticas do MCP**.

### **Características dos Testes**

- ✅ **Seletores robustos** - Page Object Model com seletores centralizados
- ✅ **MCP Best Practices** - `getByRole`, `getByText`, múltiplas estratégias
- ✅ **Sem antipadrões** - Zero `waitForTimeout`, apenas esperas baseadas em estado
- ✅ **Timeouts explícitos** - Configurados globalmente (30s) e por expect (5s)
- ✅ **Isolamento completo** - Cada teste cria e limpa seus dados

### **Rodar testes**

```bash
# Todos os testes (headless)
npm test

# Com interface visual
npm run test:ui

# Com navegador visível
npm run test:headed

# Modo debug
npm run test:debug

# Ver relatório HTML
npx playwright show-report
```

### **Cobertura de testes**
- ✅ Autenticação - Login com sucesso
- ✅ CRUD Online - Criar e deletar tarefa online
- ✅ CRUD Offline - Criar e deletar tarefa offline com sincronização

### **Usuário de teste**
- Email: `teste@teste.com`
- Senha: `1q2w3e`

**Importante:** Crie este usuário no Supabase antes de rodar os testes.

### **Arquitetura dos Testes**

```typescript
// Page Object Model - Seletores centralizados
selectors.auth.emailInput
selectors.todos.newTodoInput
selectors.status.offline

// Helpers robustos
login(page)              // Login com seletores robustos
createTodo(page, title)  // Criar tarefa
deleteTodo(page, title)  // Deletar com XPath ancestor
goOffline(page)          // Simular offline (sem waitForTimeout)
goOnline(page)           // Voltar online
waitForSync(page)        // Aguardar sincronização
```

Para mais detalhes, veja **[tests/README.md](tests/README.md)**

---

## 📦 Deploy

### **Vercel (Recomendado)**

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Deploy
vercel
```

Configure as variáveis de ambiente no dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ENABLE_GOOGLE_AUTH` (opcional)

### **Netlify**

```bash
# Build
npm run build

# Deploy a pasta dist/
```

Configure as variáveis de ambiente no site settings.

---

## 📚 Documentação Adicional

- **[ABOUT.md](ABOUT.md)** - Arquitetura detalhada, fluxos, e explicações técnicas
- **[.env.example](.env.example)** - Template de variáveis de ambiente
- **[supabase/init.sql](supabase/init.sql)** - SQL de inicialização do banco

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

---

## 💡 Suporte

- **Issues**: [GitHub Issues](seu-repositorio/issues)
- **Docs**: [ABOUT.md](ABOUT.md)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

**Feito com ❤️ usando React + TypeScript + Supabase**
