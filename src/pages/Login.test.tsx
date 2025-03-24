import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from './Login';
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';
import { wait } from '../utils/wait';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';

describe('page loading', () => {
    beforeEach(async () => {
        cleanup();
    });

    it('should load the login page', async () => {
        render(
            <Login />
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
            <Login />
        );
        
        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');

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

        expect(screen.queryByText('email should not contain special characters')).toBeDefined();
    });

    it('should submit the form', async () => {
        render(
            <Login />
        );

        const emailInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'test' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' }});

        fireEvent.click(loginButton);

    });

});
