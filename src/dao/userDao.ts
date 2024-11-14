import { HttpStatusCode } from 'axios';

import { UserFormDetails } from 'src/types/User';

import axiosInstance from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_USER_URL || import.meta.env.VITE_BACKEND_USER_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_USER_PORT || import.meta.env.VITE_BACKEND_USER_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

export const registerUser = async (userFormDetails: UserFormDetails) => {
  try {
    const { username, password, displayName, email } = userFormDetails;
    const result = await axiosInstance
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

export const getAllUsers = async () => {
  try {
    const result = await axiosInstance
      .get(`${backendUrl}/user/getAll`)
      .then((response) => response);
    return result.status ? result.data : [];
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const banUser = async (userId: number) => {
  try {
    const result = await axiosInstance
      .put(`${backendUrl}/user/${userId}/ban`)
      .then((response) => response);
    return result.status ? result.data : [];
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const unbanUser = async (userId: number) => {
  try {
    const result = await axiosInstance
      .put(`${backendUrl}/user/${userId}/unban`)
      .then((response) => response);
    return result.status ? result.data : [];
  } catch (error) {
    return { success: false, error: error.message };
  }
};
