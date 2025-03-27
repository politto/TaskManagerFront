import { beforeEach, describe, expect, it, vi } from 'vitest';
import { performLogin, getUserDataFromToken } from './auth';
import axiosInstance from '../utils/axios';
import { waitFor } from '@testing-library/react';
import { createTask, deleteTask, getAllUserTasks, updateTask } from './tasksApi';
import { wait } from '../utils/wait';

// Mock axios instance
vi.mock('../utils/axios', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn()
    }
    }));

describe('Tasks API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
      });

    it('should retrieve all user tasks', async () => {
        // Arrange
        const mockResponse = {
            data: [
                { id: '1', title: 'Task 1', description: 'Description 1', status: 'completed', userId: '1' },
                { id: '2', title: 'Task 2', description: 'Description 2', status: 'in_progress', userId: '1' }
            ],
            status: 200
        };
        vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

        // Act
        const result = await getAllUserTasks();

        // Assert
        expect(result).toEqual(
           [
            { id: '1', title: 'Task 1', description: 'Description 1', status: 'completed', userId: '1' },
            { id: '2', title: 'Task 2', description: 'Description 2', status: 'in_progress', userId: '1' }
            ]
        );
        expect(axiosInstance.get).toHaveBeenCalledWith('/tasks', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    });

    

    it('should create a new task', async () => {
        // Arrange
        const mockResponse = {
                id: '3', 
                title: 'Task 3', 
                description: 'Description 3', 
                status: 'completed' 
            }
        
        vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse);
    
        // Act
        const result = await createTask('Task 3', 'Description 3', '1', 'completed');
        await wait(1000);
        
        
        waitFor(() => {
            // Assert
            expect(result).toEqual({
                id: '3', 
                title: 'Task 3', 
                description: 'Description 3', 
                status: 'completed',
                userId: '1'
            });
            expect(axiosInstance.post).toHaveBeenCalledWith('/tasks', {
                title: 'Task 3',
                description: 'Description 3',
                status: 'completed',
                userId: '1'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        })
    });


    it('should update a task', async () => {
        // Arrange
        const mockResponse = [1];
        vi.mocked(axiosInstance.patch).mockResolvedValue(mockResponse);

        // Act
        const result = await updateTask('2', 'Task 2', 'Description 2', '1', 'in_progress');
        await wait(1000);

        waitFor(() => {
            // Assert
            expect(result).toEqual([1]);
            expect(axiosInstance.patch).toHaveBeenCalledWith('/tasks/3', {
                id: '3',
                title: 'Task 3',
                description: 'Description 3',
                status: 'completed',
                userId: '1'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        })
    });


    it('should delete a task', async () => {
        // Arrange
        const mockResponse = {
            data: '', // Empty string response
            status: 200
        };
        vi.mocked(axiosInstance.delete).mockResolvedValue(mockResponse);
    
        // Act
        const result = await deleteTask('3');
    
        // Assert
        expect(result).toEqual('');
    

        expect(axiosInstance.delete).toHaveBeenCalledWith('/tasks/3', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    });

});