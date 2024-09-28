import { Dialog, DialogTitle, List, ListItem } from '@mui/material';
import { IngredientRowProps } from './ingredient-table-row';

import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { ResponseSnackbar } from './ingredient-snackbar';

interface IngredientEditDialogProps {
  open: boolean;
  selectedIngredient: IngredientRowProps;
  handleIsOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IngredientEditDialog = (props: IngredientEditDialogProps) => {
  const { handleIsOpenEditDialog, selectedIngredient, open } = props;
  const [ingredientDetails, setIngredientDetails] = useState(selectedIngredient);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClose = () => handleIsOpenEditDialog(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Logic to send edit ingredient request to backend

      // Simulate async edit request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Assuming the edit was successful:
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const lettersOnlyPattern = /^[a-zA-Z\s]*$/;

    if (name === 'item' || name === 'unitOfMeasurement') {
      if (!lettersOnlyPattern.test(value)) return;
    }

    setIngredientDetails({
      ...ingredientDetails,
      [name]: value,
    });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Edit Ingredient Details for {selectedIngredient.item}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <>
            <ListItem>
              <TextField
                required
                label="Item"
                name="item"
                value={ingredientDetails.item}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem>
              <TextField
                required
                type="number"
                placeholder={'e.g. 35'}
                label="Quantity"
                name="quantity"
                value={ingredientDetails.quantity}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem>
              <TextField
                required
                label="Unit of Measurement"
                name="unitOfMeasurement"
                value={ingredientDetails.unitOfMeasurement}
                onChange={handleChange}
                fullWidth
              />
            </ListItem>

            <ListItem>
              <TextField
                required
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Expiry date"
                name="expiryDate"
                value={ingredientDetails.expiryDate.split('T')[0]} // YYYY-MM-DD
                onChange={handleChange}
                fullWidth
              />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mr: 2 }}
                disabled={
                  JSON.stringify(ingredientDetails) === JSON.stringify(selectedIngredient) ||
                  loading
                }
              >
                {loading ? 'Editing...' : 'Save'}
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
        message="Ingredient details saved successfully!"
      />

      <ResponseSnackbar
        isOpen={isError}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Failed to edit the ingredient. Please try again."
      />
    </>
  );
};
