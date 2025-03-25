import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import Login from './Login';
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import { wait } from '../utils/wait';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import instanceMockAxios from '../utils/mock';
import * as authModule from '../api/auth';

// Mock the entire auth module
vi.mock('../api/auth');


describe('page loading', () => {
    beforeAll(() => {
        window.alert = vi.fn(); // Use Vitest's mock function
      });
      
    beforeEach(async () => {
        cleanup();
    });

    it('should load the login page', async () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );
        
        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');


        expect(emailInput).toBeDefined();
        expect(passwordInput).toBeDefined();
        expect(loginButton).toBeDefined();

        fireEvent.blur(emailInput);
        fireEvent.blur(passwordInput);

        await wait(100);

        expect(screen.queryByText('email is required')).toBeDefined();
        expect(screen.queryByText('Password is required')).toBeDefined();

        fireEvent.focus(emailInput);
        fireEvent.focus(passwordInput);

    });

    it('should validate email and password properly', async () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );
        
        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');

        fireEvent.change(emailInput, { target: { value: 'te' } });
        fireEvent.change(passwordInput, { target: { value: 'te' } });

        fireEvent.blur(emailInput);
        fireEvent.blur(passwordInput);

        await wait(100);

        expect(screen.queryByText('email should be at least 4 characters')).toBeDefined();
        expect(screen.queryByText('Password should be at least 8 characters')).toBeDefined();

        fireEvent.change(emailInput, { target: { value: 'test3455%' } });

        fireEvent.blur(emailInput);

        await wait(100);
    });

    it('should submit the form', async () => {
        
        vi.mocked(authModule.performLogin).mockResolvedValue({
            statusCode: 200,
            data: { access_token: 'test-token' },
          });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'omaygot@ambatukam.oh' } });
        fireEvent.change(passwordInput, { target: { value: 'ambasing' }});

        fireEvent.click(loginButton);


    });

    it('should alert error message on invalid email or password', async () => {
        
        
        vi.mocked(authModule.performLogin).mockResolvedValue({
            statusCode: 401,
            data: { message: 'Invalid email or password' },
          });
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'test' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' }});

        fireEvent.click(loginButton);

    });

    it('should alert error message on internal server error', async () => {
        vi.mocked(authModule.performLogin).mockResolvedValue({ 
            statusCode: 500,
            data: { },
        });
        vi.mock('../api/auth', () => ({
            performLogin: vi.fn().mockRejectedValue({ response: { data: { message: 'Internal server error' }, status: 500 } }),
          }));
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'omaygot@ambatukam.oh' } });
        fireEvent.change(passwordInput, { target: { value: 'ambasing' }});

        fireEvent.click(loginButton);

    })

});
