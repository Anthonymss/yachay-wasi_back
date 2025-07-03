// test/setup.ts

import 'reflect-metadata';

// Configuración global para los tests
beforeAll(() => {
  // Configuración de TypeORM para tests
  process.env.TYPEORM_CONNECTION = 'sqlite';
  process.env.TYPEORM_DATABASE = ':memory:';
  process.env.TYPEORM_SYNCHRONIZE = 'true';
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Configuración global opcional para Jest
jest.setTimeout(15000); // aumenta el tiempo de espera para pruebas largas

// Si usas matchers extra (opcional):
// import 'jest-extended';
