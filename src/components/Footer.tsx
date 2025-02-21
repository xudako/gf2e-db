import { Box, Typography, Container, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        textAlign: 'center',
      }}
    >
      <Container>
        <Typography variant="body2">
          This site is a fan project and is not affiliated with or endorsed by MICA Team. All game assets © MICA Team (Sunborn Network Technology).
        </Typography>
        <Typography variant="body2">
          Powered by{' '}
          <Link href="https://react.dev" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecoration: 'underline' }}>
            React
          </Link>{' '}
          &{' '}
          <Link href="https://vite.dev" target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecoration: 'underline' }}>
            Vite
          </Link>.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;