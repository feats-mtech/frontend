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
import { useEffect, useState } from 'react';
import { updateIngredient } from 'src/dao/ingredientDao';
import { useAuth } from 'src/context/AuthContext';

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
  const { user } = useAuth();
  const [ingredientDetails, setIngredientDetails] =
    useState<IngredientRowProps>(selectedIngredient);

  const [loading, setLoading] = useState<boolean>(false);
  const [itemDisplayImage, setDisplayItemImage] = useState('');

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

  const handleFileChange = (e: any | null) => {
    setIngredientDetails({
      ...ingredientDetails,
      image: e.target.files[0],
    });
    setDisplayItemImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handliong change');
    const { name, value } = e.target;
    const lettersOnlyPattern = /^[a-zA-Z0-9\s]*$/;

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
      <Dialog onClose={handleClose} open={open} data-testid="edit-ingredient-dialog">
        <DialogTitle>Edit Ingredient Details for {selectedIngredient.name}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <>
            <ListItem>
              <input type="file" onChange={handleFileChange} />
              <br />
              {itemDisplayImage ? (
                <img src={itemDisplayImage} alt="item" width={200} height={200} />
              ) : (
                <>
                  {ingredientDetails.image && (
                    <img
                      src={`data:image/jpeg;base64,${ingredientDetails.image}`}
                      alt="ingredient"
                      width={200}
                      height={200}
                    />
                  )}
                </>
              )}
            </ListItem>
            <ListItem>
              <TextField
                required
                label="Item"
                name="name"
                value={ingredientDetails.name}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  'data-testid': 'edit-ingredient-name-input',
                }}
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
                inputProps={{
                  'data-testid': 'edit-ingredient-quantity-input',
                }}
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
                  inputProps={{
                    'data-testid': 'edit-ingredient-uom-select',
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
                inputProps={{
                  'data-testid': 'edit-ingredient-expiry-date-input',
                }}
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
                data-testid="save-edit-button"
              >
                {loading ? 'Editing...' : 'Save'}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleClose}
                sx={{ ml: 'auto' }}
                data-testid="cancel-edit-button"
              >
                Cancel
              </Button>
            </ListItem>
          </>
        </List>
      </Dialog>
    </>
  );
};
