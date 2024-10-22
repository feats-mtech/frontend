import axios, { HttpStatusCode } from 'axios';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_AUTHENTICATE_URL ||
  import.meta.env.VITE_BACKEND_AUTHENTICATE_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_AUTHENTICATE_PORT ||
  import.meta.env.VITE_BACKEND_AUTHENTICATE_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

export const login = async (username: string, password: string) => {
  console.log('calling' + backendUrl);
  try {
    const result = await axios
      .post(`${backendUrl}/authenticate/login`, {
        name: username,
        password,
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok, data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
