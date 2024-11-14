import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material';

import { generateDefaultCookingStep, RecipeCookingStepsList } from '../recipe-cooking-steps-list';
import { RecipeHeader } from '../recipe-details-header';
import { RecipeDetails } from '../recipe-info';
import { generateDefaultIngredient, RecipeIngredientsList } from '../recipe-ingredients-list';
import { RecipeReviewsList } from '../recipe-reviews-list';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { Recipe } from 'src/types/Recipe';
import { RecipeCookingStep } from 'src/types/RecipeCookingStep';
import { RecipeIngredient } from 'src/types/RecipeIngredient';
import { RecipeReview } from 'src/types/RecipeReview';
import { useAuth } from 'src/context/AuthContext';
import { ResponseSnackbar } from 'src/sections/inventory/ingredient-snackbar';

import { getRecipeById, updateRecipeToDb } from 'src/dao/recipeDao';
import {
  getCookingStepHelperText,
  getCuisineHelperText,
  getDescriptionHelperText,
  getDifficultyLevelHelperText,
  getImageHelperText,
  getIngredientNameHelperText,
  getIngredientQuantityTest,
  getIngredientUOMHelperText,
  getTitleHelperText,
} from '../recipe-helper-util';

export function generateDefaultRecipe(): Recipe {
  return {
    id: -1,
    creatorId: -1,
    name: '',
    image: '',
    description: '',
    cookingTimeInMin: 0,
    difficultyLevel: 0,
    cuisine: '',
    rating: 0,
    status: 1,
    draftRecipe: null,

    createDatetime: new Date(),
    updateDatetime: new Date(),

    cookingSteps: [],
    ingredients: [],
    reviews: [],
  };
}

export function RecipesDetailView() {
  const router = useRouter();
  const { user } = useAuth();
  const [editable, setEditable] = useState<boolean>(false);
  const [creation, setCreation] = useState<boolean>(false);
  const [ownerMode, setOwnerMode] = useState<boolean>(false);
  const [isUpdatedSuccess, setIsUpdatedSuccess] = useState<boolean>(false);
  const [isUpdatedFailure, setIsUpdatedFailure] = useState<boolean>(false);
  const [highlightHelperText, setHighlightHelperText] = useState<boolean>(false);
  const [openRecipeCreatedSuccessfulDialog, setOpenRecipeCreatedSuccessfulDialog] =
    useState<boolean>(false);

  const { inputRecipeId } = useParams();
  //values for generating the form.
  const [recipe, setRecipe] = useState<Recipe>(generateDefaultRecipe());
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeCookingSteps, setRecipeCookingSteps] = useState<RecipeCookingStep[]>([]);
  const [recipeReviews, setRecipeReviews] = useState<RecipeReview[]>([]);

  const [orginialRecipe, setOrginialRecipe] = useState<Recipe>(generateDefaultRecipe());
  useEffect(() => {
    //constructor
    //recipeId = new, then it is a new recipe
    // = number and can get recipe from backend == display in form..read only
    // = number and cant get recipe just error the whole page...
    getRecipeFromServer();
  }, []);
  useEffect(() => {
    loadFromOrginalRecipe();
  }, [orginialRecipe]);

  useEffect(() => {
    if (creation) {
      setEditable(true);
    }
  }, [creation, editable]);

  const getRecipeFromServer = () => {
    getRecipe(inputRecipeId);
    triggerResetRecipe();
  };

  const triggerResetRecipe = () => {
    setEditable(false);
    loadFromOrginalRecipe();
  };

  const loadFromOrginalRecipe = () => {
    if (orginialRecipe.draftRecipe == null || !ownerMode) {
      setRecipe(orginialRecipe);
      setRecipeCookingSteps(orginialRecipe.cookingSteps || []);
      setRecipeIngredients(orginialRecipe.ingredients || []);
      setRecipeReviews(orginialRecipe.reviews || []);
    } else {
      setRecipe(orginialRecipe.draftRecipe);
      setRecipeCookingSteps(orginialRecipe.draftRecipe.cookingSteps || []);
      setRecipeIngredients(orginialRecipe.draftRecipe.ingredients || []);
      setRecipeReviews(orginialRecipe.draftRecipe.reviews || []);
    }
  };

  const getRecipe = async (recipeId: string = '') => {
    if (recipeId === '') {
      return;
    }
    if (recipeId === 'new') {
      const combineItem: Recipe = {
        ...generateDefaultRecipe(),
        creatorId: user ? user.id : -1,
        cookingSteps: [...[], generateDefaultCookingStep()],
        ingredients: [...[], generateDefaultIngredient()],
      };
      setOrginialRecipe(...[], combineItem);
      setCreation(true);
      return;
    } else if (!isNaN(+recipeId)) {
      const recipesDetails = await getRecipeById(+recipeId);
      setOrginialRecipe(recipesDetails ? recipesDetails : generateDefaultRecipe());

      setOwnerMode(user ? user.id === recipesDetails?.creatorId : false);
      return;
    }
  };

  const saveRecipe = async (status: number = 0) => {
    setHighlightHelperText(true);

    const recipeFields = [
      getImageHelperText(true, recipe.image),
      getTitleHelperText(true, recipe.name),
      getDifficultyLevelHelperText(true, recipe.difficultyLevel),
      getCuisineHelperText(true, recipe.cuisine),
      getDescriptionHelperText(true, recipe.description),
    ];

    const isIngredientsValid =
      recipeIngredients.length > 0 &&
      recipeIngredients.every(
        (ingredient) =>
          !getIngredientNameHelperText(true, ingredient.name) &&
          !getIngredientQuantityTest(true, ingredient.quantity) &&
          !getIngredientUOMHelperText(true, ingredient.uom),
      );

    const isStepsValid =
      recipeCookingSteps.length > 0 &&
      recipeCookingSteps.every((step) => !getCookingStepHelperText(true, step.description));

    const enableSave = recipeFields.every((field) => !field) && isIngredientsValid && isStepsValid;
    if (!enableSave) return;

    const combineItem = {
      ...recipe,
      status: status,
      creatorId: user?.id ?? -1,
      cookingSteps: recipeCookingSteps,
      ingredients: recipeIngredients,
    };

    const result = await updateRecipeToDb(combineItem);
    if (result?.success) {
      setOpenRecipeCreatedSuccessfulDialog(true);
      // Uncomment these as needed
      // setOriginalRecipe(result.data);
      // setIsUpdatedSuccess(true);
      // setOwnerMode(true);
      // setCreation(false);
      // triggerResetRecipe(true);
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

  const handleNavigateToMyRecipe = useCallback(() => {
    router.push('/my-recipes');
  }, [router]);

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
              setRecipe={setRecipe}
              triggerResetRecipe={triggerResetRecipe}
              saveRecipe={saveRecipe}
              getRecipeFromServer={getRecipeFromServer}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <RecipeDetails
              recipe={recipe}
              setRecipe={setRecipe}
              editable={editable}
              highlightHelperText={highlightHelperText}
            />
          </Grid>
          <Grid item xs={12}>
            <RecipeIngredientsList
              recipeIngredients={recipeIngredients}
              setRecipeIngredients={setRecipeIngredients}
              editable={editable}
              highlightHelperText={highlightHelperText}
            />
          </Grid>
          <Grid item xs={12}>
            <RecipeCookingStepsList
              editable={editable}
              recipeCookingSteps={recipeCookingSteps}
              setRecipeCookingSteps={setRecipeCookingSteps}
              highlightHelperText={highlightHelperText}
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
        ariaLabel="Recipe-saved-success"
      />
      <ResponseSnackbar
        isOpen={isUpdatedFailure}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Recipe saved failed!"
        ariaLabel="Recipe-saved-failed"
      />

      <Dialog open={openRecipeCreatedSuccessfulDialog} onClose={handleNavigateToMyRecipe}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your recipe had been successfully {recipe.status === 0 ? 'saved' : 'published'}!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNavigateToMyRecipe} color="primary">
            Back to My Recipe List
          </Button>
        </DialogActions>
      </Dialog>
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
