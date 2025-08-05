'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Trophy,
  Users,
  Calendar,
  Target,
  Zap,
  CheckCircle,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme as useThemeStore } from '@/stores/themeStore';
import { usePublicRoute } from '@/hooks/useAuthGuard';

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleMode } = useThemeStore();
  
  // Permitir acesso público
  usePublicRoute();

  const handleOrganizerClick = () => {
    router.push('/auth');
  };

  const handlePlayerClick = () => {
    router.push('/auth?tab=player');
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        {/* Theme Toggle */}
        <IconButton
          onClick={toggleMode}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'white',
            zIndex: 10,
          }}
        >
          {mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem', lg: '7rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #ffffff 30%, #81C784 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ⚽ escala-aí
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem', lg: '2rem' },
              mb: 4,
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Organize sua pelada com inteligência.
            <br />
            Times equilibrados, controle automático e muito mais!
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Trophy />}
              onClick={handleOrganizerClick}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Área do Organizador
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Users />}
              onClick={handlePlayerClick}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Sou Jogador
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" component="h2" gutterBottom>
            Chega de WhatsApp bagunçado!
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Automatize a organização da sua pelada com tecnologia de ponta
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {feature.icon}
                    </Box>
                  }
                  title={
                    <Typography variant="h6" fontWeight={600}>
                      {feature.title}
                    </Typography>
                  }
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it Works */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Como Funciona?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            color: 'white',
            textAlign: 'center',
            py: 6,
          }}
        >
          <CardContent>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              Pronto para revolucionar sua pelada?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Comece agora mesmo e veja como é fácil organizar jogos de futebol com o escala-aí
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Trophy />}
              onClick={handleOrganizerClick}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Começar Agora - Grátis
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" gutterBottom>
            ⚽ escala-aí
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Organize, jogue e conquiste. Sua pelada nunca mais será a mesma.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

// Dados das features
const features = [
  {
    icon: <Users />,
    title: 'Registro Inteligente',
    description: 'Jogadores se cadastram diretamente na pelada. Sistema de aprovação e controle automático de presença no local.',
  },
  {
    icon: <Target />,
    title: 'Times Equilibrados',
    description: 'Algoritmo inteligente monta times baseado na habilidade e ordem de chegada. Sem mais discussão sobre quem vai para qual time!',
  },
  {
    icon: <Zap />,
    title: 'Controle Automático',
    description: 'Time perdedor vai para o fim da fila. Pontuação individual por vitória. Dinâmica de quadra 100% automatizada.',
  },
  {
    icon: <Calendar />,
    title: 'Controle de Tempo',
    description: 'Defina horário de início e fim. O sistema se encarrega de encerrar automaticamente e gerar relatórios completos.',
  },
  {
    icon: <CheckCircle />,
    title: 'Sem Complicação',
    description: 'Interface simples e intuitiva. Funciona em qualquer dispositivo. Seus amigos não precisam baixar nenhum app.',
  },
  {
    icon: <Trophy />,
    title: 'Estatísticas',
    description: 'Acompanhe quem são os maiores vencedores, histórico de confrontos e estatísticas detalhadas de cada pelada.',
  },
];

// Dados dos passos
const steps = [
  {
    title: 'Organize',
    description: 'Crie o jogo definindo data, horário, número de jogadores por time e limite máximo',
  },
  {
    title: 'Registre',
    description: 'Jogadores se cadastram informando o nome da pelada, criando conta e aguardando aprovação',
  },
  {
    title: 'Jogue',
    description: 'Times são montados automaticamente. Controle os resultados e deixe o sistema cuidar do resto',
  },
];