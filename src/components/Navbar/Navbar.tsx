import React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import LogoutIcon from "@mui/icons-material/Logout"
import { AuthContext, AuthContextType } from "../../hooks/useAuth"

interface NavbarProps {
  children?: JSX.Element | JSX.Element[]
}

const Navbar = ({ children }: NavbarProps) => {
  const { user, logout } = React.useContext(AuthContext) as AuthContextType
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleLogout = () => {
    logout()
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar
          sx={{
            flexWrap: "wrap",
            flexDirection: {
              xs: "column",
              sm: "row",
              justifyContent: "center",
            },
            paddingY: { xs: "20px", sm: "0" },
          }}>
          {user && (
            <Box>
              <IconButton
                id='user-menu'
                sx={{
                  marginRight: { sm: "10px" },
                  marginBottom: { xs: "15px", sm: "0" },
                }}
                onClick={handleClick}>
                <AccountCircleIcon fontSize='large' sx={{ color: "#fff" }} />
              </IconButton>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}>
                <MenuItem sx={{ cursor: "default" }}>
                  {user?.userEmail}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography component='span' sx={{ marginRight: "5px" }}>
                    Logout
                  </Typography>
                  <LogoutIcon />{" "}
                </MenuItem>
              </Menu>
            </Box>
          )}
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, marginBottom: { xs: "15px", sm: "0" } }}>
            Product Management
          </Typography>
          {children}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
