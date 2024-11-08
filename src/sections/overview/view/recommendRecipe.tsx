import { useCallback } from 'react';
import { Button, Grid } from '@mui/material';

import { useRouter } from 'src/routes/hooks/use-router';
import Carousel from 'react-material-ui-carousel';

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
    <>
      <h2>Recommend Recipes</h2>
      <Carousel>
        {recommendedRecipe.map((item, i) => (
          <Grid container key={i}>
            <Grid item xs={12} md={6} lg={4}>
              <img
                srcSet={`${item.image}`}
                src={`${item.image}`}
                width={350}
                height={350}
                alt={item.name}
                loading="lazy"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Button className="CheckButton" onClick={() => goToRecipePage(item.id)}>
                Check it out!
              </Button>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
            </Grid>
          </Grid>
        ))}
      </Carousel>
    </>
  );
};

export default RecommendRecipeContent;
