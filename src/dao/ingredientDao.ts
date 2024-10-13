/* eslint-disable no-unused-vars */
import { Ingredient } from 'src/types/Ingredient';
import axios, { HttpStatusCode } from 'axios';
import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createIngredient = async (ingredient: Ingredient, userId: number) => {
  try {
    const result = await axios
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
    const ingredients = await axios
      .get(`${backendUrl}/ingredient/getAll/${userId}`)
      .then((response) => response.data);
    return ingredients ? ingredients : [];
  } catch (error) {
    return [];
  }
};

export const updateIngredient = async (ingredientDetails: IngredientRowProps, userId: number) => {
  try {
    const result = await axios
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
    const result = await axios
      .delete(`${backendUrl}/ingredient/delete/${ingredientId}`)
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
