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

interface ConfirmationDialogProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  itemName: string;
  quantity: string;
  unitOfMeasurement: string;
  expiryDate: string;
  handleSubmit: (event: React.FormEvent) => void;
}

export const ConfirmationDialog = ({
  openDialog,
  handleCloseDialog,
  itemName,
  quantity,
  unitOfMeasurement,
  expiryDate,
  handleSubmit,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Confirm Addition</DialogTitle>
      <DialogContent>
        <DialogContentText>Please review the ingredient details.</DialogContentText>
        <br />

        <ListItem>
          <Typography variant="body1">
            <strong>Item Name:</strong> {itemName || 'N/A'}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1">
            <strong>Quantity:</strong> {quantity || 'N/A'}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1">
            <strong>Unit of Measurement:</strong> {unitOfMeasurement || 'N/A'}
          </Typography>
        </ListItem>

        <ListItem>
          <Typography variant="body1">
            <strong>Expiry Date:</strong> {expiryDate || 'N/A'}
          </Typography>
        </ListItem>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
