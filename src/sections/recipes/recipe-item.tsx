import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';
import Rating from '@mui/material/Rating';

export type RecipeItemProps = {
  id: number;
  creatorId: number;
  name: string;
  imageLink: string;
  description: string;
  cookingTimeInSec: number;
  difficultyLevel: number;
  cuisine: string;
  rating: number;
  status: number;
  createDateTime: Date;
  updateDateTime: Date;
  detailUrl: string;
};

export function RecipeItem({ recipe }: { recipe: RecipeItemProps }) {
  const renderStatus = (
    <Label
      variant="inverted"
      color="info"
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {recipe.cuisine.toString()}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={recipe.name}
      src={recipe.imageLink}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderRating = (
    <Label
      variant="inverted"
      // color="info"
      sx={{
        zIndex: 9,
        top: 16,
        left: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {recipe.rating} <Rating max={1} readOnly value={1}></Rating>
    </Label>
  );
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
        {renderRating}
      </Box>

      <Stack spacing={2} sx={{ p: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {recipe.name}
        </Typography>
        <Typography variant="body2">Difficult: {recipe.difficultyLevel}</Typography>
        <Typography variant="body2">Rating: {recipe.rating}</Typography>
        <Typography variant="body2">
          updateDateTime: {recipe.updateDateTime.toUTCString()}
        </Typography>
        <Typography variant="body2" noWrap>
          Description: {recipe.description}
        </Typography>
      </Stack>
    </Card>
  );
}
