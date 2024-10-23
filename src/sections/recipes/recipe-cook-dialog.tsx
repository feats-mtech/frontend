import { FormEvent, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { Collapse, Alert, Typography } from '@mui/material';

import { RecipeReviewsList } from './recipe-reviews-list';

import { Iconify } from 'src/components/iconify';
import { RecipeReview } from 'src/types/RecipeReview';

interface RecipeCookDialogProps {
  recipeId: number;
}

export default function RecipeCookDialog(props: RecipeCookDialogProps): JSX.Element {
  const { recipeId } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [reviewPostNotification, setReviewPostNotification] = useState<boolean>(false);
  const [recipeReview, setRecipeReview] = useState<RecipeReview[]>([]);

  const handleClickOpen = () => {
    setReviewPostNotification(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCommentsSubmit = () => {
    const temp = recipeReview[0];
    if (temp.rating === 0 && temp.comments === '') {
      //user decide not to submit...
      return;
    } else if (temp.rating > 0 && temp.comments !== '') {
      alert(
        'TODO: send a review to backend with the info of rating of ' +
          temp.rating +
          ', comments of  ' +
          temp.comments,
      );
      setOpen(false);
      return;
    }
    setReviewPostNotification(true);
  };
  return (
    <>
      <Typography variant="h3">
        <Button variant="outlined" onClick={handleClickOpen}>
          <Iconify icon="icon-park-twotone:cook" />
          Post Review
        </Button>
      </Typography>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleCommentsSubmit();
          },
        }}
      >
        <DialogTitle>Post Cook Review</DialogTitle>
        <DialogContent>
          we hope you find the recipe useful. If so, please leave a review.
        </DialogContent>
        <DialogTitle>Post a Review?</DialogTitle>
        <RecipeReviewsList
          creation={true}
          recipeReviews={recipeReview}
          setRecipeReview={setRecipeReview}
          recipeId={recipeId}
        />

        <Collapse in={reviewPostNotification}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setReviewPostNotification(false);
                }}
              >
                <Iconify icon="material-symbols:close" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Please enter both a rating and a comments.
          </Alert>
        </Collapse>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
