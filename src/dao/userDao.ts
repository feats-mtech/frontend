import axios, { HttpStatusCode } from 'axios';
import { UserFormDetails } from 'src/types/User';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const login = async (username: string, password: string) => {
  try {
    const result = await axios
      .post(`${backendUrl}/user/login`, {
        name: username,
        password,
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok, data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (userFormDetails: UserFormDetails) => {
  try {
    const { username, password, displayName, email } = userFormDetails;
    const result = await axios
      .post(`${backendUrl}/user/add`, {
        name: username,
        password,
        displayName,
        email,
        status: 2, // active
        role: 2, // user
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok, data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
