import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { RecipeItem } from '../recipe-item';
import { RecipeSort } from '../recipe-sort';
import { RecipeFilters } from '../recipe-filters';

import type { FiltersProps } from '../recipe-filters';
import { Recipe } from 'src/types/Recipe';
import Grid from '@mui/material/Grid';
import { useAuth } from 'src/context/AuthContext';
import { getAllRecipeByCreatorId } from 'src/dao/recipeDao';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const EXISTING_INGREDIENT_OPTIONS = [{ value: 'yes', label: 'Yes' }];

const CATEGORY_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Western', label: 'Western' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Local', label: 'Local' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const COOKING_TIME_OPTIONS = [
  { value: -1, label: 'Any' },
  { value: 30, label: 'Within 30mins' },
  { value: 60, label: 'Within an hour' },
  { value: 2400, label: 'Within a day' },
];

const DIFFICULTY_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const defaultFilters: FiltersProps = {
  existingIngredients: [],
  categories: [CATEGORY_OPTIONS[0].value],
  rating: null,
  cookingTime: COOKING_TIME_OPTIONS[0].value,
  difficulty: null,
};

export function MyRecipesView() {
  const router = useRouter();
  const { user } = useAuth();
  const [allRecipes, setAllRecipe] = useState<Recipe[]>([]);
  let [displayRecipes, setDisplayRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  useEffect(() => {
    //constructor
    getRecipeListById(user?.id);
  }, []);
  const getRecipeListById = useCallback(async (userId: number = -1) => {
    if (userId === -1) {
      return;
    }
    const recipesList = await getAllRecipeByCreatorId(userId);
    setRecipe(recipesList);
  }, []);
  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const setRecipe = (recipeList: Recipe[]) => {
    setAllRecipe(recipeList);
  };
  //used to handle change in filters, any additional logic to the filter need to be done...
  useEffect(() => {
    //need to ensure the filter options is maintained,
    const categories = filters.categories;

    if (categories.length === 0) {
      filters.categories = ['Any'];
    } else if (categories[categories.length - 1] === 'Any') {
      filters.categories = ['Any'];
    } else {
      filters.categories = filters.categories.filter((value) => value !== 'Any');
    }
  }, [filters]);

  //react to changes in recipes, filters, sortBy to update displayRecipes
  useEffect(() => {
    const filteredRecipes = allRecipes.filter(
      (recipe) =>
        (filters.categories.includes('Any') || filters.categories.includes(recipe.cuisine)) &&
        (filters.cookingTime == -1 || filters.cookingTime >= recipe.cookingTimeInSec) &&
        (filters.difficulty == null || filters.difficulty >= recipe.difficultyLevel) &&
        (filters.rating == null || filters.rating <= recipe.rating),
    );

    filteredRecipes.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return a.updateDatetime.getTime() - b.updateDatetime.getTime();
        case 'ratingDesc':
          return b.rating - a.rating;
        case 'difficultDesc':
          return a.difficultyLevel - b.difficultyLevel;
        case 'difficultAsc':
          return b.difficultyLevel - a.difficultyLevel;
        default:
          return 0;
      }
    });
    setDisplayRecipes(filteredRecipes);
  }, [filters, sortBy, allRecipes]);
  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps],
  );

  const goToRecipePage = useCallback(
    (path: number | string) => {
      router.push('/recipes/details/' + path);
    },

    [router],
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        My Recipes
      </Typography>

      <Grid container>
        <Grid item xs={6}>
          <Button variant="outlined" onClick={() => goToRecipePage('new')}>
            <Iconify icon="material-symbols:add" />
            Create Recipe
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
            <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
              <RecipeFilters
                canReset={canReset}
                filters={filters}
                onSetFilters={handleSetFilters}
                openFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
                onResetFilter={() => setFilters(defaultFilters)}
                options={{
                  existingIngredients: EXISTING_INGREDIENT_OPTIONS,
                  categories: CATEGORY_OPTIONS,
                  ratings: RATING_OPTIONS,
                  cookingTime: COOKING_TIME_OPTIONS,
                  difficulty: DIFFICULTY_OPTIONS,
                }}
              />
              <RecipeSort
                sortBy={sortBy}
                onSort={handleSort}
                options={[
                  { value: 'newest', label: 'Newest' },
                  { value: 'ratingDesc', label: 'Highest Rated' },
                  { value: 'difficultDesc', label: 'Difficult:Easy-Hard' },
                  { value: 'difficultAsc', label: 'Difficult:Hard-Easy' },
                ]}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {displayRecipes.length !== 0 ? (
        <Grid container spacing={3}>
          {displayRecipes.map((recipe: Recipe) => (
            <Grid
              key={recipe.id}
              xs={12}
              sm={6}
              md={3}
              padding={1}
              onClick={() => goToRecipePage(recipe.id)}
            >
              <RecipeItem recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6">No recipes found</Typography>
        </Grid>
      )}

      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
