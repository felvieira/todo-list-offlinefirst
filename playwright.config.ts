import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration - Otimizado com melhores práticas do MCP
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Execução paralela para melhor performance
  fullyParallel: true,

  // Prevenir commits acidentais com testes .only
  forbidOnly: !!process.env.CI,

  // Retries: 2 em CI, 0 localmente para debugging rápido
  retries: process.env.CI ? 2 : 0,

  // Workers: 1 em CI para estabilidade, automático localmente
  workers: process.env.CI ? 1 : undefined,

  // Reporters: HTML para visualização, line para CI
  reporter: process.env.CI
    ? [['html'], ['list']]
    : [['html'], ['list', { printSteps: true }]],

  // Timeout global para testes (30 segundos)
  timeout: 30000,

  // Timeout para expects (5 segundos)
  expect: {
    timeout: 5000,
  },

  use: {
    // URL base da aplicação
    baseURL: 'http://localhost:3333',

    // Trace: sempre em retry, on-all em CI para debugging
    trace: process.env.CI ? 'on' : 'on-first-retry',

    // Screenshots: sempre em falha, on-all em CI
    screenshot: process.env.CI ? 'on' : 'only-on-failure',

    // Video: apenas em retry
    video: 'retain-on-failure',

    // Configurações de navegação
    navigationTimeout: 10000,
    actionTimeout: 10000,

    // Locale e timezone
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',

    // Aceitar downloads e permissões
    acceptDownloads: true,

    // User agent customizado (opcional)
    // userAgent: 'Playwright Test',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Viewport customizado
        viewport: { width: 1280, height: 720 },
      },
    },

    // Descomentar para testar em outros browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Testes mobile (descomentar se necessário)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,

    // Aguardar servidor estar pronto antes de iniciar testes
    // stdout: 'pipe',
    // stderr: 'pipe',
  },
})
