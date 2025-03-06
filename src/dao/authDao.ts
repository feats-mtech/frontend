import axios, { HttpStatusCode } from 'axios';
import axiosInstance, { checkStatus } from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_AUTHENTICATE_URL ||
  import.meta.env.VITE_BACKEND_AUTHENTICATE_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_AUTHENTICATE_PORT ||
  import.meta.env.VITE_BACKEND_AUTHENTICATE_PORT;

const backendUrl =
  window.RUNTIME_CONFIG?.VITE_BACKEND_HAS_DOMAIN_NAME == 'true'
    ? backendAddress
    : `${backendAddress}:${backendPort}`;

export const login = async (username: string, password: string) => {
  try {
    const resultNonce = await axios
      .get(`${backendUrl}/public/assignNonce`)
      .then((response) => response);

    if (checkStatus(resultNonce.status)) {
      const nonceToken = resultNonce?.data;

      const result = await axios
        .post(
          `${backendUrl}/authenticate/login`,
          {
            name: username,
            password,
          },
          {
            headers: {
              Nonce: nonceToken,
            },
          },
        )
        .then((response) => response);

      localStorage.setItem('jwtToken', result?.data?.jwt);
      return {
        success: result.status === HttpStatusCode.Ok,
        data: result.data.user,
        statusCode: result.status,
      };
    }
    return {
      success: false,
      data: null,
      statusCode: HttpStatusCode.InternalServerError,
    };
  } catch (error) {
    return { success: false, error: error.message, statusCode: error.status };
  }
};
export const loginByGoogle = async () => {
  window.location.href = `${backendUrl}/oauth2/authorization/google`;
};
export const refreshJwt = async () => {
  const result = await axiosInstance.get(`${backendUrl}/authenticate/refreshJwt`, {
    withCredentials: true,
  });
  localStorage.setItem('jwtToken', result?.data?.jwt);
};
export const getLoginUserDetails = async () => {
  try {
    const result = await axios
      .get(`${backendUrl}/authenticate/info`, { withCredentials: true })
      .then((response) => response);

    localStorage.setItem('jwtToken', result?.data?.jwt);
    return {
      success: result.status === HttpStatusCode.Ok,
      data: result.data.user,
      statusCode: result.status,
    };
  } catch (error) {
    return { success: false, error: error.message, statusCode: error.status };
  }
};
export const logoutUser = async () => {
  //for oauth2 logout
  window.location.href = `${backendUrl}/logout`;
};
