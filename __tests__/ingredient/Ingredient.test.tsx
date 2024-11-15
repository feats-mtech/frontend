import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { within, render, screen, waitFor, fireEvent, act } from '@testing-library/react';

import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';
import { InventoryView } from '../../src/sections/inventory/view/inventory-view';
import { InventoryCreateView } from '../../src/sections/inventory-create/view/inventory-create-view';
import { mockIngredients } from '../utils/mockIngredients';
import * as ingredientDao from '../../src/dao/ingredientDao';
import { ThemeProvider } from '../../src/theme/theme-provider';

// window.matchMedia
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

describe('InventoryView', () => {
  // mock contexts and router
  beforeAll(() => {
    jest.clearAllMocks();
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

    // Mock API calls
    jest.spyOn(ingredientDao, 'getIngredientsByUser').mockResolvedValue(mockIngredients);
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

  it('should handle pagination correctly', async () => {
    jest.spyOn(ingredientDao, 'getIngredientsByUser').mockResolvedValue(mockIngredients);

    render(
      <MemoryRouter>
        <ThemeProvider>
          <InventoryView />
        </ThemeProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
    });

    // Change rows per page to 5
    const rowsPerPageSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(rowsPerPageSelect);
    const option = within(screen.getByRole('listbox')).getByText('5');
    fireEvent.click(option);

    // Verify only first page items are visible
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
    expect(screen.getByText(/orange/i)).toBeInTheDocument();
    expect(screen.getByText(/papaya/i)).toBeInTheDocument();
    expect(screen.getByText(/bean/i)).toBeInTheDocument();
    expect(screen.getByText(/bread/i)).toBeInTheDocument();
    expect(screen.queryByText(/milk/i)).not.toBeInTheDocument();

    // Go to next page
    const nextPageButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextPageButton);

    // Verify second page items
    await waitFor(() => {
      expect(screen.queryByText(/apple/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/bean/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/bread/i)).not.toBeInTheDocument();
      expect(screen.getByText(/milk/i)).toBeInTheDocument();
    });
  });

  it('should sort ingredients when clicking column headers', async () => {
    jest
      .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
      .mockResolvedValue(mockIngredients);
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ThemeProvider>
          <InventoryView />
        </ThemeProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
    });

    const rowsPerPageSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(rowsPerPageSelect);
    const option = within(screen.getByRole('listbox')).getByText('10');
    fireEvent.click(option);

    const tableHeader = screen.getByRole('columnheader', { name: /expiry date/i });
    // set expiry date depending on index, so choose column expiry date
    const sortLabel = within(tableHeader).getByRole('button', {
      name: /expiry date/i,
    });

    // click first time
    await user.click(sortLabel);

    await waitFor(() => {
      const rows = screen.getAllByTestId('ingredient-row');
      expect(rows[0]).toHaveTextContent(mockIngredients[0].name);
      expect(rows[rows.length - 1]).toHaveTextContent(
        mockIngredients[mockIngredients.length - 1].name,
      );
    });

    await user.click(sortLabel);

    await waitFor(() => {
      const rows = screen.getAllByTestId('ingredient-row');
      expect(rows[0]).toHaveTextContent(mockIngredients[mockIngredients.length - 1].name);
      expect(rows[rows.length - 1]).toHaveTextContent(mockIngredients[0].name);
    });
  });

  describe('Create Operations', () => {
    it('should create new ingredient successfully', async () => {
      const mockCreateIngredient = jest.fn().mockResolvedValue({
        success: true,
        data: {
          id: 1,
          ...mockIngredients[0],
        },
      });
      jest.spyOn(ingredientDao, 'createIngredient').mockImplementation(mockCreateIngredient);

      render(
        <MemoryRouter>
          <ThemeProvider>
            <InventoryCreateView />
          </ThemeProvider>
        </MemoryRouter>,
      );

      // check if form can submit
      const submitButton = screen.getByRole('button', {
        name: /add ingredient/i,
      }) as HTMLButtonElement;

      const nameInput = screen.getByLabelText(/item name/i);
      fireEvent.change(nameInput, {
        target: { value: mockIngredients[0].name },
      });
      expect(nameInput).toHaveValue(mockIngredients[0].name);

      const quantityInput = screen.getByLabelText(/quantity/i);
      fireEvent.change(quantityInput, {
        target: { value: mockIngredients[0].quantity },
      });
      expect(quantityInput).toHaveValue(mockIngredients[0].quantity);

      const unitSelect = screen.getByLabelText(/unit of measurement/i);
      fireEvent.mouseDown(unitSelect);
      const option = within(screen.getByRole('listbox')).getByText(mockIngredients[0].uom);
      fireEvent.click(option);
      expect(unitSelect).toHaveTextContent(mockIngredients[0].uom);

      const dateInput = screen.getByLabelText(/expiry date/i) as HTMLInputElement;

      // form need format 'YYYY-MM-DD', but original type ISO.
      const formattedDate = mockIngredients[0].expiryDate.split('T')[0];
      fireEvent.change(dateInput, {
        target: { value: formattedDate },
      });

      expect(dateInput).toHaveValue(formattedDate);

      fireEvent.click(submitButton);

      // check if Dialog box can display
      const confirmDialog = await screen.findByTestId('confirm-dialog');
      expect(confirmDialog).toBeInTheDocument();

      // check if api called correctly
      const confirmButton = screen.getByTestId('confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/ingredient added successfully/i);
      });

      expect(mockCreateIngredient).toHaveBeenCalledWith(
        {
          name: mockIngredients[0].name,
          quantity: mockIngredients[0].quantity,
          uom: mockIngredients[0].uom,
          expiryDate: formattedDate, // need YYYY-MM-DD
        },
        1,
      );
    });
  });

  describe('Update Operations', () => {
    it('should update ingredient successfully', async () => {
      const mockUpdateIngredient = jest.fn().mockResolvedValue({
        success: true,
      });

      jest.spyOn(ingredientDao, 'updateIngredient').mockImplementation(mockUpdateIngredient);

      (mockUpdateIngredient as jest.Mock).mockResolvedValue({ success: true });

      await act(async () => {
        render(<InventoryView />);
      });

      await waitFor(() => {
        expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
      });

      const moreOptionsButton = screen.getByTestId('more-options-button-1');
      fireEvent.click(moreOptionsButton);

      const editButton = screen.getByTestId('edit-button-1');
      fireEvent.click(editButton);

      expect(screen.getByTestId('edit-ingredient-dialog')).toBeInTheDocument();

      const nameInput = screen.getByTestId('edit-ingredient-name-input');
      const quantityInput = screen.getByTestId('edit-ingredient-quantity-input');
      const uomSelect = screen.getByTestId('edit-ingredient-uom-select');
      const expiryDateInput = screen.getByTestId('edit-ingredient-expiry-date-input');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'Updated Ingredient' } });
        fireEvent.change(quantityInput, { target: { value: '11' } });
        fireEvent.change(uomSelect, { target: { value: 'pieces' } });
        fireEvent.change(expiryDateInput, { target: { value: '2024-12-31' } });
      });

      const saveButton = screen.getByTestId('save-edit-button');
      await act(async () => {
        fireEvent.click(saveButton);
      });

      expect(mockUpdateIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Updated Ingredient',
          quantity: '11',
          uom: 'pieces',
          expiryDate: '2024-12-31',
        }),
        1,
      );
    });
  });

  describe('Delete Operations', () => {
    it('should delete ingredient successfully', async () => {
      // Mock delete API call
      const mockDeleteIngredient = jest.fn().mockResolvedValue({
        success: true,
      });

      jest.spyOn(ingredientDao, 'deleteIngredient').mockImplementation(mockDeleteIngredient);

      // Mock the getIngredientsByUser function to return mockIngredients
      jest.spyOn(ingredientDao, 'getIngredientsByUser').mockResolvedValue(mockIngredients);

      // Render component
      render(
        <MemoryRouter>
          <ThemeProvider>
            <InventoryView />
          </ThemeProvider>
        </MemoryRouter>,
      );

      // Wait for initial data load
      await waitFor(() => {
        expect(screen.getByText(/apple/i)).toBeInTheDocument();
      });
      const row = screen.getByText(/apple/i).closest('tr');
      const moreButton = within(row!).getByTestId('more-options-button-1');
      fireEvent.click(moreButton);

      // Now the menu items should be visible
      await waitFor(() => {
        const deleteButton = screen.getByText(/delete/i);
        fireEvent.click(deleteButton);
      });

      // Confirm the deletion in the dialog
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      // Verify delete was called with the correct ingredient ID
      expect(mockDeleteIngredient).toHaveBeenCalledWith(mockIngredients[0].id);

      // Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/ingredient deleted successfully/i)).toBeInTheDocument();
      });
    });
  });
});
