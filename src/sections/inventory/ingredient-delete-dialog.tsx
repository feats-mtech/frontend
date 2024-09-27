import { useState } from 'react';
import { Dialog, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { IngredientProps } from './ingredient-table-row';
import { Button } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { ResponseSnackbar } from './ingredient-snackbar';

interface IngredientDeleteDialogProps {
  open: boolean;
  selectedIngredient: IngredientProps;
  handleIsOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IngredientDeleteDialog = (props: IngredientDeleteDialogProps) => {
  const { handleIsOpenDeleteDialog, selectedIngredient, open } = props;

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClose = () => handleIsOpenDeleteDialog(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      // TODO: Logic to send delete ingredient request to backend

      // Simulate async deletion request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Assuming the delete was successful:
      setIsSuccess(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleCloseSnackbar = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Are you sure you want to delete this ingredient?</DialogTitle>
        <List sx={{ pt: 0 }}>
          <>
            <ListItem>
              <Typography variant="body1">
                <strong>Item Name:</strong> {selectedIngredient.item || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant="body1">
                <strong>Quantity:</strong> {selectedIngredient.quantity || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant="body1">
                <strong>Unit of Measurement:</strong>{' '}
                {selectedIngredient.unitOfMeasurement || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant="body1">
                <strong>Expiry Date:</strong> {fDate(selectedIngredient.expiryDate) || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDelete}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? 'Deleting...' : 'Confirm'}
              </Button>
              <Button variant="contained" color="error" onClick={handleClose} sx={{ ml: 'auto' }}>
                Cancel
              </Button>
            </ListItem>
          </>
        </List>
      </Dialog>

      <ResponseSnackbar
        isOpen={isSuccess}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message="Ingredient deleted successfully!"
      />

      <ResponseSnackbar
        isOpen={isError}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Failed to delete the ingredient. Please try again."
      />
    </>
  );
};
