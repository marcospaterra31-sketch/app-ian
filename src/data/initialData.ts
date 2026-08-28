import ianPhoto from '../assets/images/ian_sorrindo_real_1787837860779.jpg';
import { 
  ChildInfo, 
  Professional, 
  TherapySession, 
  Goal, 
  Achievement, 
  TimelineEvent, 
  AgendaEvent, 
  SchoolRecord, 
  DiaryRecord, 
  DocumentRecord, 
  ChatThread, 
  MediaRecord, 
  SystemUser, 
  AdminLog 
} from '../types';

export const IAN_OFFICIAL_PHOTO = 'https://ianzinhopaterraoficial.com.br/wp-content/uploads/2026/08/01.png';

export const INITIAL_CHILD: ChildInfo = {
  name: "Ian Paterra",
  parents: "Alessandra & Marcos Paterra",
  birth: "",
  birthDateFull: "",
  age: "",
  diagnosis: "Transtorno do Espectro Autista (TEA)",
  photoUrl: IAN_OFFICIAL_PHOTO,
  bloodType: "",
  emergencyContact: "",
  allergies: "",
  schoolName: ""
};

export const INITIAL_PROFESSIONALS: Professional[] = [];

export const INITIAL_SESSIONS: TherapySession[] = [];

export const INITIAL_GOALS: Goal[] = [
  { id: "g1", cat: "Comunicação", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" },
  { id: "g2", cat: "Socialização", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" },
  { id: "g3", cat: "Autonomia", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" },
  { id: "g4", cat: "Coordenação Motora", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" },
  { id: "g5", cat: "Sensorial", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" },
  { id: "g6", cat: "Cognição", nivel: 0, description: "Aguardando definição do plano terapêutico.", updatedAt: "" }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [];

export const INITIAL_TIMELINE: TimelineEvent[] = [];

export const INITIAL_AGENDA: AgendaEvent[] = [];

export const INITIAL_SCHOOL: SchoolRecord[] = [];

export const INITIAL_DIARY: DiaryRecord[] = [];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [];

export const INITIAL_THREADS: Record<string, ChatThread[]> = {
  parent: [],
  therapist: [],
  school: [],
  admin: []
};

export const INITIAL_MEDIA: MediaRecord[] = [];

export const INITIAL_USERS: SystemUser[] = [
  { 
    id: "usr-pai-admin", 
    name: "Marcos Paterra", 
    role: "admin", 
    roleTitle: "Super Administrador", 
    email: "marcospaterra31@gmail.com", 
    permissions: "Super Administrador: Gestão total de segurança, prontuário, regras, auditoria e cadastros",
    status: "Ativo",
    lastAccess: "Online Agora",
    avatarEmoji: "👑"
  }
];

export const INITIAL_LOGS: AdminLog[] = [];
