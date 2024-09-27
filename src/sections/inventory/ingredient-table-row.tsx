import React from 'react';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';
import { getDaysLeft } from 'src/utils/format-expiry';
import { fDate } from 'src/utils/format-time';
import { IngredientEditDialog } from './ingredient-edit-dialog';
import { IngredientDeleteDialog } from './ingredient-delete-dialog';

export type IngredientProps = {
  id: string;
  item: string;
  unitOfMeasurement: string;
  consumeBy: string;
  expiryDate: string;
  quantity: number;
  avatarUrl: string;
  isVerified: boolean;
};

type IngredientTableRowProps = {
  row: IngredientProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function IngredientTableRow({ row, selected, onSelectRow }: IngredientTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [isOpenEditDialog, handleIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, handleIsOpenDeleteDialog] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setOpenPopover(null);
    handleIsOpenEditDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenPopover(null);
    handleIsOpenDeleteDialog(true);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.item} src={row.avatarUrl} />
            {row.item}
          </Box>
        </TableCell>

        <TableCell>{row.quantity}</TableCell>

        <TableCell>{row.unitOfMeasurement}</TableCell>

        <TableCell>{getDaysLeft(row.consumeBy)} days</TableCell>

        <TableCell>{fDate(row.expiryDate)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleCloseEditDialog}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleCloseDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
      <IngredientEditDialog
        selectedIngredient={row}
        open={isOpenEditDialog}
        handleIsOpenEditDialog={handleIsOpenEditDialog}
      />
      <IngredientDeleteDialog
        selectedIngredient={row}
        open={isOpenDeleteDialog}
        handleIsOpenDeleteDialog={handleIsOpenDeleteDialog}
      />
    </>
  );
}
