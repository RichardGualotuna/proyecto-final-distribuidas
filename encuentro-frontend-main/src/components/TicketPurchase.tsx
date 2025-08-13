import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  Grid,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Money as CashIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Zone, Event } from '../types';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

interface TicketPurchaseProps {
  open: boolean;
  onClose: () => void;
  zone: Zone;
  event: Event;
  onSuccess?: () => void;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({
  open,
  onClose,
  zone,
  event,
  onSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer' | 'reserve'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  const steps = ['Selección', 'Pago', 'Confirmación'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (paymentMethod === 'reserve') {
        // Crear reservación
        result = await paymentService.reserveTicket(zone.zoneId);
        toast.success('¡Reservación exitosa! Tienes 24 horas para completar el pago.');
      } else {
        // Compra directa
        result = await paymentService.purchaseTicket(zone.zoneId, paymentMethod as 'card' | 'cash' | 'transfer');
        toast.success('¡Compra exitosa! Tu ticket ha sido generado.');
      }
      
      setTicketInfo(result);
      setPurchaseComplete(true);
      handleNext();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error en la compra:', error);
      setError(error.response?.data?.message || 'Error al procesar la compra');
      toast.error('Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setPaymentMethod('card');
    setError('');
    setPurchaseComplete(false);
    setTicketInfo(null);
    onClose();
  };

  const calculateTotal = () => {
    const subtotal = zone.price;
    const taxes = subtotal * 0.12; // 12% IVA
    const total = subtotal + taxes;
    
    return {
      subtotal,
      taxes,
      total
    };
  };

  const { subtotal, taxes, total } = calculateTotal();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {purchaseComplete ? 'Compra Completada' : 'Comprar Entrada'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step 0: Selección */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de tu selección
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(event.date).toLocaleDateString()} - {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.location}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{zone.zoneName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Capacidad: {zone.zoneCapacity} personas
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="primary">
                    ${zone.price.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Desglose del precio
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>IVA (12%)</Typography>
                    <Typography>${taxes.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Step 1: Método de pago */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selecciona el método de pago
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography>Tarjeta de Crédito/Débito</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pago inmediato y seguro
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControlLabel
                      value="transfer"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BankIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography>Transferencia Bancaria</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Confirmación en 24 horas
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>

                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CashIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography>Pago en Efectivo</Typography>
                            <Typography variant="caption" color="text.secondary">
                              En puntos autorizados
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <FormControlLabel
                      value="reserve"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimerIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography>Reservar Ahora, Pagar Después</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Reserva por 24 horas sin pago inmediato
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'card' && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Serás redirigido a una pasarela de pago segura
                </Alert>
              </Box>
            )}

            {paymentMethod === 'transfer' && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Recibirás los datos bancarios por correo electrónico
                </Alert>
              </Box>
            )}

            {paymentMethod === 'cash' && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info">
                  Recibirás un código para pagar en puntos autorizados
                </Alert>
              </Box>
            )}

            {paymentMethod === 'reserve' && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="warning">
                  Tu reserva será válida por 24 horas. Si no completas el pago, se liberará automáticamente.
                </Alert>
              </Box>
            )}
          </Box>
        )}

        {/* Step 2: Confirmación */}
        {activeStep === 2 && purchaseComplete && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            
            <Typography variant="h5" gutterBottom>
              {paymentMethod === 'reserve' ? '¡Reservación Exitosa!' : '¡Compra Exitosa!'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {paymentMethod === 'reserve' 
                ? 'Tu entrada ha sido reservada. Tienes 24 horas para completar el pago.'
                : 'Tu entrada ha sido comprada exitosamente.'}
            </Typography>

            {ticketInfo && (
              <Card sx={{ mt: 3, mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Detalles del Ticket
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Código QR
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {ticketInfo.ticket?.qrCode || ticketInfo.qrCode}
                      </Typography>
                    </Grid>
                    
                    {ticketInfo.reservation && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Reservación #
                          </Typography>
                          <Typography>
                            {ticketInfo.reservation.reservationId}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Expira
                          </Typography>
                          <Typography>
                            {new Date(ticketInfo.reservation.expirationDate).toLocaleString()}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            <Alert severity="success" sx={{ mt: 2 }}>
              Hemos enviado los detalles a tu correo electrónico
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 && (
          <>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleNext}>
              Continuar
            </Button>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Button onClick={handleBack}>Atrás</Button>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : paymentMethod === 'reserve' ? (
                'Reservar'
              ) : (
                'Confirmar Pago'
              )}
            </Button>
          </>
        )}

        {activeStep === 2 && purchaseComplete && (
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TicketPurchase;