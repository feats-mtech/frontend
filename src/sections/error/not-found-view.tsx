import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';
import { SimpleLayout } from 'src/layouts/simple';

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sorry, page not found!
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-404.svg"
          sx={{
            width: 100,
            height: 100,
            my: { xs: 2, sm: 5 },
          }}
        />

        <Typography sx={{ color: 'text.secondary' }}>
          We couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL?
        </Typography>

        <Button
          sx={{ my: 2 }}
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          color="inherit"
        >
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
