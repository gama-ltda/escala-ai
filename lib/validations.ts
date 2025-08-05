import { z } from 'zod';

// Validações para autenticação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: 'Formato de telefone inválido. Use (11) 99999-9999',
    }),
  role: z.enum(['admin', 'player'], {
    required_error: 'Selecione um tipo de usuário',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Validações para pelada
export const createPeladaSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  address: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional(),
  playersPerTeam: z
    .number()
    .min(3, 'Mínimo de 3 jogadores por time')
    .max(11, 'Máximo de 11 jogadores por time')
    .int('Número deve ser inteiro'),
  maxPlayers: z
    .number()
    .min(6, 'Mínimo de 6 jogadores total')
    .max(50, 'Máximo de 50 jogadores total')
    .int('Número deve ser inteiro'),
}).refine((data) => data.maxPlayers >= data.playersPerTeam * 2, {
  message: 'Número máximo deve ser pelo menos o dobro de jogadores por time',
  path: ['maxPlayers'],
});

// Validações para jogo
export const createGameSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  gameDate: z
    .date({
      required_error: 'Data do jogo é obrigatória',
      invalid_type_error: 'Data inválida',
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Data não pode ser no passado',
    }),
  startTime: z
    .string()
    .min(1, 'Horário de início é obrigatório')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  endTime: z
    .string()
    .min(1, 'Horário de término é obrigatório')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido (HH:MM)'),
  observations: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),
  peladaId: z
    .string()
    .min(1, 'Pelada é obrigatória'),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.startTime}:00`);
  const end = new Date(`2000-01-01T${data.endTime}:00`);
  return end > start;
}, {
  message: 'Horário de término deve ser posterior ao de início',
  path: ['endTime'],
});

// Validações para registro de jogador
export const playerRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: 'Formato de telefone inválido. Use (11) 99999-9999',
    }),
  peladaName: z
    .string()
    .min(3, 'Nome da pelada deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da pelada deve ter no máximo 100 caracteres'),
});

// Validações para nível de habilidade do jogador (admin apenas)
export const playerSkillSchema = z.object({
  playerId: z.string().min(1, 'ID do jogador é obrigatório'),
  skillLevel: z
    .number()
    .min(1, 'Nível mínimo é 1')
    .max(5, 'Nível máximo é 5')
    .int('Nível deve ser um número inteiro'),
});

// Validações para resultado de partida
export const matchResultSchema = z.object({
  matchId: z.string().min(1, 'ID da partida é obrigatório'),
  winner: z.enum(['team_a', 'team_b', 'draw'], {
    required_error: 'Resultado é obrigatório',
  }),
});

// Validações para gol
export const goalSchema = z.object({
  matchId: z.string().min(1, 'ID da partida é obrigatório'),
  playerId: z.string().min(1, 'ID do jogador é obrigatório'),
  team: z.enum(['team_a', 'team_b'], {
    required_error: 'Time é obrigatório',
  }),
  minute: z
    .number()
    .min(0, 'Minuto não pode ser negativo')
    .max(999, 'Minuto inválido')
    .int('Minuto deve ser um número inteiro'),
});

// Validações para check-in de jogador
export const checkInSchema = z.object({
  gameId: z.string().min(1, 'ID do jogo é obrigatório'),
  playerId: z.string().min(1, 'ID do jogador é obrigatório'),
});

// Validações para atualização de perfil
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: 'Formato de telefone inválido. Use (11) 99999-9999',
    }),
});

// Tipos derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreatePeladaFormData = z.infer<typeof createPeladaSchema>;
export type CreateGameFormData = z.infer<typeof createGameSchema>;
export type PlayerRegistrationFormData = z.infer<typeof playerRegistrationSchema>;
export type PlayerSkillFormData = z.infer<typeof playerSkillSchema>;
export type MatchResultFormData = z.infer<typeof matchResultSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
export type CheckInFormData = z.infer<typeof checkInSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;