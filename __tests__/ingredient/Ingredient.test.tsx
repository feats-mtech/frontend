import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';

import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';

import { render, screen, waitFor } from '@testing-library/react';
import { InventoryView } from '../../src/sections/inventory/view/inventory-view';
import { mockIngredients } from '../utils/mockIngredients';

describe('InventoryView', () => {
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

  it('renders InventoryView component', async () => {
    render(<InventoryView />);
    await waitFor(() => {
      expect(screen.getByText('Inventory')).toBeInTheDocument();
    });
  });

  it('displays user ingredients in a table', async () => {
    // Mock the getIngredientsByUser function to return mockIngredients
    jest
      .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
      .mockResolvedValue(mockIngredients);

    render(<InventoryView />);

    // display ingredients fetched from API call in table
    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.getByText(/orange/i)).toBeInTheDocument();
      expect(screen.getByText(/papaya/i)).toBeInTheDocument();
    });
  });

  it('filters ingredients by name in search bar', async () => {
    jest
      .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
      .mockResolvedValue(mockIngredients);

    render(<InventoryView />);

    const input = screen.getByPlaceholderText(/Search/i);

    await userEvent.click(input);
    await userEvent.type(input, 'apple');

    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
    });

    await userEvent.type(input, 'mango'); // mango does not exist
    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
      expect(screen.getByText(/No results found for/i)).toBeInTheDocument;
    });
  });
});
