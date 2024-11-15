import React, { useEffect } from 'react';
import { useState, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { IngredientTableRow } from '../ingredient-table-row';
import { IngredientTableHead } from '../ingredient-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { IngredientTableToolbar } from '../ingredient-table-toolbar';
import { emptyRows, applyFilter, getComparator, mapToIngredientRowProps } from '../utils';

import type { IngredientRowProps } from '../ingredient-table-row';
import { getIngredientsByUser } from 'src/dao/ingredientDao';
import { useTable } from 'src/components/table';
import { ResponseSnackbar } from '../ingredient-snackbar';
import { useAuth } from 'src/context/AuthContext';

export function InventoryView() {
  const { user } = useAuth();
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState<string>('');
  const [ingredients, setIngredients] = useState<IngredientRowProps[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchIngredientsForUser = useCallback(async () => {
    const ingredients = await getIngredientsByUser(user?.id as number);
    setIngredients(mapToIngredientRowProps(ingredients));
  }, []);

  useEffect(() => {
    fetchIngredientsForUser();
  }, [fetchIngredientsForUser]);

  const dataFiltered: IngredientRowProps[] = applyFilter({
    inputData: ingredients,
    comparator: getComparator(table.order, table.orderBy),
    filterItem: filterName,
  });

  const handleCloseSnackbar = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  const notFound = !dataFiltered.length && !!filterName;

  const handleClickItem = useCallback((path: string) => router.push(path), [router]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Inventory
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleClickItem('new')}
        >
          New ingredient
        </Button>
      </Box>

      <Card>
        <IngredientTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <IngredientTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={ingredients.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    ingredients.map((user) => user.id),
                  )
                }
                headLabel={[
                  { id: 'item', label: 'Item' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'unitOfMeasurement', label: 'UOM' },
                  { id: 'consumeBy', label: 'Consume By' },
                  { id: 'expiryDate', label: 'Expiry Date' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage,
                  )
                  .map((row) => (
                    <IngredientTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      fetchIngredientsForUser={fetchIngredientsForUser}
                      setIsSuccess={setIsSuccess}
                      setIsError={setIsError}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, ingredients.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={ingredients.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <ResponseSnackbar
        isOpen={isSuccess}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="success"
        message="Ingredient deleted successfully!"
        ariaLabel="Ingredient-delete-success"
      />

      <ResponseSnackbar
        isOpen={isError}
        handleCloseSnackbar={handleCloseSnackbar}
        severity="error"
        message="Failed to delete the ingredient. Please try again."
        ariaLabel="Ingredient-delete-failed"
      />
    </DashboardContent>
  );
}
