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
import { banUser, getAllUsers, unbanUser } from 'src/dao/userDao';
import { User } from 'src/types/User';
import { useAuth } from 'src/context/AuthContext';

export function AdminView() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();

  const fetchAllUsers = useCallback(async () => {
    const users = await getAllUsers();
    setUsers(users);
  }, []);

  const handleBanUnbanUser = async (userId: number, userStatus: number) => {
    // userStatus: 0 = banned, 1 = active
    if (userStatus === 0) {
      await unbanUser(userId);
    } else {
      await banUser(userId);
    }
    fetchAllUsers();
  };

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

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
            {users
              .filter((u) => u.id !== user?.id && u.role !== 1)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={user.status === 0 ? 'error' : 'primary'}
                      onClick={() => handleBanUnbanUser(user.id, user.status)}
                    >
                      {user.status === 0 ? 'Unban' : 'Ban'}
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
