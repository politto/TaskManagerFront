import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeAll, beforeEach, describe, it, vi } from "vitest";
import TaskManager from "./TaskManager";
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';

vi.mock('../api/auth');
vi.mock('../api/tasks');

describe('page loading', () => {
    beforeAll(() => {
        window.alert = vi.fn(); // Use Vitest's mock function
      });
      
    beforeEach(async () => {
        cleanup();
    });

    it('should load the Task manager page', async () => {
        render(
            <MemoryRouter initialEntries={['/taskmanager']}>
                <Routes>
                    <Route path="/taskmanager" element={<TaskManager />} />
                </Routes>
            </MemoryRouter>
        );

        // mock token in local storage
        localStorage.setItem('token', 'test-token');

        const taskManagerHeader = screen.getByText('TaskManager'); 

    });
        
        
});
