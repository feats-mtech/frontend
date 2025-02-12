import axios, { HttpStatusCode } from 'axios';

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
    const result = await axios
      .post(`${backendUrl}/authenticate/login`, {
        name: username,
        password,
      })
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
export const getLoginUserDetails = async () => {
  try {
    const result = await axios
      .get(`${backendUrl}/authenticate/info`, { withCredentials: true })
      .then((response) => response);

    console.log('result for login user :', result);
    console.log('result for login user data:', result.data);
    console.log('result for login user data.name:', result.data.name);
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
export const loginByGoogle = async () => {
  window.location.href = `${backendUrl}/oauth2/authorization/google`;
  // try {
  //   const result = await axios
  //     .get(`${backendUrl}/oauth2/authorization/google`, {
  //       withCredentials: true,
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((response) => response);
  //   localStorage.setItem('jwtToken', result?.data?.jwt);
  //   return {
  //     success: result.status === HttpStatusCode.Ok,
  //     data: result.data.user,
  //     statusCode: result.status,
  //   };
  // } catch (error) {
  //   return { success: false, error: error.message, statusCode: error.status };
  // }
};
