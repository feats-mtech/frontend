import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/react';  
import * as useAuth from '../../src/context/AuthContext';
import * as useRouter from '../../src/routes/hooks/use-router';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { InventoryView } from '../../src/sections/inventory/view/inventory-view';
import { InventoryCreateView } from '../../src/sections/inventory-create/view/inventory-create-view';
import { mockIngredients } from '../utils/mockIngredients';
import * as ingredientDao from '../../src/dao/ingredientDao';
import { ThemeProvider } from '../../src/theme/theme-provider';
import { MemoryRouter } from 'react-router-dom';


// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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
  const renderComponent = async () => {
    // Mock the fetch call before rendering
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockIngredients }),
      } as Response)
    );

    const result = render(
      <MemoryRouter>  
      <ThemeProvider>
        <InventoryView />
      </ThemeProvider>
    </MemoryRouter>
    );

    // Wait for the table to be rendered
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    return result;
  };
  beforeEach(() => {
    jest.clearAllMocks();
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

  // it('filters ingredients by name in search bar', async () => {
  //   jest
  //     .spyOn(require('../../src/dao/ingredientDao'), 'getIngredientsByUser')
  //     .mockResolvedValue(mockIngredients);

  //   render(<InventoryView />);

  //   const input = screen.getByPlaceholderText(/Search/i);

  //   await userEvent.click(input);
  //   await userEvent.type(input, 'apple');

  //   await waitFor(() => {
  //     expect(screen.getByText(/apple/i)).toBeInTheDocument();
  //     expect(screen.queryByText(/orange/i)).not.toBeInTheDocument();
  //     expect(screen.queryByText(/papaya/i)).not.toBeInTheDocument();
  //   });

  //   await userEvent.type(input, 'mango'); // mango does not exist
  //   await waitFor(() => {
  //     expect(screen.getByText('Not found')).toBeInTheDocument();
  //     expect(screen.getByText(/No results found for/i)).toBeInTheDocument;
  //   });
  // });

 

  // Create - 创建操作测试
  describe('Create Operations', () => {
    it('should create new ingredient successfully', async () => {

      const mockCreateIngredient = jest.fn().mockResolvedValue({
        success: true,
        data: {
          id: 1,
          ...mockIngredients[0]
        }
      });
      jest.spyOn(ingredientDao, 'createIngredient').mockImplementation(mockCreateIngredient);
      
      render(
        <MemoryRouter>  
        <ThemeProvider>
          <InventoryCreateView />
        </ThemeProvider>
      </MemoryRouter>
      );
      
          
    const nameInput = screen.getByRole('textbox', { name: /item name/i });
    fireEvent.change(nameInput, {
      target: { value: mockIngredients[0].name },
    });

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    fireEvent.change(quantityInput, {
      target: { value: mockIngredients[0].quantity },
    });

    const unitSelect = screen.getByRole('combobox', { name: /unit of measurement/i });
    fireEvent.mouseDown(unitSelect);
    fireEvent.click(screen.getByText(mockIngredients[0].uom));

    const dateInput = screen.getByLabelText(/expiry date/i);
    fireEvent.change(dateInput, {
      target: { value: mockIngredients[0].expiryDate },
    });

    const submitButton = screen.getByRole('button', { name: /add ingredient/i });
    fireEvent.click(submitButton);

    });

  });


  // Update - 更新操作测试
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

      // Wait for the ingredients to load
      await waitFor(() => {
        expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
      });

      // 点击更多选项按钮
      const moreOptionsButton = screen.getByTestId('more-options-button-1');
      fireEvent.click(moreOptionsButton);

      // 点击编辑按钮
      const editButton = screen.getByTestId('edit-button-1');
      fireEvent.click(editButton);

      // 验证对话框打开
      expect(screen.getByTestId('edit-ingredient-dialog')).toBeInTheDocument();

      // 更新表单字段
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

      // 点击保存
      const saveButton = screen.getByTestId('save-edit-button');
      await act(async () => {
        fireEvent.click(saveButton);
      });

      // 验证更新调用
      expect(mockUpdateIngredient).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Updated Ingredient',
          quantity: '11',
          uom: 'pieces',
          expiryDate: '2024-12-31',
        }),
        1
      );
    });

      // Verify success message appears
      // await waitFor(() => {
      // expect(setIsSuccess).toHaveBeenCalledWith(true);
      // expect(fetchIngredientsForUser).toHaveBeenCalled();
      // });
 
  });


  // delete
  describe('Delete Operations', () => {
    it('should delete ingredient successfully', async () => {
      // Mock delete API call
      const mockDeleteIngredient = jest.fn().mockResolvedValue({
        success: true
      });
      
      jest.spyOn(ingredientDao, 'deleteIngredient').mockImplementation(mockDeleteIngredient);

      // Mock the getIngredientsByUser function to return mockIngredients
      jest.spyOn(ingredientDao, 'getIngredientsByUser').mockResolvedValue(mockIngredients);

      const setIsSuccessMock = jest.fn();
      const setIsErrorMock = jest.fn();

      // Render component
      render(
        <MemoryRouter>
          <ThemeProvider>
            <InventoryView                 />
          </ThemeProvider>
        </MemoryRouter>
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
        expect(screen.getByText(/ingredient deleted successfully/i)).toBeInTheDocument(); // 检查成功消息
      });
    });
  });
 
});
