import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, Profile } from '@/types';
import { RegisterFormData, LoginFormData } from '@/lib/validations';

/**
 * Cria um novo usuário com email e senha
 */
export async function createUser(data: RegisterFormData): Promise<User> {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const firebaseUser = userCredential.user;

    // Atualizar perfil no Firebase Auth
    await updateProfile(firebaseUser, {
      displayName: data.name,
    });

    // Criar perfil no Firestore
    const userProfile: Omit<Profile, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role as UserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'profiles', firebaseUser.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Enviar email de verificação
    await sendEmailVerification(firebaseUser);

    return {
      id: firebaseUser.uid,
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Faz login com email e senha
 */
export async function signInUser(data: LoginFormData): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const firebaseUser = userCredential.user;
    const userProfile = await getUserProfile(firebaseUser.uid);

    if (!userProfile) {
      throw new Error('Perfil do usuário não encontrado');
    }

    return userProfile;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Faz logout do usuário
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao fazer logout');
  }
}

/**
 * Busca o perfil do usuário no Firestore
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    return null;
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'phone'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // Atualizar também no Firebase Auth se necessário
    if (updates.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: updates.name,
      });
    }
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw new Error('Erro ao atualizar perfil');
  }
}

/**
 * Envia email de recuperação de senha
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Reenvia email de verificação
 */
export async function resendEmailVerification(): Promise<void> {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('Usuário não encontrado');
    }
  } catch (error: any) {
    console.error('Erro ao reenviar email de verificação:', error);
    throw new Error('Erro ao reenviar email de verificação');
  }
}

/**
 * Observa mudanças no estado de autenticação
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userProfile = await getUserProfile(firebaseUser.uid);
      callback(userProfile);
    } else {
      callback(null);
    }
  });
}

/**
 * Converte códigos de erro do Firebase para mensagens em português
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está sendo usado',
    'auth/weak-password': 'Senha muito fraca',
    'auth/invalid-email': 'Email inválido',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/requires-recent-login': 'É necessário fazer login novamente',
    'auth/invalid-credential': 'Credenciais inválidas',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
  };

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente';
}

/**
 * Verifica se o usuário tem uma role específica
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  
  // master_admin tem acesso a tudo
  if (user.role === 'master_admin') return true;
  
  // admin tem acesso a funções de admin e player
  if (user.role === 'admin' && (role === 'admin' || role === 'player')) return true;
  
  // player só tem acesso a funções de player
  if (user.role === 'player' && role === 'player') return true;
  
  return false;
}

/**
 * Verifica se o usuário é admin ou master_admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin') || user?.role === 'master_admin';
}

/**
 * Verifica se o usuário é master_admin
 */
export function isMasterAdmin(user: User | null): boolean {
  return user?.role === 'master_admin';
}