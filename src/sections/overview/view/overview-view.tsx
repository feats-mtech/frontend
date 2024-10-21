import { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import ExpiringIngredients from './expiring-ingredients';

import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';
import { getIngredientsByUser } from 'src/dao/ingredientDao';
import { mapToIngredientRowProps } from 'src/sections/inventory/utils';
import { useAuth } from 'src/context/AuthContext';

export function OverviewView() {
  const { user } = useAuth();

  const [ingredients, setIngredients] = useState<IngredientRowProps[]>([]);

  const fetchIngredientsForUser = useCallback(async () => {
    const ingredients = await getIngredientsByUser(user?.id as number);
    setIngredients(mapToIngredientRowProps(ingredients));
  }, []);

  useEffect(() => {
    fetchIngredientsForUser();
  }, [fetchIngredientsForUser]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back {user?.displayName} 👋
      </Typography>

      <Grid>
        <Grid xs={12} md={6} lg={4}>
          <ExpiringIngredients ingredients={ingredients} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
