import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { authService } from '../services/authService';
import { eventService } from '../services/eventService';
import { useAuthStore } from '../stores/authStore';
import { User, Event } from '../types';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery<User>('profile', authService.getProfile, {
    enabled: !!user,
  });

  const {
    data: myEvents = [],
    isLoading: eventsLoading,
  } = useQuery<Event[]>('myEvents', eventService.getMyEvents, {
    enabled: !!user,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<User>>({
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
    },
  });

  const updateProfileMutation = useMutation(authService.updateProfile, {
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Error al actualizar el perfil');
      toast.error('Error al actualizar el perfil');
    },
  });

  const onSubmit = (data: Partial<User>) => {
    setError('');
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  if (profileLoading) {
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

  if (profileError || !profile) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Error al cargar el perfil. Por favor, intenta de nuevo.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Gestiona tu información personal y eventos
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Información del perfil */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Chip label={profile.role} color="primary" size="small" />
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {isEditing ? (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{
                        required: 'El nombre es requerido',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Nombre"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{
                        required: 'El apellido es requerido',
                        minLength: {
                          value: 2,
                          message: 'El apellido debe tener al menos 2 caracteres',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Apellido"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1">
                    {profile.firstName} {profile.lastName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {profile.email}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rol
                  </Typography>
                  <Typography variant="body1">
                    {profile.role}
                  </Typography>
                </Box>

                <Button variant="contained" onClick={handleEdit}>
                  Editar Perfil
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Mis eventos */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Mis Eventos
            </Typography>
            
            {eventsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : myEvents.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary" gutterBottom>
                  No has creado eventos aún
                </Typography>
                <Button variant="outlined" href="/create-event">
                  Crear Mi Primer Evento
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {myEvents.length} evento{myEvents.length !== 1 ? 's' : ''} creado{myEvents.length !== 1 ? 's' : ''}
                </Typography>
                
                {myEvents.slice(0, 3).map((event) => (
                  <Card key={event.eventId} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {event.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={event.status} size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {event.date}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                
                {myEvents.length > 3 && (
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Ver Todos Mis Eventos
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;

