import { useState, useCallback } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { UserFormDetails } from 'src/types/User';
import { registerUser } from 'src/dao/userDao';

export function RegisterView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleRegister = useCallback(async () => {
    const formDetails: UserFormDetails = {
      username,
      password,
      confirmPassword,
      displayName,
      email,
    };

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError(null);

    // Validate password minimum length
    if (password.length < 7) {
      setPasswordError('Password must be at least 7 characters long');
      return;
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError(null);

    setIsLoading(true);
    const result = await registerUser(formDetails);
    if (result.success) {
      setIsLoading(false);
      setResult(true);
      setOpenDialog(true);
    } else {
      setIsLoading(false);
      setResult(false);
    }
  }, [router, username, password]);

  const handleNavigateToSignIn = () => router.push('/sign-in');

  return (
    <>
      <Typography display="flex" variant="h5" alignItems="center">
        Create a new User
      </Typography>
      <hr />
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          required
          fullWidth
          name="name"
          label="Username"
          InputLabelProps={{ shrink: true }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          required
          fullWidth
          name="displayName"
          label="Display Name"
          InputLabelProps={{ shrink: true }}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          required
          fullWidth
          name="email"
          label="Email"
          InputLabelProps={{ shrink: true }}
          value={email}
          error={!!emailError}
          helperText={emailError}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!passwordError}
          helperText={passwordError}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        {result === false && (
          <Typography variant="body2" color="error" sx={{ mb: 3, alignSelf: 'center' }}>
            Registration failed. Please try again.
          </Typography>
        )}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          disabled={!username || !displayName || !password || !confirmPassword || !email}
          onClick={handleRegister}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </LoadingButton>

        <Dialog open={openDialog} onClose={handleNavigateToSignIn}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <DialogContentText>Your account has been successfully created!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNavigateToSignIn} color="primary">
              Back to Sign In
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
