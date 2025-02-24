import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { SignInView } from '../../src/sections/auth/sign-in-view';
import { login } from '../../src/dao/authDao';
import { mockUsers, mockCurrentUser } from '../utils/mockUsers';

// Mock authDao
jest.mock('src/dao/authDao', () => ({
  login: jest.fn(),
  loginUserByGoogle: jest.fn(),
  getLoginUserDetails: jest.fn(),
}));

// Mock Iconify component
jest.mock('src/components/iconify', () => ({
  Iconify: () => <div data-testid="mock-icon" />,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignInView', () => {
  // Helper function to setup the component with all required providers
  const setup = () => {
    const utils = render(
      <BrowserRouter>
        <AuthProvider>
          <SignInView />
        </AuthProvider>
      </BrowserRouter>,
    );

    return {
      ...utils,
      usernameInput: screen.getByRole('textbox', { name: /username/i }),
      passwordInput: screen.getByLabelText(/^password/i),
      signInButton: screen.getByRole('button', { name: /sign in/i }),
      getStartedLink: screen.getByText(/get started/i),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { container } = setup();

    // Check heading
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();

    // Find the node that contains the text
    const paragraphElement = container.querySelector('p.MuiTypography-body2');
    const textContent = paragraphElement?.childNodes[0].textContent;
    expect(textContent).toBe('Don’t have an account?');

    // Check links
    expect(screen.getByText('Get started')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();

    // Check form inputs
    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('navigates to register page when clicking Get Started', () => {
    const { getStartedLink } = setup();
    fireEvent.click(getStartedLink);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('handles successful login', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockCurrentUser,
      statusCode: 200,
    });

    const { usernameInput, passwordInput, signInButton } = setup();

    await userEvent.type(usernameInput, mockCurrentUser.name);
    await userEvent.type(passwordInput, 'password123');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(mockCurrentUser.name, 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles failed login', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Invalid credentials',
      statusCode: 401,
    });

    const { usernameInput, passwordInput, signInButton } = setup();

    await userEvent.type(usernameInput, 'wronguser');
    await userEvent.type(passwordInput, 'wrongpassword');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid username\/password/i)).toBeInTheDocument();
    });
  });

  it('handles banned account', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Account banned',
      statusCode: 403,
    });

    const { usernameInput, passwordInput, signInButton } = setup();

    await userEvent.type(usernameInput, mockUsers[3].name);
    await userEvent.type(passwordInput, 'password123');

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/account has been banned/i)).toBeInTheDocument();
    });
  });

  it('handles login with Enter key on username field', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockCurrentUser,
      statusCode: 200,
    });

    const { usernameInput, passwordInput } = setup();

    await userEvent.type(usernameInput, mockCurrentUser.name);
    await userEvent.type(passwordInput, 'password123');
    fireEvent.keyDown(usernameInput, { key: 'Enter' });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(mockCurrentUser.name, 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login with Enter key on password field', async () => {
    (login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockCurrentUser,
      statusCode: 200,
    });

    const { usernameInput, passwordInput } = setup();

    await userEvent.type(usernameInput, mockCurrentUser.name);
    await userEvent.type(passwordInput, 'password123');
    fireEvent.keyDown(passwordInput, { key: 'Enter' });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(mockCurrentUser.name, 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows password when toggle password visibility is clicked', async () => {
    const { passwordInput } = setup();

    // Initially password field should be of type "password"
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the visibility toggle button (the parent IconButton)
    const toggleButton = screen.getByTestId('mock-icon').closest('button');
    fireEvent.click(toggleButton!);

    // Password field should now be of type "text"
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
