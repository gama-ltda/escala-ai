'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExitToApp,
  Person,
  Settings,
} from '@mui/icons-material';
import { useAuth, useAuthActions } from '@/stores/authStore';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, hasAccess } = useAuthGuard();
  const { signOut } = useAuthActions();

  // Redirecionar baseado na role do usuário
  useEffect(() => {
    if (user && hasAccess) {
      if (user.role === 'admin' || user.role === 'master_admin') {
        router.replace('/dashboard/admin');
      } else if (user.role === 'player') {
        router.replace('/dashboard/player');
      }
    }
  }, [user, hasAccess, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading || !hasAccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={48} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bem-vindo, {user?.name}!
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleSignOut}
        >
          Sair
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">Perfil</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email: {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tipo: {user?.role === 'admin' ? 'Organizador' : 'Jogador'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Telefone: {user?.phone || 'Não informado'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1 }} />
                <Typography variant="h6">Configurações</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Personalize sua experiência no escala-aí
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DashboardIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Próximos Passos</Typography>
              </Box>
              
              {user?.role === 'admin' || user?.role === 'master_admin' ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Como organizador, você pode:
                  </Typography>
                  <ul>
                    <li>Criar e gerenciar peladas</li>
                    <li>Aprovar jogadores</li>
                    <li>Organizar jogos e formar times</li>
                    <li>Controlar resultados das partidas</li>
                  </ul>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Criar Nova Pelada
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Como jogador, você pode:
                  </Typography>
                  <ul>
                    <li>Se registrar em peladas</li>
                    <li>Fazer check-in nos jogos</li>
                    <li>Ver seus times e partidas</li>
                    <li>Acompanhar suas estatísticas</li>
                  </ul>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Buscar Peladas
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}