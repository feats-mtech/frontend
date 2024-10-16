import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { Collapse, Alert } from '@mui/material';
import { useCallback, useState } from 'react';
import { deleteRecipeById } from 'src/dao/recipeDao';
import { ResponseSnackbar } from '../inventory/ingredient-snackbar';
import { useRouter } from 'src/routes/hooks';

const deleteCode = 'DELETE';
interface RecipeDeleteDialogProps {
  recipeId: number;
}
export default function RecipeDeleteDialog(props: RecipeDeleteDialogProps): JSX.Element {
  const router = useRouter();
  const { recipeId } = props;
  const [open, setOpen] = React.useState(false);
  const [isDeleteFail, setIsDeleteFail] = useState(false);
  const [deleteErrorNotification, setDeleteErrorNotification] = useState<boolean>(false);

  const goToMyRecipePage = useCallback(() => {
    router.push('/my-recipes');
  }, [router]);
  const handleClickOpen = () => {
    setDeleteErrorNotification(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setIsDeleteFail(false);
  };
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
        alert('TODO: delete success but how to display a message while changing page?');
        goToMyRecipePage();
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
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete Recipe
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
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
      </React.Fragment>

      <ResponseSnackbar
        isOpen={isDeleteFail}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Recipe deletion failed"
      />
    </>
  );
}
