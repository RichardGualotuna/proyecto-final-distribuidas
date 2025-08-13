// src/pages/EventDetail.tsx - ACTUALIZADO CON ELIMINAR
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
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
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  PersonAdd as PersonAddIcon,
  AttachMoney as MoneyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { eventService } from '../services/eventService';
import { Event, Zone } from '../types';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const eventId = parseInt(id || '0');
  
  // Estados para la reserva y eliminación
  const [reservationDialog, setReservationDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [shareDialog, setShareDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = useQuery<Event>(['event', eventId], () => eventService.getEventById(eventId), {
    enabled: !!eventId,
    retry: 2,
  });

  const {
    data: zones = [],
    isLoading: zonesLoading,
    error: zonesError,
    refetch: refetchZones,
  } = useQuery<Zone[]>(['zones', eventId], () => eventService.getEventZones(eventId), {
    enabled: !!eventId,
    retry: 2,
  });

  // Mutación para eliminar evento
  const deleteEventMutation = useMutation(eventService.deleteEvent, {
    onSuccess: () => {
      toast.success('Evento eliminado exitosamente');
      navigate('/events');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al eliminar el evento';
      toast.error(errorMessage);
      console.error('Error al eliminar evento:', error.response?.data);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'success';
      case 'cancelled':
      case 'cancelado':
        return 'error';
      case 'completed':
      case 'completado':
        return 'default';
      default:
        return 'primary';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility.toLowerCase()) {
      case 'public':
      case 'público':
        return 'success';
      case 'private':
      case 'privado':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, d MMMM yyyy', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };

  const isEventActive = () => {
    if (!event) return false;
    const eventDate = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    return isAfter(eventDate, now) && event.status.toLowerCase() === 'active';
  };

  const isEventSoon = () => {
    if (!event) return false;
    const eventDate = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    return isAfter(eventDate, now) && isBefore(eventDate, threeDaysFromNow);
  };

  const isOwner = () => {
    return user && event && user.userId === event.organizerId;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const canDeleteEvent = () => {
    return isOwner() || isAdmin();
  };

  const handleReservation = (zone: Zone) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }
    
    setSelectedZone(zone);
    setReservationDialog(true);
  };

  const handleShare = () => {
    setShareDialog(true);
  };

  const handleDeleteEvent = () => {
    setDeleteDialog(true);
  };

  const confirmDeleteEvent = () => {
    if (eventId) {
      deleteEventMutation.mutate(eventId);
    }
    setDeleteDialog(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Enlace copiado al portapapeles');
    setShareDialog(false);
  };

  const getTotalZonesCapacity = () => {
    return zones.reduce((total, zone) => total + zone.zoneCapacity, 0);
  };

  const getAveragePrice = () => {
    if (zones.length === 0) return 0;
    return zones.reduce((total, zone) => total + zone.price, 0) / zones.length;
  };

  const getPriceRange = () => {
    if (zones.length === 0) return { min: 0, max: 0 };
    const prices = zones.map(zone => zone.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  if (eventLoading) {
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

  if (eventError || !event) {
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
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
          {isEventSoon() && (
            <Chip
              label="¡Próximamente!"
              color="warning"
              size="small"
            />
          )}
          {isOwner() && (
            <Chip
              label="Tu evento"
              color="info"
              size="small"
            />
          )}
          {isAdmin() && (
            <Chip
              label="Admin"
              color="secondary"
              size="small"
            />
          )}
        </Box>

        {/* Información rápida */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(event.date)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Hora
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatTime(event.time)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {event.location}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Capacidad
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {event.totalCapacity} personas
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
                Estadísticas del Evento
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <EventIcon />
                    </Avatar>
                    <Typography variant="h6">{zones.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Zonas disponibles
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6">{getTotalZonesCapacity()}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Capacidad zonas
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                      <MoneyIcon />
                    </Avatar>
                    <Typography variant="h6">${getAveragePrice().toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precio promedio
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                      <LocationIcon />
                    </Avatar>
                    <Typography variant="h6">{event.category}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categoría
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Evento
              </Typography>
              
              {zones.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Rango de Precios
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ${getPriceRange().min.toFixed(2)} - ${getPriceRange().max.toFixed(2)}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Organizador
                </Typography>
                <Typography variant="body1">
                  ID: {event.organizerId}
                </Typography>
                {isOwner() && (
                  <Chip label="Eres el organizador" color="success" size="small" sx={{ mt: 1 }} />
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isEventActive() && !isOwner() && (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EventIcon />}
                    onClick={() => zones.length > 0 ? handleReservation(zones[0]) : toast.error('No hay zonas disponibles')}
                    disabled={zones.length === 0}
                  >
                    Reservar Entrada
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                >
                  Compartir Evento
                </Button>
                
                {isAuthenticated && !isOwner() && (
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<BookmarkIcon />}
                  >
                    Guardar Evento
                  </Button>
                )}
                
                {isOwner() && (
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PersonAddIcon />}
                    >
                      Ver Asistentes
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/events/${eventId}/edit`)}
                    >
                      Editar Evento
                    </Button>
                  </>
                )}
                
                {/* NUEVO: Botón de eliminar para propietarios y administradores */}
                {canDeleteEvent() && (
                  <Button
                    variant="outlined"
                    fullWidth
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteEvent}
                    disabled={deleteEventMutation.isLoading}
                  >
                    {deleteEventMutation.isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Eliminar Evento'
                    )}
                  </Button>
                )}
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
        
        {zonesLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : zonesError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No se pudieron cargar las zonas del evento.
          </Alert>
        ) : zones.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay zonas configuradas para este evento
            </Typography>
            <Typography color="text.secondary">
              El organizador aún no ha configurado las zonas de entrada.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {zones.map((zone) => (
              <Grid item xs={12} sm={6} md={4} key={zone.zoneId}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {zone.zoneName}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      ${zone.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Capacidad: {zone.zoneCapacity} personas
                    </Typography>
                    <Button variant="contained" fullWidth>
                      Seleccionar
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Resumen de zonas */}
        {zones.length > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Zonas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Total de zonas: {zones.length}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Capacidad total: {zones.reduce((sum, zone) => sum + zone.zoneCapacity, 0)} personas
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Precio promedio: ${zones.length > 0 ? (zones.reduce((sum, zone) => sum + zone.price, 0) / zones.length).toFixed(2) : '0.00'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Dialog de confirmación para eliminar evento */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          ¿Confirmar eliminación del evento?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            ¿Estás seguro de que quieres eliminar el evento "{event.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer. Se eliminarán todas las zonas asociadas y reservas existentes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteEvent} 
            color="error" 
            variant="contained"
            disabled={deleteEventMutation.isLoading}
          >
            {deleteEventMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              'Eliminar Evento'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para compartir */}
      <Dialog
        open={shareDialog}
        onClose={() => setShareDialog(false)}
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title">
          Compartir Evento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Comparte este evento con tus amigos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {window.location.href}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>
            Cerrar
          </Button>
          <Button onClick={copyToClipboard} variant="contained">
            Copiar Enlace
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetail;