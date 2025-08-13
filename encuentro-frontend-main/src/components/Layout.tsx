// src/components/Layout.tsx - ACTUALIZADO
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <EventIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Encuentro
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/events')}
            >
              Eventos
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/create-event')}
                >
                  Crear Evento
                </Button>
                
                {/* NUEVO: Botón para Mis Tickets */}
                <Button
                  color="inherit"
                  startIcon={<TicketIcon />}
                  onClick={() => navigate('/my-tickets')}
                >
                  Mis Tickets
                </Button>
                
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    Perfil
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/my-tickets'); handleClose(); }}>
                    <TicketIcon sx={{ mr: 1 }} />
                    Mis Tickets
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Encuentro - Gestión de Eventos. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;