import { ReactNode, createContext, useState, useContext } from 'react';
import { login } from 'src/dao/userDao';
import { User } from 'src/types/User';

type loginResult =
  | { success: boolean; data: any; error?: undefined }
  | { success: boolean; error: any; data?: undefined };

interface UserContextProps {
  user: User | null;
  loginUser: (username: string, password: string) => Promise<loginResult>;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

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
    }
    return result;
  };

  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
