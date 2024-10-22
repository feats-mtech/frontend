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

export function generateDefaultRecipe(): Recipe {
  return {
    id: -1,
    creatorId: -1,
    name: '',
    image: '',
    description: '',
    cookingTimeInSec: 0,
    difficultyLevel: 0,
    cuisine: '',
    rating: 0,
    status: 1,

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

    getRecipe(inputRecipeId);
    triggerResetRecipe();
  }, []);
  useEffect(() => {
    loadFromOrginalRecipe();
  }, [orginialRecipe]);

  useEffect(() => {
    if (creation) {
      setEditable(true);
    }
  }, [creation, editable]);

  const triggerResetRecipe = () => {
    setEditable(false);
    loadFromOrginalRecipe();
  };

  const loadFromOrginalRecipe = () => {
    setRecipe(orginialRecipe);
    setRecipeCookingSteps(orginialRecipe.cookingSteps || []);
    setRecipeIngredients(orginialRecipe.ingredients || []);
    setRecipeReviews(orginialRecipe.reviews || []);
  };

  const getRecipe = async (recipeId: string = '') => {
    if (recipeId === '') {
      //TODO: error, cant find the recipe...
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

  const saveRecipe = async () => {
    let save: boolean = true;
    console.log('//TODO: enhance the validation');
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
          save = false;
          return;
        }
        if (ingredient.quantity <= 0) {
          alert('Ingredient quantity need to be positive');
          save = false;
          return;
        }
        if (ingredient.uom === '') {
          alert('Ingredient uom cannot be empty');
          save = false;
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
          save = false;
          return;
        }
      });
    }
    if (!save) {
      return;
    }
    const combineItem = {
      ...recipe,
      creatorId: user ? user.id : -1,
      cookingSteps: recipeCookingSteps,
      ingredients: recipeIngredients,
    };
    const result = updateRecipeToDb(combineItem);
    if (await result) {
      if ((await result).success) {
        setOpenRecipeCreatedSuccessfulDialog(true);
        // setOrginialRecipe((await result).data);
        // setIsUpdatedSuccess(true);
        // setOwnerMode(true);
        // setCreation(false);
        // triggerResetRecipe(true);
      } else {
        setIsUpdatedFailure(true);
      }
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

      <Dialog open={openRecipeCreatedSuccessfulDialog} onClose={handleNavigateToMyRecipe}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Your recipe had been successfully created!</DialogContentText>
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
function wait(arg0: number) {
  throw new Error('Function not implemented.');
}
