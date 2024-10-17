import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Card, Grid } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Recipe } from 'src/types/Recipe';
import { RecipeCookingStep } from 'src/types/RecipeCookingStep';
import { RecipeIngredient } from 'src/types/RecipeIngredient';
import { RecipeReview } from 'src/types/RecipeReview';
import { defaultCookingStep, RecipeCookingStepsList } from '../recipe-cooking-steps-list';
import { RecipeHeader } from '../recipe-details-header';
import { RecipeDetails } from '../recipe-info';
import { defaultIngredient, RecipeIngredientsList } from '../recipe-ingredients-list';
import { RecipeReviewsList } from '../recipe-reviews-list';
import { ResponseSnackbar } from 'src/sections/inventory/ingredient-snackbar';

import { useAuth } from 'src/context/AuthContext';
import { getRecipeById, saveRecipeToDb } from 'src/dao/recipeDao';

export const defaultRecipe = {
  id: -1,
  creatorId: -1,
  name: '',
  image: '',
  description: '',
  cookingTimeInSec: 0,
  difficultyLevel: 0,
  cuisine: '',
  rating: 0,
  status: -1,

  createDatetime: new Date(),
  updateDatetime: new Date(),

  recipeCookingSteps: [],
  recipeIngredients: [],
  recipeReviews: [],
};

export function RecipesDetailView() {
  const { user } = useAuth();
  const [editable, setEditable] = useState<boolean>(false);
  const [creation, setCreation] = useState<boolean>(false);
  const [ownerMode, setOwnerMode] = useState<boolean>(false);
  const [isUpdatedSuccess, setIsUpdatedSuccess] = useState<boolean>(false);
  const [isUpdatedFailure, setIsUpdatedFailure] = useState<boolean>(false);

  const { recipeId } = useParams();
  //values for generating the form.
  const [recipe, setRecipe] = useState<Recipe>(defaultRecipe);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeCookingSteps, setRecipeCookingSteps] = useState<RecipeCookingStep[]>([]);
  const [recipeReviews, setRecipeReviews] = useState<RecipeReview[]>([]);

  const [resetRecipe, triggerResetRecipe] = useState<boolean>(false);

  const [orginialRecipe, setOrginialRecipe] = useState<Recipe>(defaultRecipe);
  useEffect(() => {
    //constructor
    //recipeId = new, then it is a new recipe
    // = number and can get recipe from backend == display in form..read only
    // = number and cant get recipe just error the whole page...

    getRecipe(recipeId);
  }, []);

  useEffect(() => {
    if (resetRecipe) {
      setRecipe(orginialRecipe);
      setRecipeCookingSteps(orginialRecipe.cookingSteps || []);
      setRecipeIngredients(orginialRecipe.ingredients || []);
      setRecipeReviews(orginialRecipe.reviews || []);
      triggerResetRecipe(false);
      setEditable(false);
    }
  }, [resetRecipe]);

  const getRecipe = async (recipeId: string = '') => {
    if (recipeId === '') {
      //TODO: error, cant find the recipe...
      return;
    }
    if (recipeId === 'new') {
      setCreation(true);
      setEditable(true);
      setRecipeCookingSteps([defaultCookingStep]);
      setRecipeIngredients([defaultIngredient]);
      return;
    } else if (!isNaN(+recipeId)) {
      const recipesDetails = await getRecipeById(+recipeId);
      setOrginialRecipe(recipesDetails ? recipesDetails : defaultRecipe);
      triggerResetRecipe(true);

      setOwnerMode(user ? user.id === recipesDetails?.creatorId : false);
      return;
    } else {
      console.log('error, cant find the recipe...');
    }
  };

  const saveRecipe = async () => {
    alert('//TODO: enchance the validation');
    if (recipe.name === '') {
      alert('Recipe name cannot be empty');
      return;
    }
    if (recipe.difficultyLevel === 0) {
      alert('Difficulty level cannot be empty');
      return;
    }
    if (recipe.cuisine === '') {
      alert('Cuisine cannot be empty');
      return;
    }
    if (recipe.description === '') {
      alert('Description cannot be empty');
      return;
    }
    if (recipeIngredients.length === 0) {
      alert('Ingredients cannot be empty');
      return;
    } else {
      recipeIngredients.forEach((ingredient) => {
        if (ingredient.name === '') {
          alert('Ingredient name cannot be empty');
          return;
        }
        if (ingredient.quantity <= 0) {
          alert('Ingredient quantity need to be positive');
          return;
        }
        if (ingredient.uom === '') {
          alert('Ingredient uom cannot be empty');
          return;
        }
      });
    }
    if (recipeCookingSteps.length === 0) {
      alert('Cooking steps cannot be empty');
      return;
    } else {
      recipeCookingSteps.forEach((step) => {
        if (step.description === '') {
          alert('Step description cannot be empty');
          return;
        }
      });
    }
    const combineItem = {
      ...recipe,
      cookingSteps: recipeCookingSteps,
      ingredients: recipeIngredients,
    };
    const result = saveRecipeToDb(combineItem);
    if (await result) {
      alert('Recipe saved successfully');
      setOrginialRecipe(combineItem);
      triggerResetRecipe(true);
      setIsUpdatedSuccess(true);
    } else {
      setIsUpdatedFailure(true);
    }
  };

  const handleCloseSnackbar = () => {
    setIsUpdatedSuccess(false);
    setIsUpdatedFailure(false);
  };

  // const executeRecipe = () => {
  //   saveRecipe();
  //   setIsUpdatedSuccess(true);
  // };

  return (
    <DashboardContent>
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <RecipeHeader
              editable={editable}
              setEditable={setEditable}
              creation={creation}
              ownerMode={ownerMode}
              recipe={recipe}
              triggerResetRecipe={triggerResetRecipe}
              saveRecipe={saveRecipe}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <RecipeDetails recipe={recipe} setRecipe={setRecipe} editable={editable} />
          </Grid>
          <Grid item xs={12}>
            <RecipeIngredientsList
              recipeIngredients={recipeIngredients}
              setRecipeIngredients={setRecipeIngredients}
              editable={editable}
            />
          </Grid>
          <Grid item xs={12}>
            <RecipeCookingStepsList
              editable={editable}
              recipeCookingSteps={recipeCookingSteps}
              setRecipeCookingSteps={setRecipeCookingSteps}
            />
          </Grid>
          {!creation && (
            <Grid item xs={12}>
              <RecipeReviewsList
                recipeReviews={recipeReviews}
                setRecipeReview={setRecipeReviews}
                recipeId={recipe.id}
              />
            </Grid>
          )}
        </Grid>
      </Card>

      <ResponseSnackbar
        isOpen={isUpdatedSuccess}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message="Recipe saved successfully!"
      />
      <ResponseSnackbar
        isOpen={isUpdatedFailure}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Recipe saved failed!"
      />
      {/* <Typography variant="body2">recipe ID :{recipe.id}</Typography>
      <Typography variant="body2">recipe name :{recipe.name}</Typography>
      <Typography variant="body2">recipe difficultyLevel :{recipe.difficultyLevel}</Typography>
      <Typography variant="body2">recipe cuisine :{recipe.cuisine}</Typography>
      <Typography variant="body2">recipe description :{recipe.description}</Typography>
      ==================
      {recipeIngredients?.map((ingredient: RecipeIngredient) => (
        <div>
          <Typography variant="body2" sx={{ mb: 2 }}></Typography>

          <Typography variant="body2">ingredient name :{ingredient.name}</Typography>
          <Typography variant="body2">ingredient quantity :{ingredient.quantity}</Typography>
          <Typography variant="body2">ingredient uom :{ingredient.uom}</Typography>
        </div>
      ))}
      ==================
      {recipeCookingSteps?.map((step: RecipeCookingStep) => (
        <div>
          <Typography variant="body2" sx={{ mb: 2 }}></Typography>

          <Typography variant="body2">step description :{step.description}</Typography>
        </div>
      ))}
      ==================
      {recipeReviews?.map((review: RecipeReview) => (
        <div>
          <Typography variant="body2" sx={{ mb: 2 }}></Typography>

          <Typography variant="body2">review comments :{review.comments}</Typography>
        </div>
      ))}
      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
