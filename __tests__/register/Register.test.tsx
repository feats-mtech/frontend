import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterView } from '../../src/sections/auth/register-view';
import { registerUser } from '../../src/dao/userDao';

// Mock the routing
const mockPush = jest.fn();
jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock userDao
jest.mock('src/dao/userDao', () => ({
  registerUser: jest.fn(),
}));

describe('RegisterView', () => {
  // Helper function to setup all required DOM elements
  const setup = () => {
    const utils = render(<RegisterView />);
    return {
      ...utils,
      usernameInput: screen.getByRole('textbox', { name: /username/i }),
      displayNameInput: screen.getByRole('textbox', { name: /display name/i }),
      emailInput: screen.getByRole('textbox', { name: /email/i }),
      passwordInput: screen.getByLabelText(/^password/i),
      confirmPasswordInput: screen.getByLabelText(/confirm password/i),
      registerButton: screen.getByRole('button', { name: /^register$/i }),
    };
  };

  // Helper function to fill all form fields except the specified one
  const fillFormExcept = async (skipField?: string) => {
    const validData = {
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    if (skipField !== 'username') {
      await userEvent.type(screen.getByRole('textbox', { name: /username/i }), validData.username);
    }
    if (skipField !== 'displayName') {
      await userEvent.type(
        screen.getByRole('textbox', { name: /display name/i }),
        validData.displayName,
      );
    }
    if (skipField !== 'email') {
      await userEvent.type(screen.getByRole('textbox', { name: /email/i }), validData.email);
    }
    if (skipField !== 'password') {
      await userEvent.type(screen.getByLabelText(/^password/i), validData.password);
    }
    if (skipField !== 'confirmPassword') {
      await userEvent.type(screen.getByLabelText(/confirm password/i), validData.confirmPassword);
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    setup();
    expect(screen.getByText(/Create a new User/i)).toBeInTheDocument();
  });

  it('validates required fields', () => {
    const { registerButton } = setup();
    expect(registerButton).toHaveAttribute('disabled');
  });
  it('validates email format', async () => {
    const { emailInput, registerButton } = setup();

    // Fill all fields with valid data
    await fillFormExcept('email');

    // Input invalid email
    await userEvent.type(emailInput, 'invalid-email');

    // Try to register
    await userEvent.click(registerButton);

    // Check for error message
    const helperText = screen.getByText('Please enter a valid email address');
    expect(helperText).toBeInTheDocument();

    // Check error state of the input itself
    const emailInputElement = screen.getByRole('textbox', { name: /email/i });
    expect(emailInputElement).toHaveAttribute('aria-invalid', 'true');
  });

  it('validates password complexity', async () => {
    const { passwordInput, registerButton } = setup();

    // Fill all fields
    await fillFormExcept('password');

    // Input weakpass password
    await userEvent.type(passwordInput, 'weakpass');

    // Try to register
    await userEvent.click(registerButton);

    // Look for helper text by helper-text ID
    await waitFor(() => {
      const errors = screen.getAllByText(/password must include/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('validates password matching', async () => {
    const { passwordInput, confirmPasswordInput, registerButton } = setup();

    // Fill all fields with different passwords
    await fillFormExcept();
    await userEvent.clear(passwordInput);
    await userEvent.clear(confirmPasswordInput);
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmPasswordInput, 'differentpass');

    // Try to register
    await userEvent.click(registerButton);

    // Look for helper text by helper-text ID
    await waitFor(() => {
      screen.debug(); // 🔍 打印 UI 结构，看看 "Passwords do not match" 是否存在
      expect(screen.queryByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const mockRegisterResponse = { success: true };
    (registerUser as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

    const {
      usernameInput,
      displayNameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      registerButton,
    } = setup();

    // Fill in all required fields
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(displayNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmPasswordInput, 'Password123!');

    // Submit the form
    fireEvent.click(registerButton);

    // Verify success message and navigation
    await waitFor(async () => {
      expect(
        await screen.findByText(/Your account has been successfully created!/i),
      ).toBeInTheDocument();
    });
  });

  it('handles registration failure', async () => {
    const mockRegisterResponse = { success: false };
    (registerUser as jest.Mock).mockResolvedValueOnce(mockRegisterResponse);

    const {
      usernameInput,
      displayNameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      registerButton,
    } = setup();

    // Fill in all required fields
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(displayNameInput, 'Test User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmPasswordInput, 'Password123!');

    // Submit the form
    fireEvent.click(registerButton);

    // Verify error message display
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});
