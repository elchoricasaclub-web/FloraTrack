"use client";

export default function FloraTrackLogo({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leafGrad" x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="lensGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a7f3d0" stopOpacity="0.2" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Sombra de la lupa / Halo tecnológico */}
      <circle cx="55" cy="55" r="45" fill="#022c22" opacity="0.3" blur="10" />

      {/* Aro de la lupa */}
      <circle cx="52" cy="52" r="40" stroke="#059669" strokeWidth="6" />
      <circle cx="52" cy="52" r="37" fill="url(#lensGrad)" />
      
      {/* Mango de la lupa */}
      <path 
        d="M80 80 L105 105" 
        stroke="#10b981" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      <path 
        d="M85 85 L100 100" 
        stroke="#a7f3d0" 
        strokeWidth="4" 
        strokeLinecap="round" 
        opacity="0.5"
      />

      {/* Hoja principal (Naturaleza / Cultivo) */}
      <path 
        d="M52 24 C 75 24, 75 50, 52 70 C 29 50, 29 24, 52 24 Z" 
        fill="url(#leafGrad)" 
      />

      {/* Hélice de ADN superpuesta en el centro de la hoja */}
      <path d="M42 35 Q 52 30 62 45 T 62 55" stroke="#ecfdf5" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M42 55 Q 52 60 62 45 T 62 35" stroke="#ecfdf5" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="45" cy="40" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="50" r="1.5" fill="#ffffff" />
      <circle cx="52" cy="45" r="1.5" fill="#ffffff" />

      {/* Código de barras en la base de la lupa (Trazabilidad) */}
      <rect x="36" y="74" width="3" height="12" fill="#34d399" />
      <rect x="41" y="74" width="5" height="10" fill="#34d399" />
      <rect x="48" y="74" width="2" height="14" fill="#34d399" />
      <rect x="52" y="74" width="4" height="11" fill="#34d399" />
      <rect x="58" y="74" width="2" height="13" fill="#34d399" />
      <rect x="62" y="74" width="6" height="9" fill="#34d399" />
      
      {/* Reflejo estilo vidrio (Glassmorfismo) */}
      <path d="M22 35 A 40 40 0 0 1 70 18 Q 60 40 22 35 Z" fill="#ffffff" opacity="0.1" />
    </svg>
  );
}
