import axios from 'axios';
import { Recipe } from 'src/types/Recipe';
import { RecipeCookingStep } from 'src/types/RecipeCookingStep';
import { RecipeIngredient } from 'src/types/RecipeIngredient';
import { RecipeReview } from 'src/types/RecipeReview';
import { checkStatus } from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_RECIPE_URL || import.meta.env.VITE_BACKEND_RECIPE_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_RECIPE_PORT || import.meta.env.VITE_BACKEND_RECIPE_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

interface RecipeProps {
  id: number;
  creatorId: number;
  name: string;
  image: string;
  description: string;
  cookingTimeInSec: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;
  draftRecipe: Recipe | null;

  createDatetime: string;
  updateDatetime: string;

  cookingSteps?: RecipeCookingStep[];
  ingredients?: RecipeIngredient[];
  reviews?: RecipeReview[];
}

export const getAllPublishedRecipe = async (): Promise<Recipe[]> => {
  try {
    const result = await axios.get(`${backendUrl}/recipe/published`).then((response) => response);

    const recipesList: Recipe[] = [];
    if (checkStatus(result.status)) {
      result.data.map((item: RecipeProps) => {
        const temp: Recipe = {
          ...item,
          createDatetime: new Date(item.createDatetime),
          updateDatetime: new Date(item.updateDatetime),
        };

        recipesList.push(temp);
      });
    }
    return recipesList;
  } catch (error) {
    return [];
  }
};

export const getRecipeById = async (recipeId: number): Promise<Recipe | null> => {
  try {
    const result = await axios
      .get(`${backendUrl}/recipe/${recipeId}/with-reviews`)
      .then((response) => response);
    if (checkStatus(result.status)) {
      const temp: Recipe = {
        ...result.data.recipe,
        createDatetime: new Date(result.data.createDatetime),
        updateDatetime: new Date(result.data.updateDatetime),
      };
      temp.reviews = result.data.reviews;
      return temp;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getAllRecipeByCreatorId = async (creatorId: number): Promise<Recipe[]> => {
  try {
    const recipesList: Recipe[] = [];
    const result = await axios
      .get(`${backendUrl}/recipe/creator/${creatorId}`)
      .then((response) => response);
    if (checkStatus(result.status)) {
      result.data.map((item: RecipeProps) => {
        const temp: Recipe = {
          ...item,
          createDatetime: new Date(item.createDatetime),
          updateDatetime: new Date(item.updateDatetime),
        };

        recipesList.push(temp);
      });
    }
    return recipesList;
  } catch (error) {
    return [];
  }
};

export const deleteRecipeById = async (recipeId: number) => {
  try {
    const result = await axios
      .delete(`${backendUrl}/recipe/${recipeId}`)
      .then((response) => response);
    return { success: checkStatus(result.status), data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateRecipeToDb = async (recipe: Recipe) => {
  try {
    var result;
    if (recipe.id === -1) {
      result = await axios
        .post(`${backendUrl}/recipe`, {
          creatorId: recipe.creatorId,
          name: recipe.name,
          image: recipe.image,
          description: recipe.description,
          cookingTimeInSec: recipe.cookingTimeInSec,
          difficultyLevel: recipe.difficultyLevel,
          rating: recipe.rating,
          status: recipe.status,
          createDatetime: recipe.createDatetime,
          updateDatetime: recipe.updateDatetime,
          ingredients: recipe.ingredients,
          cookingSteps: recipe.cookingSteps,
          cuisine: recipe.cuisine,
        })
        .then((response) => response);
    } else {
      result = await axios
        .put(`${backendUrl}/recipe/${recipe.id}`, {
          id: recipe.id,
          creatorId: recipe.creatorId,
          name: recipe.name,
          image: recipe.image,
          description: recipe.description,
          cookingTimeInSec: recipe.cookingTimeInSec,
          difficultyLevel: recipe.difficultyLevel,
          rating: recipe.rating,
          status: recipe.status,
          createDatetime: recipe.createDatetime,
          updateDatetime: recipe.updateDatetime,
          ingredients: recipe.ingredients,
          cookingSteps: recipe.cookingSteps,
          cuisine: recipe.cuisine,
        })
        .then((response) => response);
    }

    return { success: checkStatus(result.status), data: result.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
