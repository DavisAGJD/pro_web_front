import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReporteForm from '../components/ReporteForm.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { guardarReporteLocal } from '../db/IndexedDB.js';
import { crearReporte } from '../services/api.js';
import {
  IconArrowLeft,
  IconCheckCircle,
  IconCloudUpload,
  IconAlertCircle,
} from '../components/Icons.jsx';

export default function NuevoReporte() {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function handleSubmit(formData) {
    if (submitting) return;
    setSubmitting(true);
    setMensaje(null);

    const nuevoReporte = {
      id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ...formData,
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
    };

    try {
      if (isOnline) {
        try {
          const creado = await crearReporte(nuevoReporte);
          await guardarReporteLocal({ ...creado, sincronizado: true });
          setMensaje({
            tipo: 'exito',
            texto: 'Reporte guardado y transmitido a la central con éxito.',
          });
        } catch {
          await guardarReporteLocal({ ...nuevoReporte, sincronizado: false });
          setMensaje({
            tipo: 'offline',
            texto: 'Servidor ocupado. Reporte guardado de forma segura en este teléfono.',
          });
        }
      } else {
        await guardarReporteLocal({ ...nuevoReporte, sincronizado: false });
        setMensaje({
          tipo: 'offline',
          texto: 'Modo campo: Reporte guardado en este teléfono. Se transmitirá en cuanto tengas cobertura.',
        });
      }

      setTimeout(() => {
        navigate('/reportes');
      }, 1200);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: 'Error al guardar el reporte: ' + err.message,
      });
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Encabezado y Regreso */}
      <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 mb-0.5">
            <Link to="/" className="hover:text-emerald-800 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-emerald-800">Nuevo Reporte</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Levantar Reporte
          </h1>
          <p className="text-stone-600 text-xs font-medium">
            Completa los datos del trabajo realizado en campo
          </p>
        </div>

        <Link
          to="/"
          className="bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-800 font-extrabold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <IconArrowLeft className="w-4 h-4 text-stone-700" />
          <span>Volver</span>
        </Link>
      </div>

      {mensaje && (
        <div
          className={`p-4 rounded-2xl text-sm sm:text-base font-black border-2 shadow-sm transition-all flex items-center gap-2.5 ${
            mensaje.tipo === 'exito'
              ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
              : mensaje.tipo === 'offline'
              ? 'bg-amber-100 border-amber-600 text-amber-950'
              : 'bg-red-100 border-red-600 text-red-950'
          }`}
        >
          {mensaje.tipo === 'exito' && (
            <IconCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-800" />
          )}
          {mensaje.tipo === 'offline' && (
            <IconCloudUpload className="w-5 h-5 flex-shrink-0 text-amber-800" />
          )}
          {mensaje.tipo === 'error' && (
            <IconAlertCircle className="w-5 h-5 flex-shrink-0 text-red-800" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      <ReporteForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
