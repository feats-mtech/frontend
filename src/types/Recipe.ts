import { Recipe_cooking_step } from './Recipe_cooking_step';
import { Recipe_ingredient } from './Recipe_ingredient';
import { Recipe_review } from './Recipe_review';

export interface Recipe {
  id: number;
  creatorId: number;
  name: string;
  imageLink: string;
  description: string;
  cookingTimeInSec: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;

  createDateTime: Date;
  updateDateTime: Date;

  recipeCookingSteps?: Recipe_cooking_step[] | null;
  recipeIngredients?: Recipe_ingredient[] | null;
  recipeReviews?: Recipe_review[] | null;
  //use for frontend
  detailUrl: string;
}
