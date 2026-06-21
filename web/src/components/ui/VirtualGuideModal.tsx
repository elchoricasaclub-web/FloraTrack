import React, { useState } from 'react';
import { Bot, X, Play, Info } from 'lucide-react';

interface VirtualGuideProps {
  moduleName: string;
  description: string;
  steps: string[];
  videoUrl?: string;
  avatarUrl?: string; // URL para la imagen del asistente/personaje virtual
}

export const VirtualGuideButton: React.FC<VirtualGuideProps> = ({
  moduleName,
  description,
  steps,
  videoUrl,
  avatarUrl = "https://ui-avatars.com/api/?name=AI+Guide&background=0284c7&color=fff&size=128", // Avatar por defecto (AI)
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 font-medium z-40 fixed bottom-6 right-6"
        title={`Ayuda para ${moduleName}`}
      >
        <Bot className="w-5 h-5" />
        <span>Instrucciones: {moduleName}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
            
            {/* Sección Lateral: Personaje Virtual (Avatar) */}
            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl mb-4 relative">
                <img src={avatarUrl} alt="Asistente Virtual" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">FloraGuard IA</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tu asistente experto en {moduleName}.
              </p>
            </div>

            {/* Contenido Principal: Video + Pasos */}
            <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto max-h-[85vh]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Info className="w-6 h-6 text-indigo-500" />
                    Guía: {moduleName}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    {description}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Placeholder */}
              <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden mb-8 relative group shadow-md border border-slate-200 dark:border-slate-700">
                {videoUrl ? (
                  <iframe 
                    className="w-full h-full" 
                    src={videoUrl} 
                    title={`Video instructivo de ${moduleName}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 cursor-pointer group-hover:scale-110 group-hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <p className="text-slate-300 font-medium">Clic para reproducir video explicativo</p>
                  </div>
                )}
              </div>

              {/* Steps List */}
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Pasos a seguir:</h4>
              <ul className="space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full font-bold shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 pt-1 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};
