export interface RecipeReview {
  id: number;
  recipeId: number;
  creatorId: number;
  rating: number;
  createDatetime: Date;
  updateDatetime: Date;
  comments: String;
}
