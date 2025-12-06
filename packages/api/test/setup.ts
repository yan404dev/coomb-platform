/**
 * Configuração global para testes
 * Este arquivo é executado antes de cada teste
 */

// Configurar timezone para testes
process.env.TZ = "UTC";

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(10000);
