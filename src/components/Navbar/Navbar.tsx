import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { Search } from "./Search"

export const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton sx={{ marginRight: "10px" }}>
            <AccountCircleIcon fontSize='large' sx={{ color: "#fff" }} />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <Search />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
