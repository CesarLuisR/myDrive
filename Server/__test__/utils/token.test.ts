import { generateToken, verifyToken, TokenPayload } from '../../src/utils/token';
import jwt from 'jsonwebtoken';

// Mockea el módulo de configuración para un secreto JWT predecible.
jest.mock('../../src/config', () => ({
  jwtSecret: 'super-secret-jwt-key-for-tests',
}));

describe('JWT Utilities', () => {
  const testPayload: TokenPayload = { id: 'test-user-id-123' };
  let generatedToken: string;

  beforeAll(() => {
    generatedToken = generateToken(testPayload);
  });

  // --- Tests para generateToken ---
  describe('generateToken', () => {
    test('should produce a valid JWT string', () => {
      expect(typeof generatedToken).toBe('string');
      expect(generatedToken.split('.').length).toBe(3);
    });

    test('should contain the correct payload', () => {
      const decoded = verifyToken(generatedToken);
      expect(decoded.id).toBe(testPayload.id);
      expect(Object.keys(decoded)).toEqual(expect.arrayContaining(Object.keys(testPayload)));
    });

    test('should have an expiration time (exp)', () => {
      const decodedWithoutVerification = jwt.decode(generatedToken) as jwt.JwtPayload;
      expect(decodedWithoutVerification.exp).toBeDefined();
      expect(typeof decodedWithoutVerification.exp).toBe('number');
      expect(decodedWithoutVerification.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  // --- Tests para verifyToken ---
  describe('verifyToken', () => {
    test('should correctly decode a valid token and return the original payload', () => {
      const decoded = verifyToken(generatedToken);
      expect(decoded.id).toEqual(testPayload.id);
    });

    test('should throw an error for an invalid token (altered signature)', () => {
      const invalidToken = generatedToken + 'malicious-change';
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    test('should throw an error for a malformed token', () => {
      const malformedToken = 'not.a.real.token';
      expect(() => verifyToken(malformedToken)).toThrow();
    });

    test('should throw an error for an expired token', (done) => {
      const expiredToken = jwt.sign(testPayload, 'super-secret-jwt-key-for-tests', { expiresIn: '1ms' });

      setTimeout(() => {
        expect(() => verifyToken(expiredToken)).toThrow();
        done();
      }, 50);
    });
  });
});