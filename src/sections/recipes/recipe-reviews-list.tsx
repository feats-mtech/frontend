import React, { useEffect } from 'react';

import { Typography, Grid, TextField, Rating } from '@mui/material';

import { RecipeReview } from 'src/types/RecipeReview';
import { useAuth } from 'src/context/AuthContext';
import { fDateTime } from 'src/utils/format-time';

export const defaultRecipeReview = {
  id: -1,
  recipeId: -1,
  creatorId: -1,
  rating: 0,
  createDatetime: new Date(),
  updateDatetime: new Date(),
  comments: '',
};
interface RecipeReviewsListProps {
  creation?: boolean;
  recipeReviews: RecipeReview[];
  setRecipeReview: React.Dispatch<React.SetStateAction<RecipeReview[]>>;
  recipeId: number;
}

export const RecipeReviewsList = (props: RecipeReviewsListProps) => {
  const { creation, recipeReviews, setRecipeReview, recipeId } = props;
  const { user } = useAuth();

  useEffect(() => {
    //constructor
    if (creation) {
      const temp = defaultRecipeReview;
      temp.recipeId = recipeId;
      temp.creatorId = user ? user.id : -1;
      setRecipeReview([...[], temp]);
    }
  }, []);

  const setReviewDetails = (index: number, field: string, value: any) => {
    const temp = recipeReviews ? [...recipeReviews] : [];
    const reviewRecord = temp.find((_, i) => i === index);
    if (!reviewRecord) {
      return;
    }
    (reviewRecord as any)[field] = value;

    setRecipeReview(temp);
  };

  return (
    <div>
      {!creation && <Typography variant="subtitle1">Reviews </Typography>}
      {recipeReviews?.length === 0 ? (
        <Typography variant="body2">No Reviews </Typography>
      ) : (
        <Grid container padding={2}>
          {recipeReviews?.map((review: RecipeReview, index) => (
            <Grid key={review.id} xs={12} paddingBottom={2}>
              <Grid container spacing={1}>
                <Grid item xs={9}>
                  {/* TODO : need to pull the creator name instead */}
                  {/* <Typography variant="h6">
                        {review.creatorId + ''}
                      </Typography> */}
                </Grid>
                <Grid xs={2}>
                  <Rating
                    disabled={!creation}
                    name="Difficulty Label"
                    value={review ? review.rating : 0}
                    onChange={(event, newValue) => {
                      setReviewDetails(index, 'rating', newValue);
                    }}
                  />
                </Grid>
                <Grid xs={2}>
                  <Typography variant="body2">{fDateTime(review.updateDatetime)}</Typography>
                </Grid>
                <Grid xs={10}>
                  <TextField
                    fullWidth={true}
                    id="outlined-textarea"
                    label="Comments"
                    placeholder="Comments"
                    multiline
                    rows={5}
                    disabled={!creation}
                    value={review ? review.comments : ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setReviewDetails(index, 'comments', event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};
