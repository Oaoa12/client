import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './ui/navBar/NavBar';
import Footer from './ui/footer/Footer';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 0.5, sm: 1 },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;