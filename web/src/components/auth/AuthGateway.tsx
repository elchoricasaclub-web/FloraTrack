import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RolUsuario } from '../../types';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';

export const AuthGateway: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<RolUsuario>('OPERATIVO');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end Validations
    if (!validateEmail(email)) {
      setError('Formato de correo electrónico no válido.');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (isRegistering) {
      const nameError = validateRequired(displayName, 'Nombre Completo');
      if (nameError) {
        setError(nameError);
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password, displayName, role);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error('Error during authentication auth gateway:', err);
      // Friendly, clean translation of Firebase or local auth errors
      let errMsg = err.message || 'Error inesperado durante la autenticación.';
      if (errMsg.includes('auth/invalid-credential')) {
        errMsg = 'Correo electrónico o contraseña incorrectos.';
      } else if (errMsg.includes('auth/email-already-in-use')) {
        errMsg = 'Este correo electrónico ya se encuentra registrado.';
      } else if (errMsg.includes('auth/weak-password')) {
        errMsg = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (errMsg.includes('auth/invalid-email')) {
        errMsg = 'Formato de correo electrónico no válido.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (rol: RolUsuario) => {
    setError(null);
    if (rol === 'ADMINISTRATIVO') {
      setEmail('admin@floratrack.com');
      setPassword('admin123');
      setIsRegistering(false);
    } else if (rol === 'AUDITOR_EXTERNO') {
      setEmail('auditor@floratrack.com');
      setPassword('auditor123');
      setIsRegistering(false);
    } else {
      setEmail('operario@floratrack.com');
      setPassword('operario123');
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-300">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#052e16,transparent_40%),radial-gradient(circle_at_70%_80%,#09333f,transparent_40%)] pointer-events-none z-0"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {/* Branding Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-emerald-500/20 mb-4 animate-pulse">
            FT
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegistering ? 'Crear Cuenta FloraTrack' : 'Sistema de Control Agrícola'}
          </h2>
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {isRegistering 
              ? 'Regístrese para iniciar la gestión y control fitosanitario' 
              : 'Acceda a la consola de trazabilidad GACP / GMP'}
          </p>
        </div>

        {/* Validation Errors banner */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 text-xs text-rose-300 flex items-start gap-2.5 animate-fade-in">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-semibold">{error}</div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="space-y-1">
              <label htmlFor="displayName" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Nombre Completo o Razón Social
              </label>
              <div className="relative">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-200 transition outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email-address" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Correo Electrónico Corp.
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-200 transition outline-none"
              placeholder="ejemplo@floratrack.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Contraseña de Acceso
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-slate-200 transition outline-none"
              placeholder="••••••••"
            />
          </div>

          {isRegistering && (
            <div className="space-y-1">
              <label htmlFor="role" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rol GACP Regulado
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as RolUsuario)}
                className="w-full px-3 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-slate-300 transition"
              >
                <option value="OPERATIVO">Supervisor Operativo Agrícola (GACP)</option>
                <option value="ADMINISTRATIVO">Director Administrativo / Farmacéutico</option>
                <option value="AUDITOR_EXTERNO">Auditor Fitosanitario Externo</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex justify-center items-center py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : isRegistering ? (
              'Registrar e Iniciar'
            ) : (
              'Ingresar a la Consola'
            )}
          </button>
        </form>

        {/* Access toggle links */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline outline-none"
          >
            {isRegistering 
              ? '¿Ya posee una cuenta? Inicie sesión' 
              : '¿No cuenta con credenciales? Regístrese aquí'}
          </button>
        </div>

        {/* Demo profiles quick fill panel */}
        <div className="border-t border-slate-800/80 pt-6 mt-6">
          <span className="block text-[9px] font-black uppercase text-slate-500 tracking-wider text-center mb-3">
            Credenciales Demo de Simulación GACP/GMP
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillDemoCredentials('OPERATIVO')}
              className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 font-bold transition outline-none cursor-pointer"
            >
              Operario
            </button>
            <button
              onClick={() => fillDemoCredentials('ADMINISTRATIVO')}
              className="px-2 py-1.5 rounded-lg bg-slate-100 text-slate-950 hover:bg-slate-100/90 font-bold text-[10px] transition outline-none cursor-pointer"
            >
              Director Admin
            </button>
            <button
              onClick={() => fillDemoCredentials('AUDITOR_EXTERNO')}
              className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-950/80 border border-slate-800 text-[10px] text-purple-400 font-bold transition outline-none cursor-pointer"
            >
              Auditor Ext.
            </button>
          </div>
        </div>

        <div className="text-center text-[9px] font-medium text-slate-600">
          De conformidad con los estándares de trazabilidad WHO GACP y FDA GMP.
        </div>
      </div>
    </div>
  );
};
