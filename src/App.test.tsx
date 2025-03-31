import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import { fireEvent, render, screen, cleanup } from '@testing-library/react';

describe('page loading', () => {
    beforeEach(async () => {
        cleanup();
    });

    it('should load the App', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
            <App/>
            </MemoryRouter>
        );

        const welcomeText = screen.getByText('Welcome to the App');
        const goToLoginButton = screen.getByText('Login');
        const goToRegisterButton = screen.getByText('Register');

        expect(welcomeText).toBeDefined();
        expect(goToLoginButton).toBeDefined();
        expect(goToRegisterButton).toBeDefined();


    });

    it('should go to login page', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
            <App/>
            </MemoryRouter>
        );

            const goToLoginButton = screen.getByText('Login');

            fireEvent.click(goToLoginButton);



    });
});