import {
  IconUser,
  IconMapPin,
  IconCheckCircle,
  IconSync,
  IconCalendar,
  IconTrash,
} from './Icons.jsx';

const prioridadBadges = {
  alta: {
    bg: 'bg-red-50 border-2 border-red-500 text-red-950',
    dot: 'bg-red-600',
    label: 'Urgente',
  },
  media: {
    bg: 'bg-amber-50 border-2 border-amber-500 text-amber-950',
    dot: 'bg-amber-500',
    label: 'Normal',
  },
  baja: {
    bg: 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950',
    dot: 'bg-emerald-600',
    label: 'Baja',
  },
};

function formatFecha(fecha) {
  if (!fecha) return 'Fecha no disponible';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReporteCard({ reporte, onDelete }) {
  const prioridad = prioridadBadges[reporte.prioridad] || prioridadBadges.media;

  return (
    <article className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm relative space-y-3 text-left">
      {/* Encabezado: Título + Prioridad */}
      <div className="flex items-start justify-between gap-3 border-b-2 border-stone-200 pb-3">
        <div className="flex-1 min-w-0">
          <span className="text-stone-500 text-xs font-mono font-bold uppercase tracking-wider block mb-0.5">
            Folio: #{String(reporte.id).slice(-8)}
          </span>
          <h3 className="text-stone-900 font-black text-lg sm:text-xl leading-snug break-words">
            {reporte.titulo}
          </h3>
          <p className="text-emerald-800 font-extrabold text-sm sm:text-base mt-1 flex items-center gap-1.5">
            <IconUser className="w-4 h-4 text-emerald-800 flex-shrink-0" />
            <span>{reporte.cliente}</span>
          </p>
        </div>

        <span
          className={`text-xs sm:text-sm font-black px-3 py-1 rounded-xl border flex items-center gap-2 flex-shrink-0 ${prioridad.bg}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${prioridad.dot}`}></span>
          <span>{prioridad.label}</span>
        </span>
      </div>

      {/* Descripción */}
      {reporte.descripcion && (
        <div className="bg-stone-50 border border-stone-300 rounded-xl p-3.5">
          <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
            {reporte.descripcion}
          </p>
        </div>
      )}

      {/* Ubicación GPS */}
      {reporte.ubicacion && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-700 font-bold">
          <IconMapPin className="w-4 h-4 text-emerald-800 flex-shrink-0" />
          <span className="truncate">Lugar / GPS: {reporte.ubicacion}</span>
        </div>
      )}

      {/* Pie de tarjeta: Estado + Fecha + Botón Eliminar */}
      <div className="pt-3 border-t-2 border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          {reporte.sincronizado ? (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-900 bg-emerald-100 border border-emerald-500 px-3 py-1 rounded-lg">
              <IconCheckCircle className="w-4 h-4 text-emerald-800 flex-shrink-0" />
              <span>Guardado en Central</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-900 bg-amber-100 border border-amber-500 px-3 py-1 rounded-lg">
              <IconSync className="w-4 h-4 text-amber-800 flex-shrink-0" />
              <span>En Teléfono (Pendiente de señal)</span>
            </span>
          )}
          <span className="text-stone-500 text-xs font-semibold flex items-center gap-1.5 mt-1.5">
            <IconCalendar className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
            <span>{formatFecha(reporte.fechaCreacion)}</span>
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(reporte.id)}
            className="text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border-2 border-red-300 font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            title="Borrar reporte"
          >
            <IconTrash className="w-4 h-4" />
            <span>Borrar</span>
          </button>
        )}
      </div>
    </article>
  );
}
