import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { useAuth } from 'src/context/AuthContext';

export function SignInView() {
  const router = useRouter();
  const { loginUser, loginUserByGoogle, getLoginUserDetails } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [result, setResult] = useState<boolean | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    //TODO: passive call upon page load to check for user authentication status, currently working for google login, need to implement it for normal login....
    console.log('try to get if the person is login or not.....');
    const result = getLoginUserDetails();
    console.log('result for login user details:', result);
    // if (result.success) {
    //   setResult(true);
    //   router.push('/');
    // }
    // setStatusCode(result.statusCode);
    // setResult(false);
  }, []);

  const handleSignIn = useCallback(async () => {
    const result = await loginUser(username, password);
    if (result.success) {
      setResult(true);
      router.push('/');
    }
    setStatusCode(result.statusCode);
    setResult(false);
  }, [router, username, password]);

  const handleGoogleSignIn = useCallback(async () => {
    loginUserByGoogle();
  }, [router]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') handleSignIn();
  };

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
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
        />

        {result === false && (
          <Typography variant="body2" color="error" sx={{ mb: 3, alignSelf: 'center' }}>
            Invalid username/password. Please try again.
          </Typography>
        )}

        {result === false && statusCode === 403 && (
          <Typography variant="body2" color="error" sx={{ mb: 3, alignSelf: 'center' }}>
            Your account has been banned. Please contact the administrator.
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
        <LoadingButton
          fullWidth
          size="large"
          type="button"
          color="primary"
          variant="outlined"
          startIcon={
            <img src="/google-icon.svg" alt="Google Logo" style={{ width: 24, height: 24 }} />
          }
          style={{ marginTop: 20 }}
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </LoadingButton>
      </Box>
    </>
  );
}
