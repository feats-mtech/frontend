import axios, { HttpStatusCode } from 'axios';

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
