import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';

import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';

import { render, screen, waitFor } from '@testing-library/react';
import { OverviewView } from '../../src/sections/overview/view/overview-view';
import { mockIngredients } from '../utils/mockIngredients';
import { ThemeProvider } from '../../src/theme/theme-provider';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Expiring Ingredients (Home page)', () => {
  // mock contexts and router
  beforeAll(() => {
    jest.spyOn(useAuth, 'useAuth').mockImplementation(() => ({
      isAuthenticated: true,
      user: {
        id: 1,
        name: 'testuser',
        displayName: 'Test User',
        email: 'test@email.com',
        status: 1,
        role: 1,
      },
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
    }));
    jest.spyOn(useRouter, 'useRouter').mockImplementation(() => ({
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    }));
  });

  it('renders OverviewView component', async () => {
    render(
      <ThemeProvider>
        <OverviewView />
      </ThemeProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText('Expiring Ingredients')).toBeInTheDocument();
    });
  });

  it('displays ingredients on the overview page', async () => {
    // Mock the getIngredientsByUser function to return mockIngredients
    jest
      .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
      .mockResolvedValue(mockIngredients);

    render(
      <ThemeProvider>
        <OverviewView />
      </ThemeProvider>,
    );

    // display ingredients fetched from API call in table
    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.getByText(/orange/i)).toBeInTheDocument();
      expect(screen.getByText(/papaya/i)).toBeInTheDocument();
    });
  });

  it('filters expiring ingredients by expiry in dropdown filter', async () => {
    jest
      .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
      .mockResolvedValue(mockIngredients);

    render(
      <ThemeProvider>
        <OverviewView />
      </ThemeProvider>,
    );

    // select 1 year expiry from dropdown
    const filterByExpiry = screen.getByRole('combobox', { name: /filter by expiry/i });
    await userEvent.selectOptions(filterByExpiry, '1 Year');

    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).toBeInTheDocument();
    });

    // select 1 month expiry from dropdown
    await userEvent.selectOptions(filterByExpiry, '1 Month');

    await waitFor(() => {
      expect(screen.queryByText(/apple/i)).toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
    });

    // select 3 days expiry from dropdown
    await userEvent.selectOptions(filterByExpiry, '3 Days');

    await waitFor(() => {
      expect(screen.queryByText(/apple/i)).toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
    });

    // select 1 day expiry from dropdown
    await userEvent.selectOptions(filterByExpiry, '1 Day');

    await waitFor(() => {
      expect(screen.queryByText('no records found')).toBeInTheDocument();
      expect(screen.queryByText(/apple/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
    });
  });
});
