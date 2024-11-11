import React from 'react';
import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';

import { render, screen, waitFor } from '@testing-library/react';
import { InventoryView } from '../../src/sections/inventory/view/inventory-view';
import '@testing-library/jest-dom';

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
});
