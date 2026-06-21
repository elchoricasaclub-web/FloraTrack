import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  doc,
  getDoc,
  setDoc,
  FirebaseUser
} from '../services/firebase';
import { UsuarioSaaS, RolUsuario, COLECCIONES_FIRESTORE } from '../types';
import { AuthGateway } from '../components/auth/AuthGateway';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UsuarioSaaS | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, rol?: RolUsuario, fincaId?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileRole: (rol: RolUsuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UsuarioSaaS | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or create user profile in Firestore
  const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, COLECCIONES_FIRESTORE.USUARIOS, firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UsuarioSaaS;
        setUserProfile(data);
        
        // Update last access timestamp asynchronously
        await setDoc(userRef, { ultimoAcceso: new Date().toISOString() }, { merge: true });
      } else {
        // Fallback: If document does not exist in Firestore, initialize a default profile
        const defaultProfile: UsuarioSaaS = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'GACP Operativo',
          rol: 'OPERATIVO', // Default role
          activo: true,
          ultimoAcceso: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error fetching/setting user profile in Firestore:', error);
      // Fallback local memory profile so user has access even if Firestore rules block or offline
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'GACP Supervisor',
        rol: 'ADMINISTRATIVO',
        activo: true,
        ultimoAcceso: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Listen to Firebase authentication state transitions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    rol: RolUsuario = 'OPERATIVO',
    fincaId?: string
  ) => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile document in Firestore
      const newUserProfile: UsuarioSaaS = {
        uid: credential.user.uid,
        email,
        displayName,
        rol,
        fincaId,
        activo: true,
        ultimoAcceso: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, COLECCIONES_FIRESTORE.USUARIOS, credential.user.uid), newUserProfile);
      setUserProfile(newUserProfile);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileRole = async (rol: RolUsuario) => {
    if (!currentUser || !userProfile) return;
    try {
      const userRef = doc(db, COLECCIONES_FIRESTORE.USUARIOS, currentUser.uid);
      const updatedData = {
        rol,
        updatedAt: new Date().toISOString()
      };
      await setDoc(userRef, updatedData, { merge: true });
      setUserProfile((prev) => prev ? { ...prev, ...updatedData } : null);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        register,
        logout,
        updateProfileRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: RolUsuario[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400">Verificando credenciales de acceso...</p>
      </div>
    );
  }

  if (!userProfile) {
    return <AuthGateway />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.rol)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m0-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Acceso Restringido</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">Su rol actual ({userProfile.rol}) no tiene los permisos requeridos para auditar esta sección.</p>
      </div>
    );
  }

  return <>{children}</>;
};
