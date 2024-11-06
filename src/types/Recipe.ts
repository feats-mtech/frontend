import { RecipeCookingStep } from './RecipeCookingStep';
import { RecipeIngredient } from './RecipeIngredient';
import { RecipeReview } from './RecipeReview';

export interface Recipe {
  id: number;
  creatorId: number;
  name: string;
  image: string;
  description: string;
  cookingTimeInMin: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;
  draftRecipe: Recipe | null;

  createDatetime: Date;
  updateDatetime: Date;

  cookingSteps?: RecipeCookingStep[];
  ingredients?: RecipeIngredient[];
  reviews?: RecipeReview[];
}
