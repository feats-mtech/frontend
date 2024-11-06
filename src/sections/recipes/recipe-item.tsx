import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid';

import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import { useRouter } from 'src/routes/hooks/use-router';
import { fNumber } from 'src/utils/format-number';

export type RecipeItemProps = {
  id: number;
  creatorId: number;
  name: string;
  image: string;
  description: string;
  cookingTimeInSec: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;
  draftRecipe: RecipeItemProps | null;
  createDatetime: Date;
  updateDatetime: Date;
};

export function RecipeItem({ recipe }: { recipe: RecipeItemProps }) {
  const router = useRouter();
  const getGaugeColor = (value: string) => {
    switch (value) {
      case '1':
        return '#daf48f';
      case '2':
        return '#63f510';
      case '3':
        return '#f1f510';
      case '4':
        return '#f58610';
      case '5':
        return '#f52810';
    }
  };
  const renderCuisine = (
    <Label
      variant="inverted"
      color="info"
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {recipe.cuisine.toString()}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={recipe.name}
      src={recipe.image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        ml: 0.5,
        cursor: 'pointer',
        objectFit: 'cover',
        position: 'absolute',
      }}
      onClick={() => goToRecipePage(recipe.id)}
    />
  );

  const renderRating = (
    <Label
      variant="inverted"
      color="warning"
      sx={{
        zIndex: 9,
        top: 16,
        left: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {fNumber(recipe.rating)} <Rating max={1} readOnly value={1} />
    </Label>
  );
  const renderDraftStatus = recipe.draftRecipe && (
    <Label
      variant="inverted"
      color="secondary"
      sx={{
        zIndex: 9,
        bottom: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      Unpublished Changes
    </Label>
  );

  const goToRecipePage = useCallback(
    (path: number | string) => {
      router.push('/recipes/details/' + path);
    },

    [router],
  );
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderCuisine}
        {renderImg}
        {renderRating}
        {renderDraftStatus}
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Grid container alignItems={'center'}>
          <Grid item xs={10}>
            <Typography variant="subtitle1" noWrap>
              {recipe.name}
            </Typography>
          </Grid>
          <Grid item xs={2} justifyContent="flex-end">
            <Gauge
              {...{
                height: 50,
                width: 50,
                value: recipe.difficultyLevel,
                valueMax: 5,
                startAngle: -70,
                endAngle: 70,
                cornerRadius: 1,
              }}
              cornerRadius="50%"
              sx={(theme) => ({
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 10,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill: getGaugeColor(`${recipe.difficultyLevel}`),
                },
              })}
            />
          </Grid>
        </Grid>
        <Typography variant="body1">{recipe.description}</Typography>

        <Typography variant="caption" textAlign={'right'}>
          Last Updated: {fDateTime(recipe.updateDatetime)}
        </Typography>
      </Stack>
    </Card>
  );
}
