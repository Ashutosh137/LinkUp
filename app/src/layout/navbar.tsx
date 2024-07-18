import { AppBar, Box, Typography, Button, Toolbar, IconButton, Stack } from '@mui/material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import InitialStateProps from '../redux/initialprops'
import { useAppDispatch } from '../redux/ḥooks'
import { logout } from '../redux/userdataSlice'
function Navbar() {
  const { isLoggedIn } = useSelector((state: InitialStateProps) => state)
  const dispatch=useAppDispatch()
  return (
    <Box position="fixed" height={20} sx={{ inset: 0, zIndex: 5 }}  >
      <AppBar sx={{ py: 1 }} color='primary' >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Box component={Link} to={"/"} sx={{ flexGrow: 1, textDecoration: "none", color: 'white' }}>
            <Typography variant='h5'>Google Meet</Typography>
          </Box>
          {!isLoggedIn ? <Stack direction={"row"} gap={3}>
            <Box component={Link} sx={{ textDecoration: "none", color: "white" }} to={"register"}> <Button variant='contained' color="inherit">Register</Button></Box>
            <Box component={Link} sx={{ textDecoration: "none", color: "white" }} to={"/login"}> <Button variant='outlined' color="inherit">Login</Button></Box>
          </Stack> :
            <Stack direction={"row"} gap={3}>
              <Box component={Link} sx={{ textDecoration: "none", color: "white" }} to={"/profile"}> <Button variant='outlined' color="inherit">profile</Button></Box>
              <Box  sx={{ textDecoration: "none", color: "white" }}> <Button variant='contained' onClick={()=>{
                dispatch(logout())
              }} color="inherit">Logout</Button></Box>
            </Stack>
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar