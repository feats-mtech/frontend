import { Dialog, DialogTitle, List, ListItem } from '@mui/material';
import { IngredientProps } from './ingredient-table-row';

import { TextField, Button } from '@mui/material';
import { useState } from 'react';

export interface SimpleDialogProps {
  open: boolean;
  selectedIngredient: IngredientProps;
  handleIsOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IngredientEditDialog = (props: SimpleDialogProps) => {
  const { handleIsOpenEditDialog, selectedIngredient, open } = props;
  const [ingredientDetails, setIngredientDetails] = useState(selectedIngredient);

  const handleClose = () => handleIsOpenEditDialog(false);

  const handleSave = () => {
    // TODO: Logic to save the updated ingredient details to backend

    // TODO: implement loading spinner while waiting for response

    // TODO: await response before proceeding. if error, show error message
    handleIsOpenEditDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIngredientDetails({
      ...ingredientDetails,
      [name]: value,
    });
  };

  return (
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
              value={ingredientDetails.expiryDate}
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
              disabled={JSON.stringify(ingredientDetails) === JSON.stringify(selectedIngredient)}
            >
              Save
            </Button>
            <Button variant="contained" color="error" onClick={handleClose} sx={{ ml: 'auto' }}>
              Cancel
            </Button>
          </ListItem>
        </>
      </List>
    </Dialog>
  );
};
