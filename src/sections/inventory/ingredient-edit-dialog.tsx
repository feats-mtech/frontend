import {
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { IngredientRowProps } from './ingredient-table-row';

import { TextField, Button } from '@mui/material';
import { useState } from 'react';
import { updateIngredient } from 'src/dao/ingredientDao';
import { useUserContext } from 'src/context/UserContext';

interface IngredientEditDialogProps {
  open: boolean;
  selectedIngredient: IngredientRowProps;
  handleIsOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetchIngredientsForUser: () => void;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IngredientEditDialog = (props: IngredientEditDialogProps) => {
  const {
    handleIsOpenEditDialog,
    selectedIngredient,
    open,
    fetchIngredientsForUser,
    setIsSuccess,
    setIsError,
  } = props;
  const { user } = useUserContext();
  const [ingredientDetails, setIngredientDetails] = useState(selectedIngredient);

  const [loading, setLoading] = useState(false);

  const handleClose = () => handleIsOpenEditDialog(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateIngredient(ingredientDetails, user?.id as number);

    if (result.success) {
      setIsSuccess(true);
      fetchIngredientsForUser();
    } else {
      setIsError(true);
    }
    setLoading(false);
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const lettersOnlyPattern = /^[a-zA-Z\s]*$/;

    if (name === 'name' && !lettersOnlyPattern.test(value)) return;

    setIngredientDetails({
      ...ingredientDetails,
      [name]: value,
    });
  };

  const handleUom = (e: SelectChangeEvent<string>) => {
    setIngredientDetails({
      ...ingredientDetails,
      uom: e.target.value,
    });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Edit Ingredient Details for {selectedIngredient.name}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <>
            <ListItem>
              <TextField
                required
                label="Item"
                name="name"
                value={ingredientDetails.name}
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
              <FormControl required fullWidth>
                <InputLabel>Unit of measurement</InputLabel>
                <Select
                  label="Unit of measurement"
                  name="uom"
                  value={ingredientDetails.uom}
                  onChange={handleUom}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="pieces">pieces</MenuItem>
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="l">l</MenuItem>
                  <MenuItem value="ml">ml</MenuItem>
                </Select>
              </FormControl>
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
    </>
  );
};
