import { FormEvent, useCallback, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { Collapse, Alert } from '@mui/material';

import { ResponseSnackbar } from '../inventory/ingredient-snackbar';

import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

import { deleteRecipeById } from 'src/dao/recipeDao';

const deleteCode = 'DELETE';
interface RecipeDeleteDialogProps {
  recipeId: number;
}
export default function RecipeDeleteDialog(props: RecipeDeleteDialogProps): JSX.Element {
  const router = useRouter();
  const { recipeId } = props;
  const [open, setOpen] = useState(false);
  const [isDeleteFail, setIsDeleteFail] = useState(false);
  const [deleteErrorNotification, setDeleteErrorNotification] = useState<boolean>(false);
  const [openRecipeDeletedSuccessfulDialog, setOpenRecipeDeletedSuccessfulDialog] =
    useState<boolean>(false);

  const handleNavigateToMyRecipe = useCallback(() => {
    router.push('/my-recipes');
  }, [router]);
  const handleClickOpen = () => {
    setDeleteErrorNotification(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCloseSnackbar = () => setIsDeleteFail(false);

  const handleDelete = (codeEntered: string) => {
    if (deleteCode === codeEntered) {
      handleClose();
      deleteRecipe(recipeId);
      setDeleteErrorNotification(false);
    } else {
      setDeleteErrorNotification(true);
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    if (!isNaN(+recipeId)) {
      const result = await deleteRecipeById(+recipeId);

      if (result.success) {
        setOpenRecipeDeletedSuccessfulDialog(true);
      } else {
        setIsDeleteFail(true);
      }

      return;
    } else {
      setIsDeleteFail(true);
    }
  };

  return (
    <>
      <>
        <Button variant="outlined" onClick={handleClickOpen}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete Recipe
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const codeEntered = formJson.code;
              handleDelete(codeEntered);
            },
          }}
        >
          <DialogTitle>Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Confirm Deletion of the recipe, enter {deleteCode} in the field below.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="code"
              name="code"
              label="Delete Code"
              fullWidth
              variant="standard"
            />
          </DialogContent>

          <Collapse in={deleteErrorNotification}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setDeleteErrorNotification(false);
                  }}
                >
                  <Iconify icon="material-symbols:close" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              Deletion error, incorrect code entered.
            </Alert>
          </Collapse>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </>

      <Dialog open={openRecipeDeletedSuccessfulDialog} onClose={handleNavigateToMyRecipe}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Your recipe had been successfully created!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNavigateToMyRecipe} color="primary">
            Back to My Recipe List
          </Button>
        </DialogActions>
      </Dialog>
      <ResponseSnackbar
        isOpen={isDeleteFail}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Recipe deletion failed"
        ariaLabel="Recipe-delete-failed"
      />
    </>
  );
}
