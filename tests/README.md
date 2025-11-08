# 🧪 Testes E2E - Playwright

Testes end-to-end para o Myndo usando **Playwright** com melhores práticas do **MCP (Model Context Protocol)**.

## 🎯 Características dos Testes

- ✅ **Seletores robustos** - Uso de Page Object Model com seletores centralizados
- ✅ **Práticas do MCP** - `getByRole`, `getByText`, múltiplas estratégias com `.or()`
- ✅ **Sem antipadrões** - Sem `waitForTimeout`, sem seletores por posição
- ✅ **Timeouts explícitos** - Todos os expects com timeout configurado
- ✅ **Isolamento de testes** - Cada teste cria e limpa seus próprios dados
- ✅ **Cobertura completa** - Autenticação, CRUD online e offline

---

## 📋 Pré-requisitos

1. **Usuário de teste criado no Supabase:**
   - Email: `teste@teste.com`
   - Senha: `1q2w3e`

2. **Servidor de desenvolvimento:**
   - O Playwright inicia automaticamente em `http://localhost:3333`
   - Configurado em [playwright.config.ts](../playwright.config.ts)

---

## 🚀 Como Rodar os Testes

### **Rodar todos os testes (headless)**
```bash
npm test
```

### **Rodar com interface visual**
```bash
npm run test:ui
```

### **Rodar com navegador visível**
```bash
npm run test:headed
```

### **Rodar em modo debug**
```bash
npm run test:debug
```

---

## 📂 Estrutura dos Testes

```
tests/
├── helpers.ts              # Funções auxiliares (login, CRUD, offline/online)
├── auth.spec.ts           # Testes de autenticação
├── todos-online.spec.ts   # Testes de tarefas no modo online
├── todos-offline.spec.ts  # Testes de tarefas no modo offline
└── README.md              # Este arquivo
```

---

## 🧪 Testes Disponíveis

### **1. Autenticação** (`auth.spec.ts`)
- ✅ Login com sucesso
- ✅ Redirecionamento para home page
- ✅ Verificação de usuário logado

### **2. CRUD Online** (`todos-online.spec.ts`)
- ✅ Criar tarefa no modo online
- ✅ Verificar sincronização imediata
- ✅ Deletar tarefa no modo online
- ✅ Verificar confirmação de deleção

### **3. CRUD Offline** (`todos-offline.spec.ts`)
- ✅ Simular modo offline
- ✅ Criar tarefa offline (salva localmente)
- ✅ Deletar tarefa offline
- ✅ Voltar online e verificar sincronização

---

## 🔧 Funções Auxiliares (helpers.ts)

### **Page Object Model - Selectors**
Seletores centralizados para manutenção fácil:
```typescript
selectors.auth.emailInput
selectors.auth.passwordInput
selectors.todos.newTodoInput
selectors.todos.confirmDeleteButton
selectors.status.offline
```

### **Funções Helper**

#### **`login(page)`**
Faz login com o usuário de teste usando seletores robustos.

#### **`createTodo(page, title)`**
Cria uma tarefa e aguarda ela aparecer na lista.

#### **`deleteTodo(page, title)`**
- Localiza a tarefa usando XPath ancestor
- Hover para mostrar botão de deletar
- Aguarda dialog fechar antes de verificar
- Usa `getByRole('heading')` para evitar strict mode violations

#### **`toggleTodo(page, title)`**
Marca/desmarca tarefa como concluída.

#### **`goOffline(page)`**
Simula modo offline e aguarda indicador aparecer (sem `waitForTimeout`).

#### **`goOnline(page)`**
Volta online e aguarda indicador offline desaparecer.

#### **`waitForSync(page)`**
Aguarda sincronização completar (se houver indicador de sync).

---

## 📊 Relatórios

Após rodar os testes, você pode ver o relatório HTML:

```bash
npx playwright show-report
```

---

## 🐛 Troubleshooting

### **Teste falha no login**
- Verifique se o usuário `teste@teste.com` existe no Supabase
- Confirme que a senha é `1q2w3e`
- Verifique se o email foi confirmado

### **Teste falha ao criar tarefa**
- Verifique se o servidor está rodando (`http://localhost:3333`)
- Confirme que o input de tarefa está visível na página

### **Teste offline não funciona**
- O Playwright simula offline programaticamente
- Se falhar, verifique se o indicador de offline aparece no app

### **Timeout errors**
- Aumente o timeout no arquivo de configuração
- Verifique se o servidor está lento

---

## 📸 Screenshots e Vídeos

Por padrão, o Playwright:
- Tira screenshot em caso de falha
- Grava trace em caso de retry
- Salva tudo em `test-results/`

---

## 🎯 Próximos Testes (Sugestões)

- [ ] Teste de edição de tarefa
- [ ] Teste de filtros (todas, ativas, concluídas)
- [ ] Teste de prioridades
- [ ] Teste de sincronização completa (criar offline → ir online → verificar no servidor)
- [ ] Teste de logout
- [ ] Teste de cadastro
- [ ] Teste de marcar/desmarcar como concluída
- [ ] Teste de múltiplas tarefas simultâneas

---

## 🏆 Melhores Práticas Implementadas

### **MCP Playwright Best Practices**

1. **Seletores Robustos**
   - ✅ Page Object Model com seletores centralizados
   - ✅ Uso de `getByRole()` para acessibilidade
   - ✅ Múltiplas estratégias com `.or()` para robustez
   - ✅ XPath apenas quando necessário (`ancestor::*`)

2. **Esperas Inteligentes**
   - ✅ `toBeVisible()` com timeout explícito
   - ✅ `waitFor({ state: 'visible' })` para elementos específicos
   - ✅ Remoção total de `waitForTimeout()` (antipadrão)
   - ✅ `Promise.race()` para múltiplas condições

3. **Isolamento e Limpeza**
   - ✅ Cada teste cria seus próprios dados
   - ✅ Cleanup adequado após cada teste
   - ✅ `beforeEach` para setup consistente

4. **Configuração Otimizada**
   - ✅ Timeouts configurados (global: 30s, expect: 5s, navigation: 10s)
   - ✅ Locale BR (`pt-BR`) e timezone (`America/Sao_Paulo`)
   - ✅ Screenshots e vídeos apenas em falhas
   - ✅ Trace habilitado para debugging

---

## 📚 Documentação

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [MCP Playwright Guide](https://github.com/microsoft/playwright-mcp)
- [Playwright Config](../playwright.config.ts)

---

**Última atualização:** 2025-11-08
