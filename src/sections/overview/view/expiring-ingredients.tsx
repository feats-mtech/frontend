import { Grid } from '@mui/material';
import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';
import { WidgetSummary } from '../analytics-widget-summary';

interface ExpiringIngredientsProps {
  ingredients: IngredientRowProps[];
}

const ExpiringIngredients = ({ ingredients }: ExpiringIngredientsProps) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetSummary
          title="Ingredients"
          total={ingredients.length}
          color="secondary"
          icon={<img alt="icon" src="/assets/icons/homepage/ic-groceries.svg" />}
          route="inventory"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetSummary
          title="Recipes"
          total={ingredients.length}
          color="secondary"
          icon={<img alt="icon" src="/assets/icons/homepage/ic-recipe.svg" />}
          route="recipes"
        />
      </Grid>
    </Grid>
  );
};

export default ExpiringIngredients;
