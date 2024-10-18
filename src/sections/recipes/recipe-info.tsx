import React, { useEffect, useState } from 'react';

import { Typography, Grid, Autocomplete, TextField, Rating, Box } from '@mui/material';

import { Recipe } from 'src/types/Recipe';

interface RecipeDetailsProps {
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  editable: boolean;
}

export const _cuisineType = ['Chinese', 'Western', 'Japanese', 'Local', 'Others'];
export const RecipeDetails = (props: RecipeDetailsProps) => {
  const { recipe, setRecipe, editable } = props;

  const [openCuisineAutoComplete, setOpenCuisineAutoComplete] = useState(false);
  const [cuisineTypeOptions, setCuisineTypeOptions] = useState<readonly string[]>([]);

  useEffect(() => {
    setCuisineTypeOptions([..._cuisineType]);
  }, []);

  const updateRecipe = (field: string, value: any) => {
    console.log('name is ' + field + ' value is ' + value);

    setRecipe({
      ...recipe,
      [field]: value,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;

    updateRecipe(name, value);
  };

  const handleOpen = () => setOpenCuisineAutoComplete(true);

  const setDifficultyLevel = (
    event: React.SyntheticEvent<Element, Event>,
    value: number | String | null,
  ) => {
    const target = event.target as HTMLInputElement;
    const { name } = target;

    updateRecipe(name, value);
  };

  const setCuisine = (value: String) => {
    updateRecipe('cuisine', value);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={5} sm={4}>
        <Box
          component="img"
          alt={recipe && recipe.name}
          src={recipe && recipe.image}
          sx={{
            top: 20,
            left: 20,
            width: 1,
            padding: 1,
          }}
        />
      </Grid>
      <Grid item xs={7} sm={8}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={2}>
            <Typography variant="subtitle1">Name</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              required
              id="outlined-required"
              label="Title"
              disabled={!editable}
              value={recipe ? recipe.name : ''}
              fullWidth={true}
              name="name"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1">Difficulty </Typography>
          </Grid>
          <Grid item xs={10}>
            <Rating
              disabled={!editable}
              name="difficultyLevel"
              value={recipe ? recipe.difficultyLevel : 0}
              onChange={setDifficultyLevel}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1">Cuisine </Typography>
          </Grid>
          <Grid item xs={10}>
            <Autocomplete
              fullWidth={true}
              disabled={!editable}
              disableClearable
              value={recipe ? recipe.cuisine : ''}
              options={cuisineTypeOptions}
              onChange={(event, value, reason, details) => setCuisine(value)}
              renderInput={(params) => <TextField {...params} label="Cuisine" />}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1">Description </Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              fullWidth={true}
              id="outlined-textarea"
              label="Description"
              placeholder="Description"
              name="description"
              multiline
              disabled={!editable}
              rows={4}
              value={recipe ? recipe.description : ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
