import React from 'react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ResponseSnackbar } from 'src/sections/inventory/ingredient-snackbar';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { Ingredient } from 'src/types/Ingredient';

export function InventoryCreateView() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState('');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: 'success' | 'error'; // Updated to allow 'error'
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  const ingredientDetails: Ingredient = {
    name: itemName,
    quantity: quantity,
    uom: unitOfMeasurement,
    expiryDate: expiryDate,
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Add a new ingredient
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:back" />}
          onClick={() => navigate('../inventory')}
        >
          Back
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={3} sm={12}>
            <TextField
              required
              placeholder={'e.g. banana'}
              fullWidth
              label="Item name"
              value={itemName}
              onChange={(e) => {
                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                setItemName(lettersOnly);
              }}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              type="number"
              placeholder={'e.g. 35'}
              required
              fullWidth
              label="Quantity"
              value={quantity}
              InputProps={{
                inputProps: { min: 0 },
              }}
              onKeyDown={(event) => {
                if (event?.key === '-' || event?.key === '+') {
                  event.preventDefault();
                }
              }}
              onChange={(e) => setQuantity(+e.target.value)}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <FormControl required fullWidth>
              <InputLabel>Unit of measurement</InputLabel>
              <Select
                label="Unit of measurement"
                value={unitOfMeasurement}
                name="unit"
                onChange={(e) => setUnitOfMeasurement(e.target.value)}
                inputProps={{
                  'aria-label': 'unit of measurement', //add
                }}
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
          </Grid>
          <Grid item xs={3} sm={12}>
            <TextField
              required
              label="Expiry date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            disabled={!itemName || !quantity || !unitOfMeasurement || !expiryDate}
          >
            Add Ingredient
          </Button>
        </Box>
      </Box>

      <ConfirmationDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        ingredient={ingredientDetails}
        onError={(message) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: 'Failed to add the ingredient. Please try again.',
          });
        }}
      />

      <ResponseSnackbar
        isOpen={snackbar.open}
        handleCloseSnackbar={handleCloseSnackbar}
        severity={snackbar.severity}
        message={snackbar.message}
        ariaLabel="Ingredient-created"
      />
    </DashboardContent>
  );
}
