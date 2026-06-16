"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getPermissions } from "./permissions";

export type Session = {
  name: string;
  email: string;
  role: string;
  company: string;
  companyId: string;
  permissions: string[];
};

const demoUsers = [
  {
    name: "Administrador FloraTrack",
    email: "admin@floratrack.com",
    password: "admin123",
    role: "Super Admin",
    company: "FloraTrack Enterprise",
    companyId: "floratrack_enterprise",
  },
  {
    name: "Director Técnico",
    email: "calidad@growlifecol.com",
    password: "gacp123",
    role: "Director Calidad",
    company: "Growlifecol S.A.S.",
    companyId: "growlifecol_sas",
  },
  {
    name: "Operador GACP",
    email: "operador@growlifecol.com",
    password: "gacp123",
    role: "Operador GACP",
    company: "Growlifecol S.A.S.",
    companyId: "growlifecol_sas",
  },
];

export default function LocalAuthGate({
  children,
}: {
  children: (session: Session, logout: () => void) => ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("admin@floratrack.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("floratrack_session");

    if (saved) {
      const parsed = JSON.parse(saved);

      const fixedSession: Session = {
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        company: parsed.company,
        companyId: parsed.companyId || "default_company",
        permissions: parsed.permissions || getPermissions(parsed.role),
      };

      localStorage.setItem("floratrack_session", JSON.stringify(fixedSession));
      setSession(fixedSession);
    }
  }, []);

  function login() {
    const user = demoUsers.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setError("Credenciales inválidas.");
      return;
    }

    const nextSession: Session = {
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      companyId: user.companyId,
      permissions: getPermissions(user.role),
    };

    localStorage.setItem("floratrack_session", JSON.stringify(nextSession));
    setSession(nextSession);
    setError("");
  }

  function logout() {
    localStorage.removeItem("floratrack_session");
    setSession(null);
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <section className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-green-600">FloraTrack</h1>
            <p className="text-slate-500 mt-3 text-lg">
              Enterprise Compliance Platform
            </p>
            <p className="text-slate-400 mt-1">
              GACP · GMP · GIS · IA · Traceability
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                Correo
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border rounded-xl px-4 py-4 text-slate-700 text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border rounded-xl px-4 py-4 text-slate-700 text-lg"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {error}
              </div>
            )}

            <button
              onClick={login}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-4 text-lg font-bold"
            >
              Ingresar
            </button>
          </div>

          <div className="mt-8 border rounded-2xl p-5 bg-slate-50">
            <div className="font-bold text-slate-700 mb-2">
              Usuarios de prueba
            </div>
            <div className="text-sm text-slate-500 space-y-1">
              <p>admin@floratrack.com / admin123</p>
              <p>calidad@growlifecol.com / gacp123</p>
              <p>operador@growlifecol.com / gacp123</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return <>{children(session, logout)}</>;
}
