import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Avatar from "@mui/material/Avatar"
import { blue } from "@mui/material/colors"
import Search from "./Search"

interface NavbarProps {
  handleSignInClick: () => void
  isLoggedIn: boolean
}

const Navbar = ({ handleSignInClick, isLoggedIn }: NavbarProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          {isLoggedIn ? (
            <Avatar sx={{ bgcolor: blue[900], marginRight: "10px" }}>U</Avatar>
          ) : (
            <IconButton
              sx={{ marginRight: "10px" }}
              onClick={handleSignInClick}>
              <AccountCircleIcon fontSize='large' sx={{ color: "#fff" }} />
            </IconButton>
          )}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <Search />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
