import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';
import { IconPhone, IconClose } from './Icons.jsx';

export default function InstallPrompt() {
  const { isInstallable, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 bg-white border-2 border-emerald-700 text-stone-900 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
          <IconPhone className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-black text-sm">Instalar acceso en tu teléfono</p>
          <p className="text-stone-600 text-xs font-medium">Abre la app directamente desde tu pantalla de inicio.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={install}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow transition-transform active:scale-95 whitespace-nowrap"
        >
          Instalar
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-500 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Cerrar aviso de instalación"
        >
          <IconClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
