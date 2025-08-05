'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  ArrowBack,
} from '@mui/icons-material';
import { LoginForm } from '@/components/forms/LoginForm';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { PlayerRegistrationForm } from '@/components/forms/PlayerRegistrationForm';
import { useAuth } from '@/stores/authStore';
import { useTheme as useThemeStore } from '@/stores/themeStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { isAuthenticated, initialized } = useAuth();
  const { mode, toggleMode } = useThemeStore();
  
  // Determinar tab inicial baseado na URL
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    switch (tab) {
      case 'register':
        return 1;
      case 'player':
        return 2;
      default:
        return 0; // login
    }
  };

  const [tabValue, setTabValue] = useState(getInitialTab());

  // Redirecionar se já autenticado
  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, initialized, router]);

  // Atualizar URL quando tab muda
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    const tabParam = newValue === 1 ? 'register' : newValue === 2 ? 'player' : 'login';
    const newUrl = newValue === 0 ? '/auth' : `/auth?tab=${tabParam}`;
    router.replace(newUrl);
  };

  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (!initialized) {
    return null; // ou loading spinner
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleGoHome} color="primary">
          <ArrowBack />
        </IconButton>
        
        <IconButton onClick={toggleMode} color="primary">
          {mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          centered={!isMobile}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label="Entrar" id="auth-tab-0" />
          <Tab label="Criar Conta" id="auth-tab-1" />
          <Tab label="Sou Jogador" id="auth-tab-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setTabValue(1)}
            onForgotPassword={() => {
              // TODO: Implementar recuperação de senha
              console.log('Forgot password clicked');
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setTabValue(0)}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PlayerRegistrationForm
            onSuccess={() => {
              // Mostrar mensagem de sucesso e redirecionar
              setTimeout(() => {
                router.push('/auth?tab=login');
              }, 2000);
            }}
          />
        </TabPanel>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Box
          component="span"
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ⚽ escala-aí
        </Box>
      </Box>
    </Container>
  );
}