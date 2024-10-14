import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/context/UserContext';

export function SignInView() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<boolean | null>(null);

  const handleSignIn = useCallback(async () => {
    const result = await loginUser(username, password);
    if (result.success) {
      setResult(true);
      router.push('/');
    }
    setResult(false);
  }, [router, username, password]);

  const navigateToRegisterPage = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link
            variant="subtitle2"
            sx={{ ml: 0.5, cursor: 'pointer' }}
            onClick={navigateToRegisterPage}
          >
            Get started
          </Link>
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="username"
          label="Username"
          InputLabelProps={{ shrink: true }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>

        <TextField
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

        {result === false && (
          <Typography variant="body2" color="error" sx={{ mb: 3, alignSelf: 'center' }}>
            Invalid username/password. Please try again.
          </Typography>
        )}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
        >
          Sign in
        </LoadingButton>
      </Box>
    </>
  );
}
