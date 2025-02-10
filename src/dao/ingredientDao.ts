import { HttpStatusCode } from 'axios';

import { Ingredient } from 'src/types/Ingredient';
import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';

import axiosInstance from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_INGREDIENT_URL || import.meta.env.VITE_BACKEND_INGREDIENT_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_INGREDIENT_PORT ||
  import.meta.env.VITE_BACKEND_INGREDIENT_PORT;

const backendUrl =
  window.RUNTIME_CONFIG?.VITE_BACKEND_HAS_DOMAIN_NAME == 'true'
    ? backendAddress
    : `${backendAddress}:${backendPort}`;

export const createIngredient = async (ingredient: Ingredient, userId: number) => {
  try {
    const result = await axiosInstance
      .post(`${backendUrl}/ingredient/add`, {
        userId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        uom: ingredient.uom,
        expiryDate: ingredient.expiryDate,
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getIngredientsByUser = async (userId: number): Promise<Ingredient[]> => {
  try {
    const ingredients = await axiosInstance
      .get(`${backendUrl}/ingredient/getAll/${userId}`)
      .then((response) => response.data);
    return ingredients ? ingredients : [];
  } catch (error) {
    return [];
  }
};

export const updateIngredient = async (ingredientDetails: IngredientRowProps, userId: number) => {
  try {
    const result = await axiosInstance
      .post(`${backendUrl}/ingredient/update`, {
        id: ingredientDetails.id,
        name: ingredientDetails.name,
        userId,
        quantity: ingredientDetails.quantity,
        uom: ingredientDetails.uom,
        expiryDate: ingredientDetails.expiryDate,
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteIngredient = async (ingredientId: number) => {
  try {
    const result = await axiosInstance
      .delete(`${backendUrl}/ingredient/delete/${ingredientId}`)
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
