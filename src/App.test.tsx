import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";
import Login from "./pages/Login";
import { fireEvent, render, screen, cleanup, waitFor } from '@testing-library/react';

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

        expect(welcomeText).toBeDefined();
        expect(goToLoginButton).toBeDefined();


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