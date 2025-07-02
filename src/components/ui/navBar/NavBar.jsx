import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
  Drawer,
  Slide,
  useScrollTrigger,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { MOVIE_LISTS, TOP_LISTS, iconComponents } from '../../../constants';
import Search from '../search/Search';
import { ColorModeContext } from '../../../context/ToggleColorMode';
import { Brightness7, Brightness4 } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../features/authSlice';

const Icon = ({ iconName }) => {
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent /> : null;
};

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavBar = () => {
  const [isOpen, setOpen] = React.useState(false);
  const { mode, toggleColorMode } = React.useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <React.Fragment>
      <HideOnScroll>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ 
            paddingLeft: { xs: 1, sm: 2, md: 4 },
            paddingRight: { xs: 1, sm: 2 }
          }}>
            <IconButton
              color="inherit"
              onClick={handleOpen}
              edge="start"
              sx={{ mr: 1 }}
              size={isMobile ? 'small' : 'medium'}
            >
              <MenuIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography
                sx={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontSize: isMobile ? '1.1rem' : '1.5rem'
                }}
                variant="h1"
                component={RouterLink}
                to="/"
              >
                RAXAT-CINEMA
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? 1 : 2 
              }}>
                {!isMobile && <Search />}
                <IconButton 
                  color="inherit" 
                  onClick={toggleColorMode}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {mode === 'dark' ? <Brightness7 fontSize={isMobile ? 'small' : 'medium'} /> : <Brightness4 fontSize={isMobile ? 'small' : 'medium'} />}
                </IconButton>
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Toolbar />

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? 200 : 250,
            boxSizing: 'border-box',
            zIndex: (theme) => theme.zIndex.appBar,
            mt: '64px',
            height: 'calc(100vh - 64px)',
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <List>
            {TOP_LISTS.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.url}
                  onClick={handleOpen}
                  sx={{ py: isMobile ? 0.5 : 1 }}
                >
                  <ListItemIcon sx={{ minWidth: isMobile ? 36 : 48 }}>
                    <Icon iconName={item.icon} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {MOVIE_LISTS.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.url}
                  onClick={handleOpen}
                  sx={{ py: isMobile ? 0.5 : 1 }}
                >
                  <ListItemIcon sx={{ minWidth: isMobile ? 36 : 48 }}>
                    <Icon iconName={item.icon} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default NavBar;