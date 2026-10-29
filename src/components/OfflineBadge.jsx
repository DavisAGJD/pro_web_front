import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { IconSignalSlash } from './Icons.jsx';

export default function OfflineBadge() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-300 text-stone-900 border-b-2 border-amber-500 px-4 py-2 text-center text-xs sm:text-sm font-bold shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <IconSignalSlash className="w-5 h-5 flex-shrink-0" />
        <span>
          <strong>Sin señal de internet:</strong> Modo campo activo. Tus reportes se guardan en este dispositivo.
        </span>
      </div>
    </div>
  );
}
