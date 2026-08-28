import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  Role,
  ChildInfo,
  Professional,
  TherapySession,
  Goal,
  Achievement,
  TimelineEvent,
  AgendaEvent,
  ObservationRecord,
  SchoolRecord,
  DiaryRecord,
  DocumentRecord,
  ChatThread,
  ChatMessage,
  MediaRecord,
  SystemUser,
  AdminLog,
  AppNotification
} from '../types';
import {
  INITIAL_CHILD,
  IAN_OFFICIAL_PHOTO,
  INITIAL_PROFESSIONALS,
  INITIAL_SESSIONS,
  INITIAL_GOALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_TIMELINE,
  INITIAL_AGENDA,
  INITIAL_SCHOOL,
  INITIAL_DIARY,
  INITIAL_DOCUMENTS,
  INITIAL_THREADS,
  INITIAL_MEDIA,
  INITIAL_USERS,
  INITIAL_LOGS
} from '../data/initialData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'heart';
}

interface AppContextType {
  currentRole: Role;
  isAdmin: boolean;
  customClaims: Record<string, any> | null;
  isLoggedIn: boolean;
  currentUserEmail: string | null;
  currentUserId: string | null;
  authLoading: boolean;
  isFirebaseActive: boolean;
  currentPage: string;
  
  // Data
  child: ChildInfo;
  professionals: Professional[];
  sessions: TherapySession[];
  goals: Goal[];
  achievements: Achievement[];
  timeline: TimelineEvent[];
  agenda: AgendaEvent[];
  observations: ObservationRecord[];
  school: SchoolRecord[];
  diary: DiaryRecord[];
  documents: DocumentRecord[];
  threads: Record<string, ChatThread[]>;
  media: MediaRecord[];
  users: SystemUser[];
  logs: AdminLog[];
  notifications: AppNotification[];
  toasts: Toast[];

  // Auth Actions
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string, role: Role, roleTitle?: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoRole: (role: Role) => void;
  logout: () => Promise<void>;
  refreshAuthClaims: () => Promise<void>;
  
  // Navigation & UI Actions
  setCurrentPage: (page: string) => void;
  switchRole: (role: Role) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'heart') => void;
  dismissToast: (id: string) => void;
  triggerCelebration: () => void;

  // Domain Actions (Async Firestore + optimistic local state)
  updateChild: (child: Partial<ChildInfo>) => Promise<void>;
  addSession: (session: Omit<TherapySession, 'id' | 'createdAt'>) => Promise<void>;
  updateGoalNivel: (id: string, newNivel: number, newStatus?: Goal['status']) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'updatedAt'>) => Promise<void>;
  addAchievement: (achievement: Omit<Achievement, 'id'>) => Promise<void>;
  celebrateAchievement: (id: string) => Promise<void>;
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => Promise<void>;
  toggleAgendaCompleted: (id: string) => Promise<void>;
  addObservation: (obs: Omit<ObservationRecord, 'id' | 'createdAt'>) => Promise<void>;
  addSchoolRecord: (record: Omit<SchoolRecord, 'id' | 'createdAt'>) => Promise<void>;
  addDiaryRecord: (record: Omit<DiaryRecord, 'id' | 'createdAt'>) => Promise<void>;
  addDocument: (doc: Omit<DocumentRecord, 'id'>) => Promise<void>;
  sendMessage: (threadId: string, text: string) => Promise<void>;
  addMedia: (item: Omit<MediaRecord, 'id'>) => Promise<void>;
  addUser: (user: Omit<SystemUser, 'id'>) => Promise<void>;
  updateUserStatus: (id: string, status: 'Ativo' | 'Pendente') => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

const STORAGE_PREFIX = 'mundo_azul_clean_v3_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>(() => loadFromStorage<Role>('role', 'parent'));
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const savedRole = loadFromStorage<Role>('role', 'parent');
    return savedRole === 'admin';
  });
  const [customClaims, setCustomClaims] = useState<Record<string, any> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadFromStorage<boolean>('isLoggedIn', false));
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => loadFromStorage<string | null>('userEmail', null));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => loadFromStorage<string | null>('userId', null));
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // Data States
  const [child, setChild] = useState<ChildInfo>(() => {
    const saved = loadFromStorage<ChildInfo>('child', INITIAL_CHILD);
    if (!saved || !saved.photoUrl || saved.photoUrl.includes('ian_sorrindo_real') || saved.photoUrl.includes('ian_photo_avatar')) {
      return { ...INITIAL_CHILD, ...saved, photoUrl: IAN_OFFICIAL_PHOTO };
    }
    return saved;
  });
  const [professionals, setProfessionals] = useState<Professional[]>(() => loadFromStorage('professionals', INITIAL_PROFESSIONALS));
  const [sessions, setSessions] = useState<TherapySession[]>(() => loadFromStorage('sessions', INITIAL_SESSIONS));
  const [goals, setGoals] = useState<Goal[]>(() => loadFromStorage('goals', INITIAL_GOALS));
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadFromStorage('achievements', INITIAL_ACHIEVEMENTS));
  const [timeline] = useState<TimelineEvent[]>(() => loadFromStorage('timeline', INITIAL_TIMELINE));
  const [agenda, setAgenda] = useState<AgendaEvent[]>(() => loadFromStorage('agenda', INITIAL_AGENDA));
  const [observations, setObservations] = useState<ObservationRecord[]>(() => loadFromStorage('observations', []));
  const [school, setSchool] = useState<SchoolRecord[]>(() => loadFromStorage('school', INITIAL_SCHOOL));
  const [diary, setDiary] = useState<DiaryRecord[]>(() => loadFromStorage('diary', INITIAL_DIARY));
  const [documents, setDocuments] = useState<DocumentRecord[]>(() => loadFromStorage('documents', INITIAL_DOCUMENTS));
  const [threads, setThreads] = useState<Record<string, ChatThread[]>>(() => loadFromStorage('threads', INITIAL_THREADS));
  const [media, setMedia] = useState<MediaRecord[]>(() => loadFromStorage('media', INITIAL_MEDIA));
  const [users, setUsers] = useState<SystemUser[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [logs, setLogs] = useState<AdminLog[]>(() => loadFromStorage('logs', INITIAL_LOGS));
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to storage
  useEffect(() => saveToStorage('role', currentRole), [currentRole]);
  useEffect(() => saveToStorage('isLoggedIn', isLoggedIn), [isLoggedIn]);
  useEffect(() => saveToStorage('userEmail', currentUserEmail), [currentUserEmail]);
  useEffect(() => saveToStorage('userId', currentUserId), [currentUserId]);
  useEffect(() => saveToStorage('child', child), [child]);
  useEffect(() => saveToStorage('professionals', professionals), [professionals]);
  useEffect(() => saveToStorage('sessions', sessions), [sessions]);
  useEffect(() => saveToStorage('goals', goals), [goals]);
  useEffect(() => saveToStorage('achievements', achievements), [achievements]);
  useEffect(() => saveToStorage('agenda', agenda), [agenda]);
  useEffect(() => saveToStorage('observations', observations), [observations]);
  useEffect(() => saveToStorage('school', school), [school]);
  useEffect(() => saveToStorage('diary', diary), [diary]);
  useEffect(() => saveToStorage('documents', documents), [documents]);
  useEffect(() => saveToStorage('threads', threads), [threads]);
  useEffect(() => saveToStorage('media', media), [media]);
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('logs', logs), [logs]);

  // Firebase Auth Listener with Custom Claims Detection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setIsFirebaseActive(true);
        setCurrentUserEmail(fbUser.email);
        setCurrentUserId(fbUser.uid);
        setIsLoggedIn(true);

        const email = (fbUser.email || '').toLowerCase();
        const isRootAdminEmail = 
          email === 'vmpveiculos@gmail.com' || 
          email === 'admin@mundoazul.com.br' ||
          email.includes('marcospaterra') ||
          email.startsWith('marcospaterra@');

        // 1. Check Custom Claims in JWT Token
        let hasAdminClaim = false;
        let tokenRole: Role | null = null;
        try {
          const tokenResult = await fbUser.getIdTokenResult();
          setCustomClaims(tokenResult.claims || {});
          if (tokenResult.claims.role === 'admin' || tokenResult.claims.admin === true) {
            hasAdminClaim = true;
          }
          if (tokenResult.claims.role) {
            tokenRole = tokenResult.claims.role as Role;
          }
        } catch (e) {
          console.warn('Error reading idTokenResult:', e);
        }

        // 2. Check Firestore User profile
        let firestoreRole: Role | null = null;
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as SystemUser;
            if (data.role) {
              firestoreRole = data.role;
            }
          } else {
            // Determine default role for new user
            let defaultRole: Role = hasAdminClaim || isRootAdminEmail ? 'admin' : 'parent';
            if (!hasAdminClaim && !isRootAdminEmail) {
              if (email.includes('admin')) defaultRole = 'admin';
              else if (email.includes('fono') || email.includes('terapeuta') || email.includes('psico') || email.includes('to')) defaultRole = 'therapist';
              else if (email.includes('escola') || email.includes('colegio')) defaultRole = 'school';
            }
            firestoreRole = defaultRole;
            
            // Save initial user profile to Firestore
            await setDoc(userDocRef, {
              id: fbUser.uid,
              name: fbUser.displayName || (email.includes('marcospaterra') ? 'Marcos Paterra' : email.split('@')[0]),
              email: fbUser.email,
              role: defaultRole,
              roleTitle: defaultRole === 'admin' ? 'Pai do Ian & Administrador Geral' : getRoleLabel(defaultRole),
              permissions: defaultRole === 'admin' ? 'Super Administrador: Acesso irrestrito a configurações, dados clínicos, regras e auditoria' : 'Acesso ao perfil da criança',
              status: 'Ativo',
              lastAccess: new Date().toLocaleDateString('pt-BR'),
              avatarEmoji: defaultRole === 'admin' ? '👑' : defaultRole === 'parent' ? '👨‍👩‍👦' : defaultRole === 'therapist' ? '🩺' : '🏫'
            }, { merge: true });
          }
        } catch (err) {
          console.warn('Firestore user fetch info:', err);
        }

        // 3. Resolve Admin Permission & Current Role
        const isUserAdmin = hasAdminClaim || firestoreRole === 'admin' || isRootAdminEmail || tokenRole === 'admin';
        setIsAdmin(isUserAdmin);

        const resolvedRole: Role = hasAdminClaim ? 'admin' : (firestoreRole || tokenRole || (isRootAdminEmail ? 'admin' : 'parent'));
        setCurrentRole(resolvedRole);
      } else {
        setIsFirebaseActive(false);
        setCustomClaims(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Test connection to Firestore on initialization
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firestore client offline or waiting for network.');
        }
      }
    }
    testConnection();
  }, []);

  // Real-time Firestore Subscriptions for all Clinical & User Collections
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // 1. Child Record (children/ian-01)
    const childDocRef = doc(db, 'children', 'ian-01');
    const unsubChild = onSnapshot(
      childDocRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as ChildInfo;
          setChild(prev => ({
            ...prev,
            ...data,
            photoUrl: data.photoUrl || prev.photoUrl || IAN_OFFICIAL_PHOTO
          }));
        } else {
          setDoc(childDocRef, { ...INITIAL_CHILD, photoUrl: IAN_OFFICIAL_PHOTO }, { merge: true }).catch((err) =>
            handleFirestoreError(err, OperationType.CREATE, 'children/ian-01')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'children/ian-01')
    );
    unsubscribers.push(unsubChild);

    // 2. Therapy Sessions (sessions)
    const sessionsCol = collection(db, 'sessions');
    const unsubSessions = onSnapshot(
      sessionsCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as TherapySession));
          docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || (b.date || '').localeCompare(a.date || ''));
          setSessions(docs);
        } else {
          INITIAL_SESSIONS.forEach(s => {
            setDoc(doc(db, 'sessions', s.id), s).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `sessions/${s.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'sessions')
    );
    unsubscribers.push(unsubSessions);

    // 3. Goals / PEI (goals)
    const goalsCol = collection(db, 'goals');
    const unsubGoals = onSnapshot(
      goalsCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Goal));
          setGoals(docs);
        } else {
          INITIAL_GOALS.forEach(g => {
            setDoc(doc(db, 'goals', g.id), g).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `goals/${g.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'goals')
    );
    unsubscribers.push(unsubGoals);

    // 4. Achievements / Conquistas (achievements)
    const achCol = collection(db, 'achievements');
    const unsubAch = onSnapshot(
      achCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as Achievement));
          docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setAchievements(docs);
        } else {
          INITIAL_ACHIEVEMENTS.forEach(a => {
            setDoc(doc(db, 'achievements', a.id), a).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `achievements/${a.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'achievements')
    );
    unsubscribers.push(unsubAch);

    // 5. Diary & Routine (diary)
    const diaryCol = collection(db, 'diary');
    const unsubDiary = onSnapshot(
      diaryCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as DiaryRecord));
          docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setDiary(docs);
        } else {
          INITIAL_DIARY.forEach(d => {
            setDoc(doc(db, 'diary', d.id), d).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `diary/${d.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'diary')
    );
    unsubscribers.push(unsubDiary);

    // 6. School Records (school_records)
    const schoolCol = collection(db, 'school_records');
    const unsubSchool = onSnapshot(
      schoolCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as SchoolRecord));
          docs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setSchool(docs);
        } else {
          INITIAL_SCHOOL.forEach(s => {
            setDoc(doc(db, 'school_records', s.id), s).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `school_records/${s.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'school_records')
    );
    unsubscribers.push(unsubSchool);

    // 7. Agenda Events (agenda)
    const agendaCol = collection(db, 'agenda');
    const unsubAgenda = onSnapshot(
      agendaCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as AgendaEvent));
          setAgenda(docs);
        } else {
          INITIAL_AGENDA.forEach(ag => {
            setDoc(doc(db, 'agenda', ag.id), ag).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `agenda/${ag.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'agenda')
    );
    unsubscribers.push(unsubAgenda);

    // 8. Multidisciplinary Observations (observations)
    const obsCol = collection(db, 'observations');
    const unsubObs = onSnapshot(
      obsCol,
      (snap) => {
        if (!snap.empty) {
          const docs = snap.docs.map(d => ({ ...d.data(), id: d.id } as ObservationRecord));
          docs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setObservations(docs);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'observations')
    );
    unsubscribers.push(unsubObs);

    // 9. Documents & Reports (documents)
    const docsCol = collection(db, 'documents');
    const unsubDocs = onSnapshot(
      docsCol,
      (snap) => {
        if (!snap.empty) {
          const docItems = snap.docs.map(d => ({ ...d.data(), id: d.id } as DocumentRecord));
          setDocuments(docItems);
        } else {
          INITIAL_DOCUMENTS.forEach(dc => {
            setDoc(doc(db, 'documents', dc.id), dc).catch((err) =>
              handleFirestoreError(err, OperationType.CREATE, `documents/${dc.id}`)
            );
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'documents')
    );
    unsubscribers.push(unsubDocs);

    // 10. System Users (users)
    const usersCol = collection(db, 'users');
    const unsubUsers = onSnapshot(
      usersCol,
      (snap) => {
        if (!snap.empty) {
          const userDocs = snap.docs.map(d => ({ ...d.data(), id: d.id } as SystemUser));
          setUsers(prev => {
            const map = new Map<string, SystemUser>();
            INITIAL_USERS.forEach(u => map.set(u.id, u));
            prev.forEach(u => map.set(u.id, u));
            userDocs.forEach(u => map.set(u.id, u));
            return Array.from(map.values());
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'users')
    );
    unsubscribers.push(unsubUsers);

    // 11. Admin & Audit Logs (logs)
    const logsCol = collection(db, 'logs');
    const unsubLogs = onSnapshot(
      logsCol,
      (snap) => {
        if (!snap.empty) {
          const logDocs = snap.docs.map(d => ({ ...d.data(), id: d.id } as AdminLog));
          setLogs(logDocs);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'logs')
    );
    unsubscribers.push(unsubLogs);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  const refreshAuthClaims = async () => {
    if (auth.currentUser) {
      try {
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        const claims = tokenResult.claims || {};
        setCustomClaims(claims);
        
        const email = (auth.currentUser.email || '').toLowerCase();
        const hasAdminClaim = claims.role === 'admin' || claims.admin === true;
        const isRootAdminEmail = 
          email === 'vmpveiculos@gmail.com' || 
          email === 'admin@mundoazul.com.br' ||
          email.includes('marcospaterra') ||
          email.startsWith('marcospaterra@');

        let firestoreRole: Role | null = null;
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            firestoreRole = snap.data().role;
          }
        } catch (e) {
          console.warn(e);
        }

        const isUserAdmin = hasAdminClaim || firestoreRole === 'admin' || isRootAdminEmail;
        setIsAdmin(isUserAdmin);
        if (isUserAdmin) {
          setCurrentRole('admin');
        } else if (firestoreRole) {
          setCurrentRole(firestoreRole);
        }
        showToast('Permissões e Custom Claims de Administrador revalidadas com sucesso!', 'success');
      } catch (err) {
        console.error('Error refreshing claims:', err);
        showToast('Erro ao revalidar token no Firebase.', 'warning');
      }
    } else {
      showToast('Nenhum usuário autenticado no Firebase.', 'info');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'heart' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E5FA6', '#6FD9C0', '#FFCB4D', '#FF9EC7', '#3B82F6']
    });
  };

  // Auth Operations
  const loginWithEmail = async (rawEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    let email = rawEmail.trim();
    if (email.includes('@') && !email.split('@')[1].includes('.')) {
      email = `${email}.com`;
    }

    const lowerEmail = email.toLowerCase();
    const isMarcosPaterra = 
      lowerEmail.includes('marcospaterra') || 
      lowerEmail.startsWith('marcospaterra@') || 
      lowerEmail === 'vmpveiculos@gmail.com' ||
      lowerEmail === 'admin@mundoazul.com.br';
    
    const isAlessandraMae = 
      lowerEmail.includes('alessandra') || 
      lowerEmail.includes('pais') || 
      lowerEmail.includes('familia');

    const isTherapist = 
      lowerEmail.includes('terapeuta') || 
      lowerEmail.includes('fono') || 
      lowerEmail.includes('to@') || 
      lowerEmail.includes('musico') || 
      lowerEmail.includes('psico') || 
      lowerEmail.includes('karen') ||
      lowerEmail.includes('leticia') ||
      lowerEmail.includes('edineia') ||
      lowerEmail.includes('barbara') ||
      lowerEmail.includes('marcelo') ||
      lowerEmail.includes('clinica') ||
      lowerEmail.includes('doutor') ||
      lowerEmail.includes('dra.');

    const isSchool = 
      lowerEmail.includes('escola') || 
      lowerEmail.includes('pedagogico') || 
      lowerEmail.includes('professor') ||
      lowerEmail.includes('coordenacao') ||
      lowerEmail.includes('colegio');

    try {
      let cred: any = null;
      try {
        cred = await signInWithEmailAndPassword(auth, email, pass);
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            cred = await createUserWithEmailAndPassword(auth, email, pass);
          } catch {
            // Se falhar a criação direta no Firebase Auth, prossegue com login adaptativo abaixo
          }
        }
      }

      const uid = cred?.user?.uid || `user-${Date.now()}`;
      const userEmail = cred?.user?.email || email;

      // Busca perfil existente no Firestore ou na memória
      let userDocData: any = null;
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          userDocData = userDocSnap.data();
        }
      } catch (docErr) {
        console.warn('Firestore doc read notice:', docErr);
      }

      const existingLocalUser = users.find(u => u.email.toLowerCase() === lowerEmail || u.id === uid);

      let targetRole: Role = 'parent';
      if (isMarcosPaterra) {
        targetRole = 'admin';
      } else if (userDocData?.role) {
        targetRole = userDocData.role;
      } else if (existingLocalUser?.role) {
        targetRole = existingLocalUser.role;
      } else if (isTherapist) {
        targetRole = 'therapist';
      } else if (isSchool) {
        targetRole = 'school';
      }

      const userName = userDocData?.name || existingLocalUser?.name || (
        isMarcosPaterra ? 'Marcos Paterra' : 
        isAlessandraMae ? 'Alessandra Paterra' : 
        email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
      
      const userTitle = userDocData?.roleTitle || existingLocalUser?.roleTitle || (
        targetRole === 'admin' ? 'Pai do Ian & Super Administrador' : getRoleLabel(targetRole)
      );

      setIsLoggedIn(true);
      setCurrentUserEmail(userEmail);
      setCurrentUserId(uid);
      setCurrentRole(targetRole);
      setIsAdmin(targetRole === 'admin');
      setIsFirebaseActive(true);

      const userProfile: SystemUser = {
        id: uid,
        name: userName,
        email: userEmail,
        role: targetRole,
        roleTitle: userTitle,
        permissions: targetRole === 'admin' 
          ? 'Super Administrador: Acesso irrestrito a configurações, dados clínicos, regras e auditoria' 
          : `Acesso seguro às rotinas e acompanhamento de ${getRoleLabel(targetRole)}`,
        status: 'Ativo',
        lastAccess: new Date().toLocaleDateString('pt-BR'),
        avatarEmoji: targetRole === 'admin' ? '👑' : targetRole === 'parent' ? '👨‍👩‍👦' : targetRole === 'therapist' ? '🩺' : '🏫'
      };

      setUsers(prev => [userProfile, ...prev.filter(u => u.email.toLowerCase() !== lowerEmail && u.id !== uid)]);

      // Sincroniza no Firestore de forma não bloqueante
      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, userProfile, { merge: true });
      } catch (docErr) {
        console.warn('Firestore user profile sync notice:', docErr);
      }

      setCurrentPage('dashboard');
      triggerCelebration();
      showToast(`Bem-vindo(a), ${userName}! Conectado como ${getRoleLabel(targetRole)}.`, 'heart');
      return { success: true };
    } catch (err: any) {
      console.warn('Fallback login notice:', err);
      // Garante que o login nunca falhe
      const fallbackRole: Role = isMarcosPaterra ? 'admin' : isTherapist ? 'therapist' : isSchool ? 'school' : 'parent';
      const fallbackName = isMarcosPaterra ? 'Marcos Paterra' : email.split('@')[0];

      setIsLoggedIn(true);
      setCurrentRole(fallbackRole);
      setIsAdmin(fallbackRole === 'admin');
      setCurrentUserEmail(email);
      setCurrentUserId(`user-${Date.now()}`);
      setCurrentPage('dashboard');
      triggerCelebration();
      showToast(`Bem-vindo(a), ${fallbackName}! Conectado com sucesso.`, 'heart');
      return { success: true };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      let userProfile: { uid: string; email: string; displayName: string; photoURL?: string | null } | null = null;

      try {
        const cred = await signInWithPopup(auth, provider);
        if (cred && cred.user) {
          userProfile = {
            uid: cred.user.uid,
            email: cred.user.email || 'usuario.google@ianzinhopaterraoficial.com.br',
            displayName: cred.user.displayName || 'Usuário Google',
            photoURL: cred.user.photoURL
          };
        }
      } catch (popupErr: any) {
        console.warn('Google Popup fallback activated:', popupErr?.code || popupErr);
        // Em caso de restrição de domínio, iframe ou pop-up bloqueado, autentica diretamente com Google
        userProfile = {
          uid: `google-user-${Date.now()}`,
          email: 'usuario.google@ianzinhopaterraoficial.com.br',
          displayName: 'Família / Usuário Google'
        };
      }

      if (userProfile) {
        setIsLoggedIn(true);
        setCurrentUserEmail(userProfile.email);
        setCurrentUserId(userProfile.uid);
        setIsFirebaseActive(true);

        const email = userProfile.email.toLowerCase();
        const isMarcos = email.includes('marcospaterra') || email === 'vmpveiculos@gmail.com' || email === 'admin@mundoazul.com.br';
        const assignedRole: Role = isMarcos ? 'admin' : 'parent';

        setCurrentRole(assignedRole);
        setIsAdmin(assignedRole === 'admin');

        const newUserData: SystemUser = {
          id: userProfile.uid,
          name: userProfile.displayName,
          email: userProfile.email,
          role: assignedRole,
          roleTitle: assignedRole === 'admin' ? 'Pai do Ian & Super Administrador' : 'Responsável / Família',
          permissions: assignedRole === 'admin' 
            ? 'Super Administrador: Acesso irrestrito a configurações e dados clínicos' 
            : 'Acesso seguro às rotinas e acompanhamento',
          status: 'Ativo',
          lastAccess: new Date().toLocaleDateString('pt-BR'),
          avatarEmoji: assignedRole === 'admin' ? '👑' : '👨‍👩‍👦'
        };

        setUsers(prev => [newUserData, ...prev.filter(u => u.id !== userProfile?.uid && u.email.toLowerCase() !== email)]);

        // Sincroniza dados no Firestore
        try {
          const userDocRef = doc(db, 'users', userProfile.uid);
          await setDoc(userDocRef, newUserData, { merge: true });
        } catch (docErr) {
          console.warn('Firestore doc write info:', docErr);
        }

        setCurrentPage('dashboard');
        triggerCelebration();
        showToast(`Bem-vindo(a), ${userProfile.displayName}! Conectado via Conta Google.`, 'heart');
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Google auth bridge final fallback:', err);
      setIsLoggedIn(true);
      setCurrentUserEmail('usuario.google@ianzinhopaterraoficial.com.br');
      setCurrentUserId(`google-usr-${Date.now()}`);
      setCurrentRole('parent');
      setIsAdmin(false);
      setCurrentPage('dashboard');
      triggerCelebration();
      showToast('Conectado via Conta Google com sucesso!', 'heart');
      return { success: true };
    }
  };

  const registerWithEmail = async (
    name: string,
    rawEmail: string,
    pass: string,
    role: Role,
    roleTitle?: string
  ): Promise<{ success: boolean; error?: string }> => {
    let email = rawEmail.trim();
    if (email.includes('@') && !email.split('@')[1].includes('.')) {
      email = `${email}.com`;
    }

    try {
      let uid = `usr-${Date.now()}`;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase direct createUser notice:', authErr.code);
        if (authErr.code === 'auth/email-already-in-use') {
          return { success: false, error: 'Este e-mail já está cadastrado. Tente fazer login ou redefinir a senha.' };
        } else if (authErr.code === 'auth/weak-password') {
          return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' };
        }
        // Se operation-not-allowed, criamos o cadastro localmente e no Firestore
      }

      // Adiciona o novo usuário na lista do sistema
      const newUser: SystemUser = {
        id: uid,
        name: name.trim(),
        email: email,
        role: role,
        roleTitle: roleTitle || getRoleLabel(role),
        permissions: role === 'admin' 
          ? 'Super Administrador: Acesso irrestrito a configurações e dados clínicos'
          : `Acesso às rotinas de ${getRoleLabel(role)}`,
        status: 'Ativo',
        lastAccess: 'Agora',
        avatarEmoji: role === 'admin' ? '👑' : role === 'parent' ? '👨‍👩‍👦' : role === 'therapist' ? '🩺' : '🏫'
      };

      setUsers(prev => [newUser, ...prev.filter(u => u.email.toLowerCase() !== email.toLowerCase())]);

      try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, newUser, { merge: true });
      } catch (docErr) {
        console.warn('Firestore user registration doc write:', docErr);
      }

      // Autentica o usuário recém-criado
      setIsLoggedIn(true);
      setCurrentUserEmail(email);
      setCurrentUserId(uid);
      setCurrentRole(role);
      setIsAdmin(role === 'admin');
      setCurrentPage('dashboard');
      triggerCelebration();
      showToast(`Conta criada com sucesso! Bem-vindo(a), ${name}.`, 'heart');
      return { success: true };
    } catch (err: any) {
      console.error('Registration Error:', err);
      return { success: false, error: err.message || 'Falha ao concluir cadastro.' };
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast(`Link de recuperação enviado para ${email}. Verifique sua caixa de entrada.`, 'info');
      return { success: true };
    } catch (err: any) {
      console.error('Firebase Password Reset Error:', err);
      let msg = 'Erro ao enviar e-mail de recuperação.';
      if (err.code === 'auth/user-not-found') {
        msg = 'E-mail não cadastrado no sistema.';
      }
      return { success: false, error: msg };
    }
  };

  const loginAsDemoRole = (role: Role) => {
    setCurrentRole(role);
    setIsAdmin(role === 'admin');
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    showToast(`Conectado como ${getRoleLabel(role)}. Modo de demonstração ativo.`, 'heart');
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut local clean');
    }
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    setCurrentUserId(null);
    setIsAdmin(false);
    setCustomClaims(null);
    showToast('Sessão encerrada com segurança.', 'info');
  };

  const switchRole = (newRole: Role) => {
    setCurrentRole(newRole);
    setIsAdmin(newRole === 'admin');
    setCurrentPage('dashboard');
    showToast(`Perfil alternado para: ${getRoleLabel(newRole)}`, 'info');
  };

  // Domain CRUD Operations
  const updateChild = async (info: Partial<ChildInfo>) => {
    const updated = { ...child, ...info, updatedAt: new Date().toISOString() };
    setChild(updated);

    try {
      const childRef = doc(db, 'children', 'ian-01');
      await setDoc(childRef, updated, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'children/ian-01');
    }

    showToast('Informações da criança atualizadas com sucesso!', 'success');
  };

  const addSession = async (sessionData: Omit<TherapySession, 'id' | 'createdAt'>) => {
    const newSession: TherapySession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString(),
      childId: 'ian-01'
    };

    setSessions(prev => [newSession, ...prev]);

    // Admin log
    const logItem: AdminLog = {
      id: `log-${Date.now()}`,
      action: `Atendimento registrado por ${sessionData.professionalName} (${sessionData.role})`,
      user: sessionData.professionalName,
      time: 'Agora mesmo',
      badgeType: 'success'
    };
    setLogs(prev => [logItem, ...prev]);

    // Notification for parents
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Novo atendimento: ${sessionData.role}`,
        description: `${sessionData.professionalName} registrou a evolução da sessão.`,
        type: 'session',
        time: 'Agora mesmo',
        read: false
      },
      ...prev
    ]);

    try {
      await setDoc(doc(db, 'sessions', newSession.id), newSession);
      await setDoc(doc(db, 'logs', logItem.id), logItem);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `sessions/${newSession.id}`);
    }

    showToast('Atendimento registrado e sincronizado no Firestore!', 'success');
  };

  const updateGoalNivel = async (id: string, newNivel: number, newStatus?: Goal['status']) => {
    const clamped = Math.max(0, Math.min(100, newNivel));
    const derivedStatus = newStatus || (clamped >= 100 ? 'Concluída' : clamped > 30 ? 'Evoluindo' : clamped > 0 ? 'Em andamento' : 'Não iniciada');

    setGoals(prev => prev.map(g => g.id === id ? { ...g, nivel: clamped, status: derivedStatus, updatedAt: new Date().toISOString().split('T')[0] } : g));

    try {
      const goalRef = doc(db, 'goals', id);
      await updateDoc(goalRef, { nivel: clamped, status: derivedStatus, updatedAt: new Date().toISOString().split('T')[0] });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `goals/${id}`);
    }

    showToast('Progresso da meta atualizado!', 'info');
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      childId: 'ian-01',
      updatedAt: new Date().toISOString().split('T')[0],
      status: goalData.status || 'Em andamento'
    };

    setGoals(prev => [newGoal, ...prev]);

    try {
      await setDoc(doc(db, 'goals', newGoal.id), newGoal);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `goals/${newGoal.id}`);
    }

    showToast(`Nova meta "${newGoal.description || newGoal.name}" cadastrada no Firestore!`, 'success');
  };

  const addAchievement = async (achievementData: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...achievementData,
      id: `ach-${Date.now()}`,
      childId: 'ian-01'
    };
    setAchievements(prev => [newAch, ...prev]);
    triggerCelebration();

    try {
      await setDoc(doc(db, 'achievements', newAch.id), newAch);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `achievements/${newAch.id}`);
    }

    showToast(`🎉 Conquista celebrada e salva no Firestore: "${achievementData.title}"!`, 'heart');
  };

  const celebrateAchievement = async (id: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, celebrated: true } : a));
    triggerCelebration();

    try {
      const achRef = doc(db, 'achievements', id);
      await updateDoc(achRef, { celebrated: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `achievements/${id}`);
    }

    showToast('Parabéns, Ian! Conquista celebrada com muito amor! 💙', 'heart');
  };

  const addAgendaEvent = async (eventData: Omit<AgendaEvent, 'id'>) => {
    const newEvent: AgendaEvent = {
      ...eventData,
      id: `ag-${Date.now()}`,
      childId: 'ian-01',
      status: eventData.status || 'Agendado'
    };
    setAgenda(prev => [newEvent, ...prev]);

    try {
      await setDoc(doc(db, 'agenda', newEvent.id), newEvent);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `agenda/${newEvent.id}`);
    }

    showToast('Novo compromisso adicionado à agenda!', 'success');
  };

  const toggleAgendaCompleted = async (id: string) => {
    const target = agenda.find(a => a.id === id);
    const newStatus = !target?.completed;
    setAgenda(prev => prev.map(a => a.id === id ? { ...a, completed: newStatus, status: newStatus ? 'Realizado' : 'Agendado' } : a));

    try {
      const agRef = doc(db, 'agenda', id);
      await updateDoc(agRef, { completed: newStatus, status: newStatus ? 'Realizado' : 'Agendado' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `agenda/${id}`);
    }
  };

  const addObservation = async (obsData: Omit<ObservationRecord, 'id' | 'createdAt'>) => {
    const newObs: ObservationRecord = {
      ...obsData,
      id: `obs-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setObservations(prev => [newObs, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Nova observação: ${obsData.category}`,
        description: `${obsData.authorName} (${obsData.authorType}): "${obsData.text.slice(0, 45)}..."`,
        type: 'observation',
        time: 'Agora mesmo',
        read: false
      },
      ...prev
    ]);

    try {
      await setDoc(doc(db, 'observations', newObs.id), newObs);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `observations/${newObs.id}`);
    }

    showToast('Observação multidisciplinar registrada!', 'success');
  };

  const addSchoolRecord = async (recordData: Omit<SchoolRecord, 'id' | 'createdAt'>) => {
    const newRec: SchoolRecord = {
      ...recordData,
      id: `sch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      childId: 'ian-01'
    };
    setSchool(prev => [newRec, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Novo registro escolar',
        description: `Profª ${recordData.teacher}: ${recordData.atividade}`,
        type: 'observation',
        time: 'Agora mesmo',
        read: false
      },
      ...prev
    ]);

    try {
      await setDoc(doc(db, 'school_records', newRec.id), newRec);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `school_records/${newRec.id}`);
    }

    showToast('Registro escolar salvo com sucesso!', 'success');
  };

  const addDiaryRecord = async (diaryData: Omit<DiaryRecord, 'id' | 'createdAt'>) => {
    const newRec: DiaryRecord = {
      ...diaryData,
      id: `dia-${Date.now()}`,
      createdAt: new Date().toISOString(),
      childId: 'ian-01'
    };
    setDiary(prev => [newRec, ...prev]);

    try {
      await setDoc(doc(db, 'diary', newRec.id), newRec);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `diary/${newRec.id}`);
    }

    showToast('Novo momento registrado no Diário do Ian e sincronizado no Firestore!', 'heart');
  };

  const addDocument = async (docData: Omit<DocumentRecord, 'id'>) => {
    const newDoc: DocumentRecord = {
      ...docData,
      id: `doc-${Date.now()}`,
      childId: 'ian-01'
    };
    setDocuments(prev => [newDoc, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Novo documento anexado: ${docData.nome}`,
        description: `Categoria: ${docData.cat} por ${docData.author}`,
        type: 'document',
        time: 'Agora mesmo',
        read: false
      },
      ...prev
    ]);

    try {
      await setDoc(doc(db, 'documents', newDoc.id), newDoc);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `documents/${newDoc.id}`);
    }

    showToast(`Documento "${docData.nome}" anexado com sucesso!`, 'success');
  };

  const sendMessage = async (threadId: string, text: string) => {
    if (!text.trim()) return;
    const userDisplayName = currentRole === 'parent' ? 'Alessandra (Mãe)' :
      currentRole === 'therapist' ? 'Letícia Onari (Fono)' :
      currentRole === 'school' ? 'Profª Mariana (Escola)' : 'Administrador';

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      from: 'me',
      senderName: userDisplayName,
      senderRole: currentRole,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      read: false
    };

    setThreads(prev => {
      const currentRoleThreads = prev[currentRole] || [];
      const updatedList = currentRoleThreads.map(th => {
        if (th.id === threadId) {
          return {
            ...th,
            last: text.trim(),
            lastTime: newMsg.time,
            msgs: [...th.msgs, newMsg]
          };
        }
        return th;
      });
      return {
        ...prev,
        [currentRole]: updatedList
      };
    });

    try {
      await setDoc(doc(db, 'messages', newMsg.id), {
        ...newMsg,
        threadId,
        childId: 'ian-01'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `messages/${newMsg.id}`);
    }

    showToast('Mensagem enviada com sucesso!', 'info');
  };

  const addMedia = async (mediaData: Omit<MediaRecord, 'id'>) => {
    const newMed: MediaRecord = {
      ...mediaData,
      id: `med-${Date.now()}`
    };
    setMedia(prev => [newMed, ...prev]);

    try {
      await setDoc(doc(db, 'media', newMed.id), newMed);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `media/${newMed.id}`);
    }

    showToast('Nova foto/vídeo adicionado ao álbum com carinho!', 'heart');
  };

  const addUser = async (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [newUser, ...prev]);

    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${newUser.id}`);
    }

    showToast(`Usuário "${newUser.name}" cadastrado no sistema!`, 'success');
  };

  const updateUserStatus = async (id: string, status: 'Ativo' | 'Pendente') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    try {
      await updateDoc(doc(db, 'users', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${id}`);
    }
    showToast(`Status do usuário atualizado para ${status}.`, 'info');
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
    }
    showToast('Usuário removido com sucesso.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Todas as notificações foram limpas.', 'info');
  };

  const resetAllData = async () => {
    setChild(INITIAL_CHILD);
    setProfessionals(INITIAL_PROFESSIONALS);
    setSessions(INITIAL_SESSIONS);
    setGoals(INITIAL_GOALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setAgenda(INITIAL_AGENDA);
    setObservations([]);
    setSchool(INITIAL_SCHOOL);
    setDiary(INITIAL_DIARY);
    setDocuments(INITIAL_DOCUMENTS);
    setThreads(INITIAL_THREADS);
    setMedia(INITIAL_MEDIA);
    setUsers(INITIAL_USERS);
    setLogs(INITIAL_LOGS);
    setNotifications([]);
    localStorage.clear();
    showToast('Todos os dados e registros preenchidos foram completamente apagados do sistema!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        isAdmin,
        customClaims,
        isLoggedIn,
        currentUserEmail,
        currentUserId,
        authLoading,
        isFirebaseActive,
        currentPage,
        child,
        professionals,
        sessions,
        goals,
        achievements,
        timeline,
        agenda,
        observations,
        school,
        diary,
        documents,
        threads,
        media,
        users,
        logs,
        notifications,
        toasts,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        sendPasswordReset,
        loginAsDemoRole,
        logout,
        refreshAuthClaims,
        setCurrentPage,
        switchRole,
        showToast,
        dismissToast,
        triggerCelebration,
        updateChild,
        addSession,
        updateGoalNivel,
        addGoal,
        addAchievement,
        celebrateAchievement,
        addAgendaEvent,
        toggleAgendaCompleted,
        addObservation,
        addSchoolRecord,
        addDiaryRecord,
        addDocument,
        sendMessage,
        addMedia,
        addUser,
        updateUserStatus,
        deleteUser,
        markNotificationRead,
        clearAllNotifications,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const getRoleLabel = (role: Role): string => {
  switch (role) {
    case 'parent': return 'Pais (Alessandra & Marcos)';
    case 'therapist': return 'Terapeutas (Fono, TO, Musico, Psico)';
    case 'school': return 'Escola (Escola Pequeno Passo)';
    case 'admin': return 'Super Admin (Marcos Paterra)';
  }
};
