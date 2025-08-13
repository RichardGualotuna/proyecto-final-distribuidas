import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      title: 'Crear Eventos',
      description: 'Organiza eventos increíbles con nuestra plataforma intuitiva',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Gestionar Asistentes',
      description: 'Controla la asistencia y gestiona las reservas fácilmente',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: 'Múltiples Zonas',
      description: 'Configura diferentes zonas con precios y capacidades',
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 40 }} />,
      title: 'Calendario Integrado',
      description: 'Visualiza todos tus eventos en un calendario organizado',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?event)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography variant="h2" color="inherit" gutterBottom>
                Encuentro
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                La plataforma definitiva para crear y gestionar eventos increíbles.
                Conecta personas, organiza experiencias únicas y haz que cada
                momento sea memorable.
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/create-event')}
                    sx={{ mr: 2 }}
                  >
                    Crear Mi Primer Evento
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{ mr: 2 }}
                    >
                      Registrarse
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ color: 'white', borderColor: 'white' }}
                    >
                      Iniciar Sesión
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Características Principales
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Todo lo que necesitas para crear eventos exitosos
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            ¿Listo para crear tu próximo evento?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Únete a miles de organizadores que ya confían en Encuentro
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Explorar Eventos
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

