'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
} from '@mui/icons-material';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { useAuthActions } from '@/stores/authStore';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuthActions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'player',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signUp(data);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Criar Conta
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Junte-se ao escala-aí e organize suas peladas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register('name')}
        fullWidth
        label="Nome completo"
        autoComplete="name"
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register('email')}
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register('phone')}
        fullWidth
        label="Telefone (opcional)"
        placeholder="(11) 99999-9999"
        autoComplete="tel"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone color="action" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl component="fieldset" error={!!errors.role} sx={{ mb: 2, width: '100%' }}>
        <FormLabel component="legend">Tipo de usuário</FormLabel>
        <RadioGroup
          {...register('role')}
          value={watchedRole}
          row
          sx={{ mt: 1 }}
        >
          <FormControlLabel
            value="admin"
            control={<Radio />}
            label="Organizador"
          />
          <FormControlLabel
            value="player"
            control={<Radio />}
            label="Jogador"
          />
        </RadioGroup>
        {errors.role && (
          <FormHelperText>{errors.role.message}</FormHelperText>
        )}
      </FormControl>

      {watchedRole === 'admin' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Como organizador, você poderá criar peladas, gerenciar jogadores e controlar jogos.
        </Alert>
      )}

      {watchedRole === 'player' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Como jogador, você poderá se inscrever em peladas e participar dos jogos.
        </Alert>
      )}

      <TextField
        {...register('password')}
        fullWidth
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register('confirmPassword')}
        fullWidth
        label="Confirmar senha"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Criar Conta'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Já tem uma conta?{' '}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToLogin}
            sx={{ fontWeight: 600, textDecoration: 'none' }}
          >
            Entrar
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}