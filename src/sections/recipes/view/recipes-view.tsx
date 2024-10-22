import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { RecipeItem } from '../recipe-item';
import { RecipeSort } from '../recipe-sort';
import { RecipeFilters } from '../recipe-filters';
import type { FiltersProps } from '../recipe-filters';
import {
  CATEGORY_OPTIONS,
  COOKING_TIME_OPTIONS,
  DEFAULT_FILTERS,
  DIFFICULTY_OPTIONS,
  EXISTING_INGREDIENT_OPTIONS,
  RATING_OPTIONS,
} from '../recipes-filter-config';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import { Recipe } from 'src/types/Recipe';
import { Iconify } from 'src/components/iconify';

import { getAllPublishedRecipe } from 'src/dao/recipeDao';

export function RecipesView() {
  const router = useRouter();
  const [allRecipes, setAllRecipe] = useState<Recipe[]>([]);
  const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState('Newest');

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(DEFAULT_FILTERS);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState<boolean>(false);

  useEffect(() => {
    getRecipeList();
  }, []);

  const getRecipeList = useCallback(async () => {
    const recipesList = await getAllPublishedRecipe();
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

  const setRecipe = (recipeList: Recipe[]) => setAllRecipe(recipeList);

  //used to handle change in filters, any additional logic to the filter need to be done...
  useEffect(() => {
    //need to ensure the filter options is maintained,
    const categories = filters.categories;

    if (categories.length === 0) {
      filters.categories = ['Any'];
    } else if (categories[categories.length - 1] === 'Any') {
      //the last selected item is any, thus only Any will be selected
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
      switch (sortBy.toLowerCase()) {
        case 'newest':
          return b.updateDatetime.getTime() - a.updateDatetime.getTime();
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
    (key) => filters[key as keyof FiltersProps] !== DEFAULT_FILTERS[key as keyof FiltersProps],
  );
  // function goToRecipePage(recipeId: string): void {
  //   const router = useRouter();
  //   console.log('Navigating to the desired page... for recipe' + recipeId);
  //   // Implement your logic here to navigate to the desired page
  //   console.log('Navigating to the desired page...');

  //   const goToRecipePage = useCallback((path: string) => router.push(path), [router]);
  // }

  const goToRecipePage = useCallback(
    (path: number | string) => {
      router.push('/recipes/details/' + path);
    },

    [router],
  );

  const handleCloseSnackbar = () => {
    setIsDeletedSuccess(false);
  };
  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Recipes List
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
                onResetFilter={() => setFilters(DEFAULT_FILTERS)}
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
            <Grid item key={recipe.id} xs={12} sm={8} md={4} padding={1}>
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
