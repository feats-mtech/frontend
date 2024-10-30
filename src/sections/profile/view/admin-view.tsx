import { useCallback, useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllUsers } from 'src/dao/userDao';
import { User } from 'src/types/User';

export function AdminView() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchAllUsers = useCallback(async () => {
    const users = await getAllUsers();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // TODO: remove or undefined type when implemented in backend
  const handleBanUnbanUser = async (userId: number, isBanned: boolean | undefined) => {
    // TODO: call ban or unban from dao
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Admin
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.isBanned ? 'secondary' : 'primary'}
                    onClick={() => handleBanUnbanUser(user.id, user.isBanned)}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardContent>
  );
}
