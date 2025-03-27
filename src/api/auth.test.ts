import { beforeEach, describe, expect, it, vi } from 'vitest';
import { performLogin, getUserDataFromToken } from './auth';
import axiosInstance from '../utils/axios';
import { waitFor } from '@testing-library/react';

// Mock axios instance
vi.mock('../utils/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('performLogin', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const mockResponse = {
        data: { token: 'mock-token' },
        status: 200
      };
      vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse);

      // Act
      const result = await performLogin('test@example.com', 'password123');

      // Assert
      expect(result).toEqual({
        data: { token: 'mock-token' },
        statusCode: 200
      });
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/signin', {
        email: 'test@example.com',
        password: 'password123'
      });

      waitFor(() => {
        //expect returned token to be stored in local storage
        expect(localStorage.getItem('token')).toBe('mock-token');
        });
    });

    it('should handle login failure', async () => {
      // Arrange
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
          status: 401
        }
      };
      vi.mocked(axiosInstance.post).mockRejectedValue(mockError);

      // Act
      const result = await performLogin('wrong@example.com', 'wrongpass');

      // Assert
      expect(result).toEqual({
        data: { message: 'Invalid credentials' },
        statusCode: 401
      });
    });
  });

  describe('getUserDataFromToken', () => {
    it('should successfully get user data with valid token', async () => {
      // Arrange
      localStorage.setItem('token', 'mock-token');
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      const mockResponse = {
        data: mockUser,
        status: 200
      };
      vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

      // Act
      const result = await getUserDataFromToken();

      // Assert
      expect(result).toEqual({
        data: mockUser,
        statusCode: 200
      });
      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/verifyToken', {
        headers: {
          Authorization: 'Bearer mock-token'
        }
      });
    });

    it('should throw error when token verification fails', async () => {
      // Arrange
      localStorage.setItem('token', 'invalid-token');
      const mockError = new Error('Token verification failed');
      vi.mocked(axiosInstance.get).mockRejectedValue(mockError);

      // Act & Assert
      await expect(getUserDataFromToken()).rejects.toThrow('Token verification failed');
    });
  });
});