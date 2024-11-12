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
      password: 'password123',
      confirmPassword: 'password123',
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

  it('validates password length', async () => {
    const { passwordInput, registerButton } = setup();

    // Fill all fields
    await fillFormExcept('password');

    // Input short password
    await userEvent.type(passwordInput, 'short');

    // Try to register
    await userEvent.click(registerButton);

    // Look for helper text by helper-text ID
    await waitFor(() => {
      const helperTexts = screen.getAllByText('Password must be at least 7 characters long');
      expect(helperTexts[0]).toBeInTheDocument();
    });
  });

  it('validates password matching', async () => {
    const { passwordInput, confirmPasswordInput, registerButton } = setup();

    // Fill all fields with different passwords
    await fillFormExcept();
    await userEvent.clear(passwordInput);
    await userEvent.clear(confirmPasswordInput);
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'differentpass');

    // Try to register
    await userEvent.click(registerButton);

    // Look for helper text by helper-text ID
    await waitFor(() => {
      const helperTexts = screen.getAllByText('Passwords do not match');
      expect(helperTexts[0]).toBeInTheDocument();
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
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');

    // Submit the form
    fireEvent.click(registerButton);

    // Verify success message and navigation
    await waitFor(() => {
      expect(screen.getByText(/Your account has been successfully created!/i)).toBeInTheDocument();
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
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');

    // Submit the form
    fireEvent.click(registerButton);

    // Verify error message display
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });
});
