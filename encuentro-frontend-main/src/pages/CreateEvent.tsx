import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { eventService } from '../services/eventService';
import { CreateEventData } from '../types';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [error, setError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventData>({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      totalCapacity: 0,
      visibility: 'público',
      zones: [
        {
          zoneName: '',
          price: 0,
          zoneCapacity: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'zones',
  });

  const createEventMutation = useMutation(eventService.createEvent, {
    onSuccess: () => {
      toast.success('Evento creado exitosamente');
      navigate('/events');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al crear el evento';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error completo:', error.response?.data);
    },
  });

  const onSubmit = (data: CreateEventData) => {
    setError('');
    
    // Validaciones adicionales
    if (!user) {
      setError('Debes estar autenticado para crear un evento');
      toast.error('Debes estar autenticado para crear un evento');
      return;
    }

    // Validar que el token esté presente
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      toast.error('Sesión expirada');
      navigate('/login');
      return;
    }

    // Formatear los datos antes de enviar
    const formattedData = {
      ...data,
      totalCapacity: Number(data.totalCapacity),
      organizerId: user.userId,
    };

    console.log('Usuario autenticado:', user);
    console.log('Datos a enviar:', formattedData);
    createEventMutation.mutate(formattedData);
  };

  const categories = [
    'Conferencia',
    'Concierto',
    'Deportes',
    'Educativo',
    'Entretenimiento',
    'Networking',
    'Tecnología',
    'Otro',
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Crear Nuevo Evento
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Completa la información para crear tu evento
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Información básica del evento */}
            <Typography variant="h5" gutterBottom>
              Información del Evento
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: 'El título es requerido',
                    minLength: {
                      value: 3,
                      message: 'El título debe tener al menos 3 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Título del Evento"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: 'La descripción es requerida',
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Descripción"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    required: 'La fecha es requerida',
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Fecha del Evento"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = date.toISOString().split('T')[0];
                          field.onChange(formattedDate);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="time"
                  control={control}
                  rules={{
                    required: 'La hora es requerida',
                  }}
                  render={({ field }) => (
                    <TimePicker
                      label="Hora del Evento"
                      value={field.value ? new Date(`2000-01-01T${field.value}`) : null}
                      onChange={(time) => {
                        if (time) {
                          const formattedTime = time.toTimeString().slice(0, 8);
                          field.onChange(formattedTime);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.time,
                          helperText: errors.time?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={control}
                  rules={{
                    required: 'La ubicación es requerida',
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ubicación"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  rules={{
                    required: 'La categoría es requerida',
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category}>
                      <InputLabel>Categoría</InputLabel>
                      <Select {...field} label="Categoría">
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="totalCapacity"
                  control={control}
                  rules={{
                    required: 'La capacidad es requerida',
                    min: {
                      value: 1,
                      message: 'La capacidad debe ser mayor a 0',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Capacidad Total"
                      error={!!errors.totalCapacity}
                      helperText={errors.totalCapacity?.message}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="visibility"
                  control={control}
                  rules={{
                    required: 'La visibilidad es requerida',
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.visibility}>
                      <InputLabel>Visibilidad</InputLabel>
                      <Select {...field} label="Visibilidad">
                        <MenuItem value="público">Público</MenuItem>
                        <MenuItem value="privado">Privado</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/events')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createEventMutation.isLoading}
              >
                {createEventMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Crear Evento'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default CreateEvent;