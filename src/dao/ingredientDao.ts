import { HttpStatusCode } from 'axios';

import { Ingredient } from 'src/types/Ingredient';
import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';

import axiosInstance from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_INGREDIENT_URL || import.meta.env.VITE_BACKEND_INGREDIENT_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_INGREDIENT_PORT ||
  import.meta.env.VITE_BACKEND_INGREDIENT_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;
export const createIngredient = async (ingredient: Ingredient, userId: number) => {
  console.log('userId:', userId);

  try {
    const ingredientInput = {
      userId: userId,
      name: ingredient.name,
      quantity: ingredient.quantity,
      uom: ingredient.uom,
      expiryDate: ingredient.expiryDate,
    };
    const formData = new FormData();
    formData.append(
      'ingredient',
      new Blob([JSON.stringify(ingredientInput)], { type: 'application/json' }),
    );
    if (ingredient.image) {
      formData.append('imageFile', ingredient.image);
    }
    const result = await axiosInstance
      .post(`${backendUrl}/ingredient/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response);

    // console.log('hi hi');
    // const formData = new FormData();
    // if (ingredient.imageUrl) {
    //   console.log('hi hi sending ,', ingredient.imageUrl);
    //   formData.append('file', ingredient.imageUrl);
    //   formData.append('file', ingredient.imageUrl);
    //   const response2 = await axiosInstance.post(`${backendUrl}/image/upload`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   formData.append('result:', ingredient.imageUrl);
    // }
    return { success: result.status === HttpStatusCode.Created };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateIngredient = async (ingredientDetails: IngredientRowProps, userId: number) => {
  try {
    const ingredientInput = {
      id: ingredientDetails.id,
      name: ingredientDetails.name,
      userId,
      quantity: ingredientDetails.quantity,
      uom: ingredientDetails.uom,
      expiryDate: ingredientDetails.expiryDate,
    };

    const formData = new FormData();
    formData.append(
      'ingredient',
      new Blob([JSON.stringify(ingredientInput)], { type: 'application/json' }),
    );
    if (ingredientDetails.image) {
      formData.append('imageFile', ingredientDetails.image);
    }
    const result = await axiosInstance
      .post(`${backendUrl}/ingredient/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response);
    return { success: result.status === HttpStatusCode.Ok };
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
