import { useState } from 'react';
import { Dialog, DialogTitle, List, ListItem, Typography } from '@mui/material';
import { IngredientRowProps } from './ingredient-table-row';
import { Button } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { deleteIngredient } from 'src/dao/ingredientDao';

interface IngredientDeleteDialogProps {
  open: boolean;
  selectedIngredient: IngredientRowProps;
  handleIsOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIngredientsForUser: () => void;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IngredientDeleteDialog = (props: IngredientDeleteDialogProps) => {
  const {
    handleIsOpenDeleteDialog,
    selectedIngredient,
    open,
    fetchIngredientsForUser,
    setIsSuccess,
    setIsError,
  } = props;

  const [loading, setLoading] = useState(false);

  const handleClose = () => handleIsOpenDeleteDialog(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteIngredient(Number(selectedIngredient.id));

    if (result.success) {
      setIsSuccess(true);
      fetchIngredientsForUser();
    } else {
      setIsError(true);
    }
    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Are you sure you want to delete this ingredient?</DialogTitle>
        <List sx={{ pt: 0 }}>
          <>
            <ListItem>
              <Typography variant="body1">
                <strong>Item Name:</strong> {selectedIngredient.name || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant="body1">
                <strong>Quantity:</strong> {selectedIngredient.quantity || 'N/A'}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography variant="body1">
                <strong>Unit of Measurement:</strong> {selectedIngredient.uom || 'N/A'}
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
    </>
  );
};
