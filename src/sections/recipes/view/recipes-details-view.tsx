import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCall } from 'src/hooks/axios/useAxios';
import { DashboardContent } from 'src/layouts/dashboard';
import { Recipe } from 'src/types/Recipe';
import { Recipe_cooking_step } from 'src/types/Recipe_cooking_step';
import { Recipe_ingredient } from 'src/types/Recipe_ingredient';
import { Recipe_review } from 'src/types/Recipe_review';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function RecipesDetailView() {
  const [editable, setEditable] = useState(false);
  const [openCuisineAutoComplete, setOpenCuisineAutoComplete] = useState(false);
  const [cuisineTypeOptions, setCuisineTypeOptions] = useState<readonly string[]>([]);
  const [ingredientTypeOptions, setIngredientTypeOptions] = useState<readonly String[]>([]);
  const [uomOptions, setUomOptions] = useState<readonly String[]>([]);

  const { recipeId } = useParams();
  //use to reset if to OG values
  const [orginialRecipe, setOrginialRecipe] = useState<Recipe>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [recipeIngredients, setRecipeIngredients] = useState<Recipe_ingredient[]>();
  const [recipeCookingSteps, setRecipeCookingSteps] = useState<Recipe_cooking_step[]>();
  const [recipeReviews, setRecipeReviews] = useState<Recipe_review[]>();
  const _ingredientType = ['Apple', 'Banana', 'Orange', 'Pineapple', 'Strawberry'];
  const _cuisineType = ['Chinese', 'Western', 'Japanese', 'Local', 'Others'];
  const _uomType = ['Kg', 'g', 'piece', 'teaspoon', 'ml'];
  const handleOpen = () => {
    setOpenCuisineAutoComplete(true);
    console.log('inside handleOpen');
    // if (ingredientType.length > 0) {
    //   return;
    // }
    //   (async () => {
    //     setLoading(true);
    //     await sleep(1); // For demo purposes.
    //     //TODO: get the cusine types from the backend
    //     //TODO: can improve filtering conditions
    //     setCuisineTypeOptions([...cuisineType]);
    //     setIngredientTypeOptions([...ingredientType]);

    //     setLoading(false);
    //   })();
  };

  useEffect(() => {
    setCuisineTypeOptions([..._cuisineType]);
    setIngredientTypeOptions([..._ingredientType]);
    setIngredientTypeOptions([..._uomType]);
    //constructor
    console.log('inside recipes details with ID ' + recipeId);
    const recipe = getCall('/api/recipes/' + recipeId);
    if (recipe && !Array.isArray(recipe)) {
      setOrginialRecipe(recipe);
      setRecipe(recipe);
      setRecipeCookingSteps(recipe.recipeCookingSteps ? recipe.recipeCookingSteps : []);
      setRecipeIngredients(recipe.recipeIngredients ? recipe.recipeIngredients : []);
      setRecipeReviews(recipe.recipeReviews ? recipe.recipeReviews : []);
    }
  }, []);

  const renderImg = (
    <Box
      component="img"
      alt={recipe && recipe.name}
      src={recipe && recipe.imageLink}
      sx={{
        top: 20,
        left: 20,
        width: 1,
        padding: 1,
      }}
    />
  );
  const renderTitle = (
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
          value={recipe?.name ?? 'Enter Recipe Name'}
          fullWidth={true}
        />
      </Grid>
    </Grid>
  );
  const renderDifficulty = (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={2}>
        <Typography variant="subtitle1">Difficulty </Typography>
      </Grid>
      <Grid item xs={10}>
        <Rating
          disabled={!editable}
          name="Difficulty Label"
          value={recipe ? recipe.difficultyLevel : 0}
          defaultValue={recipe?.difficultyLevel}
          // onChange={(event, newValue) => {
          //   onUpdateRecipe({ difficulty: newValue });
          // }}
        />
      </Grid>
    </Grid>
  );
  const renderCuisineBox = (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={2}>
        <Typography variant="subtitle1">Cuisine </Typography>
      </Grid>
      <Grid item xs={10}>
        <Autocomplete
          fullWidth={true}
          disableClearable
          value={recipe ? recipe.cuisine : ''}
          options={cuisineTypeOptions}
          renderInput={(params) => <TextField {...params} label="Cuisine" />}
        />
      </Grid>
    </Grid>
  );
  const renderDescription = (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={2}>
        <Typography variant="subtitle1">Description </Typography>
      </Grid>
      <Grid item xs={10}>
        <TextField
          fullWidth={true}
          id="outlined-textarea"
          label="Description"
          placeholder="Description"
          multiline
          rows={4}
          defaultValue={recipe ? recipe.description : ''}
        />
      </Grid>
    </Grid>
  );

  const renderDetails = (
    <Typography sx={{ p: 1 }}>
      <Typography variant="subtitle2" paddingBottom={2}>
        {renderTitle}
      </Typography>
      <Typography variant="body2" paddingBottom={2}>
        {renderDifficulty}
      </Typography>
      <Typography variant="body2" paddingBottom={2}>
        {renderCuisineBox}
      </Typography>
      <Typography variant="body2" paddingBottom={2}>
        {renderDescription}
      </Typography>
    </Typography>
  );
  const renderIngredients = (
    <div>
      <Typography variant="subtitle1">Ingredients List </Typography>
      <Grid container padding={2}>
        {recipeIngredients?.map((ingredient: Recipe_ingredient) => (
          <Grid key={ingredient.id} xs={12} paddingBottom={2}>
            <Grid container spacing={1}>
              <Grid item sm={8}>
                <Autocomplete
                  fullWidth={true}
                  disableClearable
                  value={ingredient ? ingredient.name : ''}
                  options={ingredientTypeOptions}
                  freeSolo
                  renderInput={(params) => <TextField {...params} label="Ingredient Name" />}
                />
              </Grid>
              <Grid item sm={1}>
                <TextField
                  id="outlined-number"
                  label="Quantity"
                  value={ingredient ? ingredient.quantity : 0}
                  type="number"
                />
              </Grid>
              <Grid item sm={2}>
                <Autocomplete
                  fullWidth={true}
                  disableClearable
                  value={ingredient ? ingredient.uom : 'pcs'}
                  options={uomOptions}
                  freeSolo
                  renderInput={(params) => <TextField {...params} label="Ingredient Name" />}
                />
              </Grid>
              <Grid item sm={1} alignContent={'center'}>
                <DeleteForeverIcon />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
  const renderCookingSteps = (
    <div>
      <Typography variant="subtitle1">Cooking Steps List </Typography>
      <Grid container padding={2}>
        {recipeCookingSteps?.map((cookingStep: Recipe_cooking_step) => (
          <Grid key={cookingStep.id} xs={12} paddingBottom={2}>
            <Grid container spacing={1}>
              <Grid item sm={2}>
                <Box
                  component="img"
                  alt={cookingStep.imageUrl}
                  src={cookingStep.imageUrl}
                  sx={{
                    top: 0,
                    width: 1,
                    height: 1,
                    borderBlockWidth: 1,
                  }}
                />
              </Grid>
              <Grid item sm={9}>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Step Description"
                  placeholder="Cooking Step Description"
                  multiline
                  rows={5}
                  defaultValue={cookingStep ? cookingStep.description : ''}
                />
              </Grid>

              <Grid item sm={1} alignContent={'center'}>
                <DeleteForeverIcon />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
  const renderReviews = (
    <div>
      <Typography variant="subtitle1">Reviews </Typography>
      <Grid container padding={2}>
        {recipeReviews?.map((review: Recipe_review) => (
          <Grid key={review.id} xs={12} paddingBottom={2}>
            <Grid container spacing={1}>
              <Grid xs={10}>
                <Typography variant="h6">
                  {review.creatorId + '//TODO : need to pull the creator name instead'}
                </Typography>
              </Grid>
              <Grid xs={2}>
                <Rating
                  disabled
                  name="Difficulty Label"
                  value={recipe ? review.rating : 0}
                  // onChange={(event, newValue) => {
                  //   onUpdateRecipe({ difficulty: newValue });
                  // }}
                />
              </Grid>
              <Grid xs={2}>
                <Typography variant="body2">{review.updateDatetime.toUTCString()}</Typography>
              </Grid>
              <Grid xs={10}>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Comments"
                  placeholder="Comments"
                  multiline
                  rows={5}
                  disabled
                  defaultValue={review ? review.comments : ''}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Recipes Details for {recipe && recipe.name}
      </Typography>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={5} sm={4}>
            {renderImg}
          </Grid>
          <Grid item xs={7} sm={8}>
            {renderDetails}
          </Grid>
          <Grid item xs={12}>
            {renderIngredients}
          </Grid>
          <Grid item xs={12}>
            {renderCookingSteps}
          </Grid>
          <Grid item xs={12}>
            {renderReviews}
          </Grid>
        </Grid>
      </Card>
      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
