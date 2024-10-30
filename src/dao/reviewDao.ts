import axios from 'axios';
import { RecipeReview } from 'src/types/RecipeReview';
import { checkStatus } from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_REVIEW_URL || import.meta.env.VITE_BACKEND_REVIEW_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_REVIEW_PORT || import.meta.env.VITE_BACKEND_REVIEW_PORT;

const backendUrl = `${backendAddress}:${backendPort}`;

export const submitReviews = async (reviewItem: RecipeReview) => {
  try {
    const result = await axios
      .post(`${backendUrl}/recipe/${reviewItem.recipeId}/reviews`, reviewItem)
      .then((response) => response);

    if (checkStatus(result.status)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
