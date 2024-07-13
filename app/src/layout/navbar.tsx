import { AppBar, Box, Typography, Button, Toolbar, IconButton } from '@mui/material'
function Navbar() {
  return (
    <Box position="fixed" height={20} sx={{ inset: 0 }}  >
      <AppBar color='primary' >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Google meet
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar