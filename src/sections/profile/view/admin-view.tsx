import { useCallback, useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { getAllUsers } from 'src/dao/userDao';

export function AdminView() {
  const [users, setUsers] = useState([]);

  const fetchAllUsers = useCallback(async () => {
    const users = await getAllUsers();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // TODO: display all users in a table, with buttons to ban/unban users

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Admin
      </Typography>
    </DashboardContent>
  );
}
