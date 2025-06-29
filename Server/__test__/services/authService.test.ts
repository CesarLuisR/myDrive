import { registerUser, loginUser } from '../../src/services/authService';
import { pool } from '../../src/database/db';
import { comparePassword, hashPassword } from '../../src/utils/hash';
import * as userQueries from '../../src/models/authModel';
import { generateToken } from '../../src/utils/token';
import validator from 'validator';

// Mock de dependencias
jest.mock('../../src/database/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));
jest.mock('../../src/utils/hash', () => ({
  hashPassword: jest.fn(async (password: string) => `hashed_${password}`),
  comparePassword: jest.fn(async (password: string, hash: string) => `hashed_${password}` === hash),
}));
jest.mock('../../src/utils/token', () => ({
  generateToken: jest.fn((payload: any) => `mocked_jwt_token_for_${payload.id}`),
}));
jest.mock('validator', () => ({
  isEmail: jest.fn(),
}));

const mockPoolQuery = pool.query as jest.Mock;
const mockHashPassword = hashPassword as jest.Mock;
const mockComparePassword = comparePassword as jest.Mock;
const mockGenerateToken = generateToken as jest.Mock;
const mockIsEmail = validator.isEmail as jest.Mock;

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const signUpData = {
      name: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'StrongPassword123!',
    };

    test('should successfully register a new user', async () => {
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 1 });

      await registerUser(signUpData);

      expect(mockHashPassword).toHaveBeenCalledWith(signUpData.password);
      expect(mockPoolQuery).toHaveBeenCalledWith(userQueries.createUser, expect.any(Array));
    });

    test('should throw an error if email is already registered', async () => {
      mockPoolQuery.mockRejectedValueOnce(new Error('duplicate key value violates unique constraint'));

      await expect(registerUser(signUpData)).rejects.toThrow('duplicate key value violates unique constraint');
    });
  });

  describe('loginUser', () => {
    const loginDataEmail = { identifier: 'test@example.com', password: 'LoginPassword123!' };
    const loginDataUsername = { identifier: 'testusername', password: 'LoginPassword123!' };

    const foundUserInDb = {
      uuid: 'user-uuid-123',
      hash_password: 'hashed_LoginPassword123!',
    };

    // ✅ Datos simulados del usuario completo
    const completeUser = {
      uuid: 'user-uuid-123',
      name: 'Test',
      lastname: 'User',
      email: 'test@example.com',
    };

    test('should successfully log in a user by email and return a token', async () => {
      mockIsEmail.mockReturnValueOnce(true);
      mockPoolQuery
        .mockResolvedValueOnce({ rowCount: 1, rows: [foundUserInDb] }) // getUserByEmail
        .mockResolvedValueOnce({ rowCount: 1, rows: [completeUser] }); // getUserById

      mockComparePassword.mockResolvedValueOnce(true);

      const { user, token } = await loginUser(loginDataEmail);

      expect(mockIsEmail).toHaveBeenCalledWith(loginDataEmail.identifier);
      expect(mockPoolQuery).toHaveBeenNthCalledWith(1, userQueries.getUserByEmail, [loginDataEmail.identifier]);
      expect(mockComparePassword).toHaveBeenCalledWith(loginDataEmail.password, foundUserInDb.hash_password);
      expect(mockGenerateToken).toHaveBeenCalledWith({ id: foundUserInDb.uuid });
      expect(token).toBe(`mocked_jwt_token_for_${foundUserInDb.uuid}`);
      expect(user).toEqual(completeUser); // ✅ Verificamos el usuario retornado
    });

    test('should successfully log in a user by username and return a token', async () => {
      mockIsEmail.mockReturnValueOnce(false);
      mockPoolQuery
        .mockResolvedValueOnce({ rowCount: 1, rows: [foundUserInDb] }) // getUserByUsername
        .mockResolvedValueOnce({ rowCount: 1, rows: [completeUser] }); // getUserById

      mockComparePassword.mockResolvedValueOnce(true);

      const { user, token } = await loginUser(loginDataUsername);

      expect(mockIsEmail).toHaveBeenCalledWith(loginDataUsername.identifier);
      expect(mockPoolQuery).toHaveBeenNthCalledWith(1, userQueries.getUserByUsername, [loginDataUsername.identifier]);
      expect(mockPoolQuery).toHaveBeenNthCalledWith(2, userQueries.getUserById, [foundUserInDb.uuid]);
      expect(token).toBe(`mocked_jwt_token_for_${foundUserInDb.uuid}`);
      expect(user).toEqual(completeUser); // ✅ Verificamos el usuario retornado
    });

    test('should throw "Invalid credentials" if user is not found', async () => {
      mockIsEmail.mockReturnValueOnce(true);
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      await expect(loginUser(loginDataEmail)).rejects.toThrow('Invalid credentials');
      expect(mockComparePassword).not.toHaveBeenCalled();
    });

    test('should throw "Invalid credentials" if password is incorrect', async () => {
      mockIsEmail.mockReturnValueOnce(true);
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 1, rows: [foundUserInDb] });
      mockComparePassword.mockResolvedValueOnce(false);

      await expect(loginUser(loginDataEmail)).rejects.toThrow('Invalid credentials');
      expect(mockGenerateToken).not.toHaveBeenCalled();
    });

    test('should throw "Server error" if user data retrieval fails', async () => {
      mockIsEmail.mockReturnValueOnce(true);
      mockPoolQuery
        .mockResolvedValueOnce({ rowCount: 1, rows: [foundUserInDb] }) // first query ok
        .mockResolvedValueOnce({ rowCount: 0, rows: [] }); // second query fail

      mockComparePassword.mockResolvedValueOnce(true);

      await expect(loginUser(loginDataEmail)).rejects.toThrow('Server error');
    });
  });
});