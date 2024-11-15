import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ResponseSnackbar } from '../inventory/ingredient-snackbar';
import { Ingredient } from 'src/types/Ingredient';

import { createIngredient } from 'src/dao/ingredientDao';
import { useAuth } from 'src/context/AuthContext';

interface IngredientDetailRowProps {
  label: string;
  ingredientDetail: string;
}

const IngredientDetailRow = ({ label, ingredientDetail }: IngredientDetailRowProps) => {
  return (
    <ListItem>
      <Typography variant="body1">
        <strong>{label}:</strong> {ingredientDetail || 'N/A'}
      </Typography>
    </ListItem>
  );
};

interface ConfirmationDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  ingredient: Ingredient;
  onError: (message: any) => void;
}

export const ConfirmationDialog = ({
  openDialog,
  handleCloseDialog,
  ingredient,
  onError,
}: ConfirmationDialogProps) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await createIngredient(ingredient, user?.id as number);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setIsError(true);
      const errorMessage =
        (result as { success: false; message: string }).message || 'add failed, please retry';
      onError(errorMessage);
    }
    setLoading(false);
    handleCloseDialog();
  };

  const handleCloseSnackbar = () => {
    setIsSuccess(false);
    setIsError(false);
  };
  // console.log('Dialog open state:', openDialog);

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog} data-testid="confirm-dialog">
        <DialogTitle>Confirm Addition</DialogTitle>
        <DialogContent>
          <DialogContentText>Please review the ingredient details.</DialogContentText>
          <br />
          <IngredientDetailRow label="Item Name" ingredientDetail={ingredient.name} />
          <IngredientDetailRow label="Quantity" ingredientDetail={String(ingredient.quantity)} />
          <IngredientDetailRow label="Unit of Measurement" ingredientDetail={ingredient.uom} />
          <IngredientDetailRow label="Expiry Date" ingredientDetail={ingredient.expiryDate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
            data-testid="confirm-button"
          >
            {loading ? 'Creating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      <ResponseSnackbar
        isOpen={isSuccess}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message="Ingredient added successfully!"
        ariaLabel="Ingredient-added-successful"
      />

      <ResponseSnackbar
        isOpen={isError}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Failed to add the ingredient. Please try again."
        ariaLabel="Ingredient-added-failed"
      />
    </>
  );
};
