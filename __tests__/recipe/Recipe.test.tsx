import '@testing-library/jest-dom';
import React from 'react';

import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyRecipesView } from '../../src/sections/recipes/view/my-recipes-view';
import { mockRecipes } from '../utils/mockRecipes';
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

describe('RecipeView', () => {
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

  it('renders MyRecipesView component', async () => {
    render(<MyRecipesView />);
    await waitFor(() => {
      expect(screen.getByText('My Recipes')).toBeInTheDocument();
    });
  });

  it('displays recipes belonging to user', async () => {
    // Mock the getAllRecipeByCreatorId function to return mockRecipes
    jest
      .spyOn(require('../../src/dao/recipeDao'), 'getAllRecipeByCreatorId')
      .mockResolvedValue(mockRecipes);

    render(
      <ThemeProvider>
        <MyRecipesView />
      </ThemeProvider>,
    );

    // display recipes fetched from API call
    await waitFor(() => {
      const applePie = screen.getAllByText(/apple pie/i)[0];
      expect(applePie).toBeInTheDocument();

      const bananaCake = screen.getAllByText(/banana cake/i)[0];
      expect(bananaCake).toBeInTheDocument();

      const carrotCake = screen.getAllByText(/carrot cake/i)[0];
      expect(carrotCake).toBeInTheDocument();
    });
  });

  it('should filter recipes based on the chosen filters', async () => {
    render(
      <ThemeProvider>
        <MyRecipesView />
      </ThemeProvider>,
    );

    // click on filter button
    const filterButton = screen.getByRole('button', { name: /filters/i });
    await userEvent.click(filterButton);

    await waitFor(() => {
      // expect to see filter options
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText(/Rating/i)).toBeInTheDocument();
      expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
      expect(screen.getByText(/Cooking Time/i)).toBeInTheDocument();

      // select 'Western' checkbox
      const westernCheckbox = screen.getByRole('checkbox', { name: /western/i });
      userEvent.click(westernCheckbox);

      // expect to see only Western recipes displayed
      expect(screen.queryByText(/carrot cake/i)).not.toBeInTheDocument();
      const applePie = screen.getAllByText(/apple pie/i)[0];
      expect(applePie).toBeInTheDocument();
      const bananaCake = screen.getAllByText(/banana cake/i)[0];
      expect(bananaCake).toBeInTheDocument();
    });
  });
});
