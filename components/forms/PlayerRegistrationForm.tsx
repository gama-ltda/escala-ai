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
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  SportsFootball,
  CheckCircle,
} from '@mui/icons-material';
import { playerRegistrationSchema, PlayerRegistrationFormData } from '@/lib/validations';
import { registerPlayer } from '@/services/firestore';

interface PlayerRegistrationFormProps {
  onSuccess?: () => void;
}

export function PlayerRegistrationForm({ onSuccess }: PlayerRegistrationFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerRegistrationFormData>({
    resolver: zodResolver(playerRegistrationSchema),
  });

  const onSubmit = async (data: PlayerRegistrationFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      await registerPlayer(data);
      
      setSuccess('Cadastro realizado com sucesso! Aguarde a aprovação do organizador.');
      reset();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar jogador');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <SportsFootball color="primary" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar-se na Pelada
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preencha os dados para participar da pelada
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
            {success}
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

        <TextField
          {...register('peladaName')}
          fullWidth
          label="Nome da Pelada"
          placeholder="Ex: Pelada do João"
          error={!!errors.peladaName}
          helperText={errors.peladaName?.message || 'Digite o nome exato da pelada'}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SportsFootball color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Como funciona:</strong>
            <br />
            1. Preencha seus dados e o nome da pelada
            <br />
            2. Aguarde a aprovação do organizador
            <br />
            3. Após aprovado, você receberá acesso aos jogos
          </Typography>
        </Alert>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ py: 1.5 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Registrar-se na Pelada'
          )}
        </Button>
      </Box>
    </Paper>
  );
}