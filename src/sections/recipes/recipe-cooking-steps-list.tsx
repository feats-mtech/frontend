import {
  Typography,
  Collapse,
  Alert,
  IconButton,
  Grid,
  TextField,
  Tooltip,
  Box,
} from '@mui/material';
import React, { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { RecipeCookingStep } from 'src/types/RecipeCookingStep';

export const defaultCookingStep = {
  id: 0,
  recipeId: 0,
  description: '',
  imageUrl: 'No Image',
};
interface RecipeCookingStepListProps {
  editable: boolean;
  recipeCookingSteps: RecipeCookingStep[];
  setRecipeCookingSteps: React.Dispatch<React.SetStateAction<RecipeCookingStep[]>>;
}

export const RecipeCookingStepsList = (props: RecipeCookingStepListProps) => {
  const { editable, recipeCookingSteps, setRecipeCookingSteps } = props;

  const [lastCookingStepNotification, setLastCookingStepNotification] = useState<boolean>(false);
  const addCookingStep = () => {
    setLastCookingStepNotification(false);
    const temp = defaultCookingStep;
    setRecipeCookingSteps([...(recipeCookingSteps || []), temp]);
  };
  const deleteCookingStep = (index: number) => {
    if (recipeCookingSteps?.length === 1) {
      setLastCookingStepNotification(true);
      return;
    }
    setRecipeCookingSteps(recipeCookingSteps?.filter((_, i) => i !== index));
  };

  const setRecipeCookingStepsDetails = (index: number, field: string, value: any) => {
    const temp = recipeCookingSteps ? [...recipeCookingSteps] : [];
    const cookingStep = temp.find((_, i) => i === index);
    if (!cookingStep) {
      return;
    }
    (cookingStep as any)[field] = value;

    setRecipeCookingSteps(temp);
  };
  return (
    <div>
      <Typography variant="subtitle1">
        Cooking Steps List
        {editable && (
          <IconButton disabled={!editable} onClick={addCookingStep}>
            <Iconify icon="solar:add-circle-broken" />
          </IconButton>
        )}
      </Typography>

      <Collapse in={lastCookingStepNotification}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setLastCookingStepNotification(false);
              }}
            >
              <Iconify icon="material-symbols:close" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Must consists of at least 1 step.
        </Alert>
      </Collapse>
      <Grid container padding={2}>
        {recipeCookingSteps?.map((cookingStep: RecipeCookingStep, index) => (
          <Grid item key={index} xs={12} paddingBottom={2}>
            <Grid container spacing={1}>
              <Grid item sm={1}>
                <Typography variant="subtitle1" align="center">
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item sm={2}>
                <Box
                  component="img"
                  alt={cookingStep.imageUrl}
                  src={cookingStep.imageUrl}
                  sx={{
                    top: 0,
                    width: 1,
                    height: 1,
                    borderBlockWidth: 1,
                  }}
                />
              </Grid>
              <Grid item sm={8}>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Step Description"
                  placeholder="Cooking Step Description"
                  multiline
                  rows={5}
                  name="description"
                  disabled={!editable}
                  value={cookingStep ? cookingStep.description : ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setRecipeCookingStepsDetails(index, 'description', event.target.value)
                  }
                />
              </Grid>

              <Grid item sm={1} alignContent={'center'}>
                {editable && (
                  <Tooltip title="Delete">
                    <IconButton disabled={!editable} onClick={() => deleteCookingStep(index)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
