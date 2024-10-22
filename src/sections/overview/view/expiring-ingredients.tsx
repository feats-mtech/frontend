import { Grid } from '@mui/material';
import { IngredientRowProps } from 'src/sections/inventory/ingredient-table-row';
import { WidgetSummary } from '../analytics-widget-summary';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { addDays, isBefore } from 'date-fns';

interface ExpiringIngredientsProps {
  ingredients: IngredientRowProps[];
}

const ExpiringIngredients = ({ ingredients }: ExpiringIngredientsProps) => {
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);

  useEffect(() => {
    setFilteredIngredients(ingredients);
  }, [ingredients]);

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

      <Grid item xs={12}>
        <h2>Expiring Ingredients</h2>
        <TextField
          select
          defaultValue={365}
          label="Filter by Expiry"
          style={{ width: '200px' }}
          SelectProps={{ native: true }}
          onChange={(e) => {
            const today = new Date();
            let filterDate;
            switch (e.target.value) {
              case '1':
                filterDate = addDays(today, 1);
                break;
              case '3':
                filterDate = addDays(today, 3);
                break;
              case '7':
                filterDate = addDays(today, 7);
                break;
              case '28':
                filterDate = addDays(today, 28);
                break;
              case '365':
                filterDate = addDays(today, 365);
                break;
              default:
                filterDate = addDays(today, 365);
            }
            const filtered = ingredients.filter((ingredient) =>
              isBefore(new Date(ingredient.expiryDate), filterDate),
            );
            setFilteredIngredients(filtered);
          }}
        >
          <option value="1">1 Day</option>
          <option value="3">3 Days</option>
          <option value="7">1 Week</option>
          <option value="28">1 Month</option>
          <option value="365">1 Year</option>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ingredient</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit of Measurement</TableCell>
                <TableCell>Expiration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIngredients.map((ingredient, index) => (
                <TableRow key={index}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.quantity}</TableCell>
                  <TableCell>{ingredient.uom}</TableCell>
                  <TableCell>{ingredient.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default ExpiringIngredients;
