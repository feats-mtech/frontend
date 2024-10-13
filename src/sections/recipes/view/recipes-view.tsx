import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { getCall } from 'src/hooks/axios/useAxios';
import { RecipeItem } from '../recipe-item';
import { RecipeSort } from '../recipe-sort';
import { CartIcon } from '../recipe-cart-widget';
import { RecipeFilters } from '../recipe-filters';

import type { FiltersProps } from '../recipe-filters';
import { Recipe } from 'src/types/Recipe';

const EXISTING_INGREDIENT_OPTIONS = [{ value: 'yes', label: 'Yes' }];

// TODO: explore whether can I get the avaiable options for each filtering category from the backend.
// TODO: add logic to disable Any if any other option is selected..
// TODO: selecting Any will disable others too.
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

const defaultFilters = {
  existingIngredients: [EXISTING_INGREDIENT_OPTIONS[0].value],
  categories: [CATEGORY_OPTIONS[0].value],
  rating: null,
  cookingTime: COOKING_TIME_OPTIONS[0].value,
  difficulty: null,
};

export function RecipesView() {
  const router = useRouter();
  const [allRecipes, setAllRecipe] = useState<Recipe[]>([]);
  let [displayRecipes, setDisplayRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  useEffect(() => {
    //constructor

    const recipesList = getCall('/api/recipes') as unknown as Recipe[];
    if (recipesList) {
      clearRecipe();
      setRecipe(recipesList);
    }
  }, []);

  const handleOpenFilter = useCallback(() => {
    console.log('open filter');
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    console.log('close filter');

    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    console.log('sort by ' + newSort);
    setSortBy(newSort);
  }, []);

  var index = 1;
  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
    console.log('set filter');
    console.log('set... filters.categories ' + filters.categories);
  }, []);

  const clearRecipe = () => {
    setAllRecipe([]);
    setDisplayRecipes([]);
  };
  const setRecipe = (recipeList: Recipe[]) => {
    setAllRecipe(recipeList);
    setDisplayRecipes(recipeList);
  };
  const addRecipe = (reciptObject: Recipe) => {
    setAllRecipe((allRecipes) => [...allRecipes, reciptObject]);
    setDisplayRecipes((displayRecipes) => [...displayRecipes, reciptObject]);
  };
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
      switch (sortBy) {
        case 'newest':
          return a.updateDateTime.getTime() - b.updateDateTime.getTime();
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
  // function goToRecipePage(recipeId: string): void {
  //   const router = useRouter();
  //   console.log('Navigating to the desired page... for recipe' + recipeId);
  //   // Implement your logic here to navigate to the desired page
  //   console.log('Navigating to the desired page...');

  //   const goToRecipePage = useCallback((path: string) => router.push(path), [router]);
  // }

  const goToRecipePage = useCallback(
    (path: number) => {
      alert('path is' + path);
      router.push('details/' + path);
    },
    [router],
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Recipes
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
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

      <Grid container spacing={3}>
        {displayRecipes.map((recipe: Recipe) => (
          <Grid key={recipe.id} xs={12} sm={6} md={3} onClick={() => goToRecipePage(recipe.id)}>
            <RecipeItem recipe={recipe} />
          </Grid>
        ))}
      </Grid>

      {/* <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
    </DashboardContent>
  );
}
