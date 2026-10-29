import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReporteList from '../components/ReporteList.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import {
  obtenerReportesLocales,
  guardarReporteLocal,
  eliminarReporteLocal,
} from '../db/IndexedDB.js';
import { fetchReportes, eliminarReporte } from '../services/api.js';
import { sincronizarReportes } from '../services/sync.js';
import {
  IconPlus,
  IconSync,
  IconCheckCircle,
  IconAlertCircle,
  IconCloudUpload,
} from '../components/Icons.jsx';

export default function Reportes() {
  const isOnline = useOnlineStatus();
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function cargarDatos() {
    setCargando(true);
    try {
      const locales = await obtenerReportesLocales();

      if (isOnline) {
        try {
          const remotos = await fetchReportes();
          const idsRemotos = new Set(remotos.map((r) => r.id));

          // Limpiar locales que ya no existen en el servidor
          for (const l of locales) {
            if (l.sincronizado && !idsRemotos.has(l.id)) {
              await eliminarReporteLocal(l.id);
            }
          }

          // Guardar remotos en local
          for (const r of remotos) {
            await guardarReporteLocal({ ...r, sincronizado: true });
          }

          const actualizados = await obtenerReportesLocales();
          actualizados.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
          setReportes(actualizados);
        } catch {
          locales.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
          setReportes(locales);
        }
      } else {
        locales.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        setReportes(locales);
      }
    } catch {
      // Ignorar errores en carga inicial
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [isOnline]);

  async function handleSincronizar() {
    if (!isOnline) {
      setMensaje({
        tipo: 'error',
        texto: 'Sin señal de red en este momento. Los reportes siguen seguros en tu teléfono.',
      });
      return;
    }

    setSincronizando(true);
    setMensaje(null);
    try {
      const res = await sincronizarReportes();
      if (res.total === 0) {
        setMensaje({
          tipo: 'exito',
          texto: 'Todos los reportes ya se encuentran sincronizados con la oficina central.',
        });
      } else {
        setMensaje({
          tipo: 'exito',
          texto: `Se subieron con éxito ${res.sincronizados} de ${res.total} reporte(s) a la central.`,
        });
      }
      await cargarDatos();
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: 'No se pudo conectar con el servidor: ' + err.message,
      });
    } finally {
      setSincronizando(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Deseas eliminar definitivamente este reporte?')) return;

    try {
      await eliminarReporteLocal(id);
      if (isOnline) {
        try {
          await eliminarReporte(id);
        } catch {
          // Ignorar fallo remoto
        }
      }
      setReportes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('No se pudo eliminar el reporte: ' + err.message);
    }
  }

  const pendientesCount = reportes.filter((r) => !r.sincronizado).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
      {/* Encabezado y Acciones */}
      <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 mb-0.5">
              <Link to="/" className="hover:text-emerald-800 transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <span className="text-emerald-800">Mis Reportes</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Mis Reportes de Campo
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm font-semibold">
              {reportes.length} reporte(s) guardado(s) en total
              {pendientesCount > 0 ? (
                <span className="text-amber-700 font-extrabold ml-1">
                  ({pendientesCount} pendiente{pendientesCount > 1 ? 's' : ''} de señal)
                </span>
              ) : (
                <span className="text-emerald-700 font-extrabold ml-1">(Todos en central)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/nuevo"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              <span>Nuevo</span>
            </Link>

            <button
              onClick={handleSincronizar}
              disabled={sincronizando || !isOnline}
              className="bg-stone-100 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-50 border-2 border-stone-300 text-stone-900 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              title={isOnline ? 'Subir pendientes a la central' : 'Requiere señal'}
            >
              <IconSync className={`w-4 h-4 ${sincronizando ? 'animate-spin' : ''}`} />
              <span>{sincronizando ? 'Subiendo...' : 'Subir a Central'}</span>
            </button>
          </div>
        </div>
      </div>

      {mensaje && (
        <div
          className={`p-4 rounded-2xl text-sm font-extrabold border-2 shadow-sm transition-all flex items-center gap-2.5 ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
              : 'bg-amber-100 border-amber-600 text-amber-950'
          }`}
        >
          {mensaje.tipo === 'exito' ? (
            <IconCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-800" />
          ) : (
            <IconAlertCircle className="w-5 h-5 flex-shrink-0 text-amber-800" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      {/* Listado */}
      {cargando ? (
        <div className="bg-white border-2 border-stone-300 rounded-3xl p-10 text-center text-stone-600 font-bold space-y-2">
          <IconSync className="w-10 h-10 text-emerald-700 animate-spin mx-auto" />
          <p>Cargando reportes guardados...</p>
        </div>
      ) : (
        <ReporteList reportes={reportes} onDelete={handleDelete} />
      )}
    </div>
  );
}
