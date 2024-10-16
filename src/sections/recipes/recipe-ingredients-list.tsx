import {
  Typography,
  Collapse,
  Alert,
  IconButton,
  Grid,
  Autocomplete,
  TextField,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { RecipeIngredient } from 'src/types/RecipeIngredient';

const _uomType = ['Kg', 'g', 'piece', 'teaspoon', 'ml'];
export const _ingredientType = ['Apple', 'Banana', 'Orange', 'Pineapple', 'Strawberry'];
export const defaultIngredient = {
  id: 0,
  recipeId: 0,
  name: '',
  quantity: 0,
  uom: '',
};
interface RecipeIngredientsListProps {
  recipeIngredients: RecipeIngredient[];
  setRecipeIngredients: React.Dispatch<React.SetStateAction<RecipeIngredient[]>>;
  editable: boolean;
}

export const RecipeIngredientsList = (props: RecipeIngredientsListProps) => {
  const { recipeIngredients, setRecipeIngredients, editable } = props;

  const [lastIngredientNotification, setLastIngredientNotification] = useState<boolean>(false);
  const [uomOptions, setUomOptions] = useState<readonly String[]>([]);
  const [ingredientTypeOptions, setIngredientTypeOptions] = useState<readonly String[]>([]);

  useEffect(() => {
    setUomOptions([..._uomType]);
    setIngredientTypeOptions([..._ingredientType]);
  }, []);

  const addIngredient = () => {
    setLastIngredientNotification(false);
    const temp = defaultIngredient;
    setRecipeIngredients([...(recipeIngredients || []), temp]);
  };
  const deleteIngredient = (index: number) => {
    if (recipeIngredients?.length === 1) {
      setLastIngredientNotification(true);
      return;
    }
    setRecipeIngredients(recipeIngredients?.filter((_, i) => i !== index));
  };
  const updateIngredient = (index: number, field: string, value: any) => {
    const temp = recipeIngredients ? [...recipeIngredients] : [];
    const ingredientRecord = temp.find((_, i) => i === index);
    if (!ingredientRecord) {
      return;
    }
    (ingredientRecord as any)[field] = value;

    setRecipeIngredients(temp);
  };

  return (
    <div>
      <Typography variant="subtitle1">
        Ingredients List
        {editable && (
          <IconButton onClick={addIngredient}>
            <Iconify icon="solar:add-circle-broken" />
          </IconButton>
        )}
      </Typography>

      <Collapse in={lastIngredientNotification}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setLastIngredientNotification(false);
              }}
            >
              <Iconify icon="material-symbols:close" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Must consists of at least 1 ingredient.
        </Alert>
      </Collapse>
      <Grid container padding={2}>
        {recipeIngredients?.map((ingredient: RecipeIngredient, index) => (
          <Grid item key={index} xs={12} paddingBottom={2}>
            <Grid container spacing={1}>
              <Grid item sm={8}>
                <Autocomplete
                  fullWidth={true}
                  disableClearable
                  disabled={!editable}
                  value={ingredient ? ingredient.name : ''}
                  options={ingredientTypeOptions}
                  freeSolo
                  onInputChange={(event, value) => updateIngredient(index, 'name', value)}
                  renderInput={(params) => <TextField {...params} label="Ingredient Name" />}
                />
              </Grid>
              <Grid item sm={1}>
                <TextField
                  disabled={!editable}
                  label="Quantity"
                  value={ingredient ? ingredient.quantity : 0}
                  onChange={(event) => updateIngredient(index, 'quantity', event.target.value)}
                  type="number"
                />
              </Grid>
              <Grid item sm={2}>
                <Autocomplete
                  fullWidth={true}
                  disableClearable
                  disabled={!editable}
                  value={ingredient ? ingredient.uom : 'pcs'}
                  options={uomOptions}
                  freeSolo
                  onInputChange={(event, value) => updateIngredient(index, 'uom', value)}
                  renderInput={(params) => <TextField {...params} label="Unit Of Measurement" />}
                />
              </Grid>
              <Grid item sm={1} alignContent={'center'}>
                {editable && (
                  <Tooltip title="Delete">
                    <IconButton disabled={!editable} onClick={() => deleteIngredient(index)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
