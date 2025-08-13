import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Container,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { eventService } from '../services/eventService';
import { Event, Zone } from '../types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = parseInt(id || '0');

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event>(['event', eventId], () => eventService.getEventById(eventId), {
    enabled: !!eventId,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'cancelado':
        return 'error';
      case 'completado':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility.toLowerCase()) {
      case 'público':
        return 'success';
      case 'privado':
        return 'warning';
      default:
        return 'primary';
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Error al cargar el evento. Por favor, intenta de nuevo.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
          sx={{ mb: 2 }}
        >
          Volver a Eventos
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom>
          {event.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={event.status}
            color={getStatusColor(event.status) as any}
          />
          <Chip
            label={event.visibility}
            color={getVisibilityColor(event.visibility) as any}
            variant="outlined"
          />
          <Chip
            label={event.category}
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Descripción
              </Typography>
              <Typography paragraph>
                {event.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Detalles del evento */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detalles del Evento
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {format(new Date(event.date), 'EEEE, d MMMM yyyy', { locale: es })}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {event.time}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {event.location}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          Capacidad total: {event.totalCapacity} personas
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Organizador
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                ID del organizador: {event.organizerId}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EventIcon />}
                >
                  Reservar Entrada
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                >
                  Compartir Evento
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Zonas del evento */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Zonas Disponibles
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Selecciona la zona que mejor se adapte a tus necesidades
        </Typography>
        
        <Grid container spacing={3}>
          {/* Aquí se mostrarían las zonas del evento */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zona General
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  $25.00
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Capacidad: 100 personas
                </Typography>
                <Button variant="contained" fullWidth>
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zona VIP
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  $50.00
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Capacidad: 50 personas
                </Typography>
                <Button variant="contained" fullWidth>
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Zona Premium
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  $75.00
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Capacidad: 25 personas
                </Typography>
                <Button variant="contained" fullWidth>
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventDetail;

