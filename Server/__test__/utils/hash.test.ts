import { hashPassword, comparePassword } from '../../src/utils/hash';

describe('Bcrypt Hashing Utilities', () => {
  const testPassword = 'MySecretPassword123!';
  let hashedPassword: string;

  beforeAll(async () => {
    hashedPassword = await hashPassword(testPassword);
  });

  // Test 1: Verificar que hashPassword devuelve un hash válido
  test('should return a non-empty hash different from the original password', () => {
    expect(hashedPassword).toBeDefined(); // Que el hash no sea undefined
    expect(hashedPassword).not.toBeNull(); // Que el hash no sea null
    expect(hashedPassword).not.toBe(''); // Que el hash no sea una cadena vacía
    expect(hashedPassword).not.toBe(testPassword); // Que el hash sea diferente de la contraseña original
    expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
  });

  // Test 2: Verificar que se generan hashes diferentes para la misma contraseña
  test('should generate different hashes for the same password due to salting', async () => {
    const anotherHashedPassword = await hashPassword(testPassword);
    expect(anotherHashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(anotherHashedPassword); // ¡Esta es la clave del salting!
  });

  // Test 3: Verificar que comparePassword funciona correctamente para una contraseña correcta
  test('should correctly verify a plain password against its hash', async () => {
    const isMatch = await comparePassword(testPassword, hashedPassword);
    expect(isMatch).toBe(true); 
  });

  // Test 4: Verificar que comparePassword falla para una contraseña incorrecta
  test('should fail to verify an incorrect password against its hash', async () => {
    const isMatch = await comparePassword('wrongPassword123!', hashedPassword);
    expect(isMatch).toBe(false); 
  });

  // Test 5: Manejo de hash inválido o malformado en comparePassword
  test('should handle invalid or malformed hash gracefully in comparePassword', async () => {
    const isMatch = await comparePassword(testPassword, 'notAValidHash');
    expect(isMatch).toBe(false); 
  });
});