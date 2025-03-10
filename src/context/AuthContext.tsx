import { ReactNode, createContext, useState, useContext } from 'react';
import {
  login,
  loginByGoogle,
  getLoginUserDetails as getUserDetails,
  logoutUser,
  refreshJwt,
} from 'src/dao/authDao';

import { User } from 'src/types/User';

type loginResult =
  | { success: boolean; data: any; statusCode: number; error?: undefined }
  | { success: boolean; error: any; statusCode: number; data?: undefined };

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loginUser: (username: string, password: string) => Promise<loginResult>;
  getLoginUserDetails: () => Promise<loginResult>;
  loginUserByGoogle: () => void;
  logoutUser: () => void;
  refreshJwt: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const getLoginUserDetails = async (): Promise<loginResult> => {
    const result = await getUserDetails();
    if (result?.success) {
      const user: User = {
        name: result.data.name,
        id: result.data.id,
        displayName: result.data.displayName,
        email: result.data.email,
        status: result.data.status,
        role: result.data.role,
      };
      setUser(user);
      localStorage.setItem('userId', user?.id.toString());
    }
    return result;
  };

  const loginUser = async (username: string, password: string): Promise<loginResult> => {
    const result = await login(username, password);
    if (result.success) {
      const user: User = {
        name: result.data.name,
        id: result.data.id,
        displayName: result.data.displayName,
        email: result.data.email,
        status: result.data.status,
        role: result.data.role,
      };
      setUser(user);
      localStorage.setItem('userId', user?.id.toString());
    }
    return result;
  };

  const loginUserByGoogle = async () => {
    loginByGoogle();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginUser,
        loginUserByGoogle,
        getLoginUserDetails,
        logoutUser,
        refreshJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
