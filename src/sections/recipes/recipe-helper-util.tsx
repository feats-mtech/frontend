export const getTitleHelperText = (display: boolean, title: string): string => {
  if (!display) {
    return '';
  }
  return title?.length > 0 ? '' : 'Title is required';
};

export const getImageHelperText = (display: boolean, image: string): string => {
  if (!display) {
    return '';
  }
  return image?.startsWith('http') ? '' : 'Image URL is invalid';
};

export const getDifficultyLevelHelperText = (display: boolean, difficultyLevel: number): string => {
  if (!display) {
    return '';
  }
  return difficultyLevel > 0 ? '' : 'Difficulty Level is required';
};

export const getCuisineHelperText = (display: boolean, cuisine: string): string => {
  if (!display) {
    return '';
  }
  return cuisine?.length > 0 ? '' : 'Cuisine is required';
};

export const getDescriptionHelperText = (display: boolean, description: string): string => {
  if (!display) {
    return '';
  }
  return description?.length > 0 ? '' : 'Description is required';
};

export const getCookingTimeInSecHelperText = (display: boolean, cookingtime: number): string => {
  if (!display) {
    return '';
  }
  return cookingtime > 0 ? '' : 'Minimal cooking time of 1 second';
};
export const getIngredientNameHelperText = (display: boolean, name: string): string => {
  if (!display) {
    return '';
  }
  return name?.length > 0 ? '' : 'Ingredient Name is required';
};
export const getIngredientQuantityTest = (display: boolean, quantity: number): string => {
  if (!display) {
    return '';
  }
  return quantity > 0 ? '' : 'Minimal quantity of 1';
};

export const getIngredientUOMHelperText = (display: boolean, UOM: string): string => {
  if (!display) {
    return '';
  }
  return UOM?.length > 0 ? '' : 'Uom is required';
};

export const getCookingStepHelperText = (display: boolean, name: string): string => {
  if (!display) {
    return '';
  }
  return name?.length > 0 ? '' : 'Ingredient Name is required';
};
