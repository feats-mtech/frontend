import { RecipeReview } from 'src/types/RecipeReview';

import axiosInstance, { checkStatus } from './webCallUtils';

const backendAddress =
  window.RUNTIME_CONFIG?.VITE_BACKEND_REVIEW_URL || import.meta.env.VITE_BACKEND_REVIEW_URL;

const backendPort =
  window.RUNTIME_CONFIG?.VITE_BACKEND_REVIEW_PORT || import.meta.env.VITE_BACKEND_REVIEW_PORT;

const backendUrl =
  window.RUNTIME_CONFIG?.VITE_BACKEND_HAS_DOMAIN_NAME == 'true'
    ? backendAddress
    : `${backendAddress}:${backendPort}`;

export const submitReviews = async (reviewItem: RecipeReview) => {
  try {
    const result = await axiosInstance.post(
      `${backendUrl}/recipe/${reviewItem.recipeId}/reviews`,
      reviewItem,
    );

    if (checkStatus(result.status)) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
