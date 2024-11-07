import { useCallback } from 'react';

import { Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

import { useRouter } from 'src/routes/hooks/use-router';

interface RecommendRecipeContentProps {
  recommendedRecipe: RecipeRowProps[];
}

export type RecipeRowProps = {
  id: number;
  creatorId: number;
  name: string;
  image: string;
  description: string;
  cookingTimeInMin: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;

  createDatetime: Date;
  updateDatetime: Date;
};

const RecommendRecipeContent = ({ recommendedRecipe }: RecommendRecipeContentProps) => {
  const router = useRouter();
  const goToRecipePage = useCallback(
    (path: number | string) => {
      router.push('/recipes/details/' + path);
    },

    [router],
  );
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <h2>Recommend Recipes</h2>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ImageList sx={{ width: 500, height: 450 }}>
          {recommendedRecipe.map((item) => (
            <ImageListItem key={item.image} onClick={() => goToRecipePage(item.id)}>
              <img
                srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.image}?w=248&fit=crop&auto=format`}
                alt={item.name}
                loading="lazy"
              />
              <ImageListItemBar
                title={item.name}
                subtitle={item.description}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${item.name}`}
                  ></IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
    </Grid>
  );
};

export default RecommendRecipeContent;
