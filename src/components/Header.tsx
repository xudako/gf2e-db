import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const isMenuActive = ["/calculator", "/stages", "/story"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Home */}
        <IconButton
          component={NavLink}
          to="/"
          edge="start"
          sx={{ mr: 2, color: "inherit" }}
          disableRipple
        >
          <img
            src={`${import.meta.env.BASE_URL}images/default.png`}
            alt="Logo"
            style={{ height: 40, width: 40 }}
          />
        </IconButton>

        <Button
          component={NavLink}
          to="/"
          sx={{
            color: "inherit",
            flexGrow: 1,
            display: "block",
          }}
          disableRipple
        >
          GF2E-DB
        </Button>

        <Stack direction="row" spacing={2}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Desktop Button */}
          <Button
            component={NavLink}
            to="/dolls"
            sx={{
              color: "inherit",
              display: { xs: "none", sm: "inline-flex" },
              "&.active": {
                color: "secondary.main",
                fontWeight: "bold",
              },
            }}
          >
            Dolls
          </Button>
          <Button
            component={NavLink}
            to="/weapons"
            sx={{
              color: "inherit",
              display: { xs: "none", sm: "inline-flex" },
              "&.active": {
                color: "secondary.main",
                fontWeight: "bold",
              },
            }}
          >
            Weapons
          </Button>
          <Button
            component={NavLink}
            to="/enemies"
            sx={{
              color: "inherit",
              display: { xs: "none", sm: "inline-flex" },
              "&.active": {
                color: "secondary.main",
                fontWeight: "bold",
              },
            }}
          >
            Enemies
          </Button>
          <Button
            color="inherit"
            id="tools-button"
            onClick={handleOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              ...(isMenuActive && {
                color: "secondary.main",
                fontWeight: "bold",
              }),
            }}
          >
            Tools
          </Button>
        </Stack>
        <Menu
          id="tools"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            component={NavLink}
            to="/calculator"
            onClick={handleClose}
            sx={{
              "&.active": {
                backgroundColor: "secondary.light",
              },
            }}
          >
            Calculator
          </MenuItem>
          <MenuItem
            component={NavLink}
            to="/stages"
            onClick={handleClose}
            sx={{
              "&.active": {
                backgroundColor: "secondary.light",
              },
            }}
          >
            Stages
          </MenuItem>
          <MenuItem
            component={NavLink}
            to="/story"
            onClick={handleClose}
            sx={{
              "&.active": {
                backgroundColor: "secondary.light",
              },
            }}
          >
            Stages
          </MenuItem>
        </Menu>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          <List>
            <ListItem
              component={NavLink}
              to="/"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Home" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/dolls"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Dolls" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/weapons"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Weapons" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/enemies"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Enemies" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/calculator"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Calculator" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/stages"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Stages" sx={{ color: "white" }} />
            </ListItem>
            <ListItem
              component={NavLink}
              to="/story"
              onClick={handleDrawerToggle}
              sx={{
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <ListItemText primary="Story" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
