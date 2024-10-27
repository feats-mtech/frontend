import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export type FiltersProps = {
  existingIngredients: string[];
  categories: string[];
  rating: number | null;
  cookingTime: number;
  difficulty: number | null;
};

type RecipeFiltersProps = {
  canReset: boolean;
  openFilter: boolean;
  filters: FiltersProps;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onResetFilter: () => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
  options: {
    existingIngredients: { value: string; label: string }[];
    categories: { value: string; label: string }[];
    ratings: string[];
    cookingTime: { value: number; label: string }[];
    difficulty: string[];
  };
};
export function RecipeFilters({
  filters,
  options,
  canReset,
  openFilter,
  onSetFilters,
  onOpenFilter,
  onCloseFilter,
  onResetFilter,
}: RecipeFiltersProps) {
  const renderExistingIngredients = (
    <Stack spacing={1}>
      {/* <Typography variant="subtitle2">Existing Ingredients //TODO</Typography> */}
      <FormGroup>
        {/* {options.existingIngredients.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={filters.existingIngredients.includes(option.value)}
                onChange={() => {
                  const checked = filters.existingIngredients.includes(option.value)
                    ? filters.existingIngredients.filter((value) => value !== option.value)
                    : [...filters.existingIngredients, option.value];

                  onSetFilters({ existingIngredients: checked });
                }}
              />
            }
            label={option.label}
          />
        ))} */}
      </FormGroup>
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Category</Typography>
      <FormGroup>
        {options.categories.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={filters.categories.includes(option.value)}
                onChange={() => {
                  const checked = filters.categories.includes(option.value)
                    ? filters.categories.filter((value) => value !== option.value)
                    : [...filters.categories, option.value];

                  onSetFilters({ categories: checked });
                }}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderRating = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Rating
      </Typography>
      <Box>
        <Rating
          name="Rating Label"
          value={filters.rating}
          onChange={(event, newValue) => {
            onSetFilters({ rating: newValue });
          }}
        />{' '}
        & Above
      </Box>
    </Stack>
  );

  const renderCookingTime = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Cooking Time</Typography>
      <RadioGroup>
        {options.cookingTime.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                checked={filters.cookingTime === Number(option.value)}
                onChange={() => onSetFilters({ cookingTime: option.value })}
              />
            }
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  const renderDifficulty = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Difficulty
      </Typography>
      <Box>
        <Rating
          name="Difficulty Label"
          value={filters.difficulty}
          onChange={(event, newValue) => {
            onSetFilters({ difficulty: newValue });
          }}
        />{' '}
        & easier
      </Box>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpenFilter}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, overflow: 'hidden' },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
          <Typography variant="h6" flexGrow={1}>
            Filters
          </Typography>

          <IconButton onClick={onResetFilter}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:refresh-linear" />
            </Badge>
          </IconButton>

          <IconButton onClick={onCloseFilter}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderExistingIngredients}
            {renderCategory}
            {renderRating}
            {renderCookingTime}
            {renderDifficulty}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
