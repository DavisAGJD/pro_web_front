import ReporteCard from './ReporteCard.jsx';
import { Link } from 'react-router-dom';
import { IconClipboard, IconPlus } from './Icons.jsx';

export default function ReporteList({ reportes, onDelete }) {
  if (!reportes || reportes.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-8 text-center space-y-4 my-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border-2 border-stone-300 flex items-center justify-center mx-auto text-stone-500">
          <IconClipboard className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-stone-900 font-black text-xl">
            No hay reportes registrados
          </h2>
          <p className="text-stone-600 text-sm max-w-sm mx-auto font-medium">
            Cuando visites un predio o atiendas una falla técnica, presiona el botón para levantar una nueva orden.
          </p>
        </div>
        <Link
          to="/nuevo"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3.5 rounded-xl shadow-md transition-transform active:scale-95 text-base border-2 border-emerald-900"
        >
          <IconPlus className="w-5 h-5" />
          <span>Crear Primer Reporte</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reportes.map((reporte) => (
        <ReporteCard key={reporte.id} reporte={reporte} onDelete={onDelete} />
      ))}
    </div>
  );
}
