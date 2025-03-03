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

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  //add new password rules
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const lengthValid = newPassword.length >= 8;
    const upperCaseValid = /[A-Z]/.test(newPassword);
    const lowerCaseValid = /[a-z]/.test(newPassword);
    const numberValid = /\d/.test(newPassword);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    let errors: string[] = [];

    if (!lengthValid) {
      errors.push('At least 8 characters');
    }
    if (!upperCaseValid) {
      errors.push('At least one uppercase letter');
    }
    if (!lowerCaseValid) {
      errors.push('At least one lowercase letter');
    }
    if (!numberValid) {
      errors.push('At least one number');
    }
    if (!specialCharValid) {
      errors.push('At least one special character');
    }

    if (errors.length > 0) {
      setPasswordStrength(`Password must include: ${errors.join(', ')}`);
    } else {
      setPasswordStrength(null);
    }
  };

  const handleRegister = useCallback(async () => {
    const formDetails: UserFormDetails = {
      username,
      password,
      confirmPassword,
      displayName,
      email,
    };

    // validate email
    const emailRegex = /^(.+)@(.+){2,}\.(.+){2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (passwordStrength) {
      setPasswordError(passwordStrength);
      return;
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

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
  }, [
    router,
    username,
    password,
    confirmPassword,
    displayName,
    email,
    emailError,
    passwordError,
    setOpenDialog,
  ]);

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
          error={!!emailError}
          helperText={emailError}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
          }}
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
          error={!!passwordError}
          helperText={passwordError || passwordStrength}
          value={password}
          onChange={handlePasswordChange}
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
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError(null);
          }}
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
