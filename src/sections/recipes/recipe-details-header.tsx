import React, { useState } from 'react';

import { Typography, Grid, Button } from '@mui/material';

import RecipeDeleteDialog from './recipe-delete-dialog';
import RecipeCookDialog from './recipe-cook-dialog';
import RecipeRevertDialog from './recipe-revert-dialog';

import { Iconify } from 'src/components/iconify';
import { Recipe } from 'src/types/Recipe';

export const defaultCookingStep = {
  id: 0,
  recipeId: 0,
  description: '',
  imageUrl: 'No Image',
};
interface RecipeCookingStepListProps {
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  creation: boolean;
  ownerMode: boolean;
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  triggerResetRecipe: () => void;
  saveRecipe: (status: number) => void;

  getRecipeFromServer: () => void;
}
export const RecipeHeader = (props: RecipeCookingStepListProps) => {
  const {
    editable,
    setEditable,
    creation,
    ownerMode,
    recipe,
    setRecipe,
    triggerResetRecipe,
    saveRecipe,

    getRecipeFromServer,
  } = props;

  const saveDraftRecipe = () => {
    setRecipe({
      ...recipe,
      status: 0,
    });
    saveRecipe(0);
  };
  const savePublishedRecipe = () => {
    setRecipe({
      ...recipe,
      status: 1,
    });
    saveRecipe(1);
  };
  const handleCloseRevertDialog = () => setRevertDialogOption(false);
  const [openRevertDialogOption, setRevertDialogOption] = useState(false);
  const setEditableToTrue = () => setEditable(true);
  const openRevertDialog = () => setRevertDialogOption(true);

  return (
    <>
      <RecipeRevertDialog
        openDialog={openRevertDialogOption}
        handleCloseDialog={handleCloseRevertDialog}
        triggerResetRecipe={triggerResetRecipe}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3">
            {creation ? 'Recipe Creation' : <div>Recipes Details for {recipe && recipe.name}</div>}
          </Typography>
        </Grid>
        {creation ? (
          <Grid item xs={12}>
            <Button variant="outlined" onClick={saveDraftRecipe}>
              <Iconify icon="material-symbols:save" />
              Save Recipe
            </Button>
            <Button variant="outlined" onClick={savePublishedRecipe}>
              <Iconify icon="material-symbols:publish" />
              Publish Recipe
            </Button>
          </Grid>
        ) : (
          ownerMode && (
            <Grid item xs={12} style={{ paddingBottom: '16px' }}>
              {!editable ? (
                <Button variant="outlined" onClick={setEditableToTrue}>
                  <Iconify icon="solar:pen-bold" />
                  Edit Recipe
                </Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={saveDraftRecipe}>
                    <Iconify icon="material-symbols:save" />
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={savePublishedRecipe}>
                    <Iconify icon="material-symbols:publish" />
                    Publish Changes
                  </Button>
                  <Button variant="outlined" onClick={openRevertDialog}>
                    <Iconify icon="grommet-icons:revert" />
                    Discard Changes
                  </Button>
                </>
              )}
              <RecipeDeleteDialog recipeId={recipe.id} />
            </Grid>
          )
        )}
        {!ownerMode && !creation && (
          <Grid item xs={12}>
            <RecipeCookDialog recipeId={recipe.id} getRecipeFromServer={getRecipeFromServer} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
