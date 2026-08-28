export type Role = 'parent' | 'therapist' | 'school' | 'admin';

export interface ChildInfo {
  id?: string;
  name: string;
  parents: string;
  birth: string;
  birthDateFull: string;
  age: string;
  diagnosis: string;
  photoUrl?: string;
  bloodType: string;
  emergencyContact: string;
  allergies: string;
  schoolId?: string;
  schoolName?: string;
  grade?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildLink {
  childId: string;
  parents: string[]; // user IDs or emails
  professionals: string[]; // user IDs or emails
  schools: string[]; // user IDs or emails
}

export interface Professional {
  id: number | string;
  name: string;
  role: string;
  emoji: string;
  next: string;
  goals: string[];
  phone: string;
  clinic: string;
  crNumber?: string;
  email?: string;
  bio?: string;
  userId?: string;
}

export interface TherapySession {
  id: string;
  childId?: string;
  professionalId: number | string;
  professionalName: string;
  role: string;
  date: string;
  time: string;
  goalCategory: string;
  activities: string;
  evolution: string;
  nextGoals: string;
  behaviorsObserved?: string;
  childResponse?: string;
  difficulties?: string;
  recommendations?: string;
  attachmentName?: string;
  createdAt: string;
  authorId?: string;
}

export interface Goal {
  id: string;
  childId?: string;
  cat: string;
  name?: string;
  nivel: number;
  description: string;
  responsibleProf?: string;
  startDate?: string;
  deadline?: string;
  status?: 'Não iniciada' | 'Em andamento' | 'Evoluindo' | 'Concluída';
  updatedAt: string;
}

export interface Achievement {
  id: string;
  childId?: string;
  cat: string;
  title: string;
  date: string;
  desc: string;
  emoji: string;
  photoUrl?: string;
  celebrated?: boolean;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  desc: string;
  category: string;
  highlight?: boolean;
}

export interface AgendaEvent {
  id: string;
  childId?: string;
  day: string;
  date: string;
  time: string;
  endTime?: string;
  tipo: 'Terapia' | 'Escola' | 'Consulta' | 'Atividade' | 'Evento familiar' | 'Psicologia' | 'Fonoaudiologia' | 'Terapia ocupacional' | 'Musicoterapia' | 'Fisioterapia' | 'Psicopedagogia' | 'ABA' | 'Outros';
  who: string;
  professionalId?: string;
  local: string;
  status?: 'Agendado' | 'Confirmado' | 'Realizado' | 'Cancelado' | 'Faltou';
  notes?: string;
  completed?: boolean;
}

export interface ObservationRecord {
  id: string;
  childId: string;
  authorId: string;
  authorName: string;
  authorType: Role;
  category: 'Comunicação' | 'Comportamento' | 'Interação social' | 'Autonomia' | 'Aprendizagem' | 'Alimentação' | 'Sono' | 'Escola' | 'Terapia' | 'Outros';
  text: string;
  date: string;
  createdAt: string;
  isPrivate?: boolean;
}

export interface SchoolRecord {
  id: string;
  childId?: string;
  date: string;
  teacher: string;
  atividade: string;
  participacao: 'Ótima' | 'Boa' | 'Regular';
  socializacao: 'Ótima' | 'Boa' | 'Regular';
  comunicacao: 'Ótima' | 'Boa' | 'Regular';
  autonomia: 'Ótima' | 'Boa' | 'Regular';
  adaptacoes?: string;
  conquista: string;
  observacoes: string;
  recadoPais: string;
  createdAt: string;
}

export interface DiaryRecord {
  id: string;
  childId?: string;
  date: string;
  humor: string;
  sono: 'Ótimo' | 'Bom' | 'Regular' | 'Agitado';
  alimentacao: 'Ótima' | 'Boa' | 'Regular' | 'Pouco apetite';
  atividades: string;
  conquista: string;
  obs: string;
  photosCount?: number;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  childId?: string;
  nome: string;
  cat: 'Relatórios' | 'Avaliações' | 'Escola' | 'Terapias' | 'Documentos gerais' | 'Relatório' | 'Avaliação' | 'Administrativo' | 'PEI' | 'Receita';
  data: string;
  size: string;
  isPrivate: boolean;
  author: string;
  authorId?: string;
  downloadUrl?: string;
  fileType?: string;
}

export interface ChatMessage {
  id: string;
  senderId?: string;
  senderName: string;
  senderRole?: Role;
  text: string;
  time: string;
  createdAt?: string;
  read?: boolean;
  from?: 'me' | 'them';
}

export interface ChatThread {
  id: string;
  childId?: string;
  roleTarget: Role;
  name: string;
  avatar: string;
  roleDescription: string;
  last: string;
  lastTime: string;
  unread: number;
  msgs: ChatMessage[];
}

export interface MediaRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  type: 'image' | 'video';
  emoji: string;
  colorBg: string;
  description: string;
  url?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  role: Role;
  roleTitle: string;
  email: string;
  phone?: string;
  permissions: string;
  status: 'Ativo' | 'Pendente';
  lastAccess: string;
  avatarEmoji: string;
  linkedChildIds?: string[];
}

export interface AdminLog {
  id: string;
  action: string;
  user: string;
  time: string;
  badgeType: 'info' | 'success' | 'warning';
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'session' | 'observation' | 'goal' | 'document' | 'agenda';
  time: string;
  read: boolean;
  link?: string;
}
