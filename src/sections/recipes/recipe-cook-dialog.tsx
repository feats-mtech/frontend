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
import { submitReviews } from 'src/dao/reviewDao';

interface RecipeCookDialogProps {
  recipeId: number;
  getRecipeFromServer: () => void;
}

export default function RecipeCookDialog(props: RecipeCookDialogProps): JSX.Element {
  const { recipeId, getRecipeFromServer } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [reviewEntryFailNotification, setReviewEntryFailNotification] = useState<boolean>(false);
  const [reviewPostFailNotification, setReviewPostFailNotification] = useState<boolean>(false);

  const [recipeReview, setRecipeReview] = useState<RecipeReview[]>([]);

  const handleClickOpen = () => {
    setReviewEntryFailNotification(false);
    setReviewPostFailNotification(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCommentsSubmit = async () => {
    setReviewEntryFailNotification(false);
    setReviewPostFailNotification(false);
    const temp = recipeReview[0];
    if ((temp.rating === 0 || temp.rating === null) && temp.comments === '') {
      //user decide not to submit...
      setOpen(false);
      return;
    }
    //disable review related code.
    if (temp.rating > 0 && temp.comments !== '') {
      const result = await submitReviews(temp);
      if (result) {
        setOpen(false);
        getRecipeFromServer();
      } else {
        setReviewPostFailNotification(true);
      }
      return;
    }
    setReviewEntryFailNotification(true);
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
          We hope you find the recipe useful! If so, please leave a review.
        </DialogContent>
        <DialogTitle>Post a Review?</DialogTitle>
        <RecipeReviewsList
          creation={true}
          recipeReviews={recipeReview}
          setRecipeReview={setRecipeReview}
          recipeId={recipeId}
        />

        <Collapse in={reviewPostFailNotification}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setReviewPostFailNotification(false);
                }}
              >
                <Iconify icon="material-symbols:close" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Review functionality disabled. Please try again later.
          </Alert>
        </Collapse>
        <Collapse in={reviewEntryFailNotification}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setReviewEntryFailNotification(false);
                }}
              >
                <Iconify icon="material-symbols:close" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Please enter both a rating and comments.
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
