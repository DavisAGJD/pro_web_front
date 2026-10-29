import { useState } from 'react';
import {
  IconMapPin,
  IconSave,
  IconSync,
  IconLock,
  IconCheckCircle,
  IconAlertCircle,
} from './Icons.jsx';

export default function ReporteForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    titulo: '',
    cliente: '',
    descripcion: '',
    ubicacion: '',
    prioridad: 'media',
  });
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSetPrioridad(valor) {
    setForm({ ...form, prioridad: valor });
  }

  function handleGetLocation() {
    if (!navigator.geolocation) {
      alert('Tu teléfono no tiene activado el soporte de ubicación GPS.');
      return;
    }
    setLoadingGPS(true);
    setGpsStatus({ tipo: 'info', texto: 'Localizando satélites GPS...' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setForm({ ...form, ubicacion: coords });
        setGpsStatus({ tipo: 'ok', texto: 'Coordenadas GPS guardadas con éxito' });
        setLoadingGPS(false);
      },
      (err) => {
        setGpsStatus({
          tipo: 'error',
          texto: 'No se pudo obtener GPS: ' + (err.message || 'Permiso denegado'),
        });
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    onSubmit(form);
  }

  const baseInputStyle =
    'w-full bg-stone-50 border-2 border-stone-400 focus:border-emerald-700 focus:bg-white rounded-xl p-3.5 text-base sm:text-lg text-stone-950 font-bold placeholder-stone-400 focus:outline-none transition-all shadow-inner';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* SECCIÓN 1: CLIENTE Y UBICACIÓN */}
      <section className="bg-white border-2 border-stone-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <header className="flex items-center gap-2.5 pb-3 border-b-2 border-stone-200">
          <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow">
            1
          </span>
          <div>
            <h2 className="text-stone-900 font-black text-lg tracking-tight">
              Cliente y Ubicación
            </h2>
            <p className="text-stone-600 text-xs font-semibold">¿Dónde y a quién atendiste?</p>
          </div>
        </header>

        <div>
          <label className="block text-stone-900 font-extrabold text-sm sm:text-base mb-1.5" htmlFor="cliente">
            Nombre del Cliente o Predio *
          </label>
          <input
            id="cliente"
            name="cliente"
            type="text"
            required
            disabled={submitting}
            value={form.cliente}
            onChange={handleChange}
            placeholder="Ej: Rancho San José / Don Manuel / Pozo de Agua #3"
            className={baseInputStyle}
          />
        </div>

        <div>
          <label className="block text-stone-900 font-extrabold text-sm sm:text-base mb-1.5" htmlFor="ubicacion">
            Coordenadas GPS o Dirección
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="ubicacion"
              name="ubicacion"
              type="text"
              disabled={submitting}
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Dirección o presiona el botón Marcar GPS"
              className={baseInputStyle}
            />

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingGPS || submitting}
              className="bg-stone-200 hover:bg-stone-300 active:bg-stone-400 border-2 border-stone-400 text-stone-900 font-black px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap min-h-12 shadow-sm"
            >
              <IconMapPin className="w-5 h-5 text-emerald-800 flex-shrink-0" />
              <span className="text-sm font-black">
                {loadingGPS ? 'Buscando GPS...' : 'Marcar GPS'}
              </span>
            </button>
          </div>

          {gpsStatus && (
            <div
              className={`flex items-center gap-1.5 text-xs mt-2 font-bold ${
                gpsStatus.tipo === 'ok'
                  ? 'text-emerald-800'
                  : gpsStatus.tipo === 'error'
                  ? 'text-red-700'
                  : 'text-stone-600'
              }`}
            >
              {gpsStatus.tipo === 'ok' ? (
                <IconCheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-700" />
              ) : (
                <IconAlertCircle className="w-4 h-4 flex-shrink-0 text-amber-700" />
              )}
              <span>{gpsStatus.texto}</span>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN 2: DETALLE DEL TRABAJO */}
      <section className="bg-white border-2 border-stone-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <header className="flex items-center gap-2.5 pb-3 border-b-2 border-stone-200">
          <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow">
            2
          </span>
          <div>
            <h2 className="text-stone-900 font-black text-lg tracking-tight">
              Detalle del Trabajo o Falla
            </h2>
            <p className="text-stone-600 text-xs font-semibold">¿Qué problema hubo o qué se reparó?</p>
          </div>
        </header>

        <div>
          <label className="block text-stone-900 font-extrabold text-sm sm:text-base mb-1.5" htmlFor="titulo">
            Tipo de Trabajo o Título de la Falla *
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            disabled={submitting}
            value={form.titulo}
            onChange={handleChange}
            placeholder="Ej: Falla en transformador / Reparación de bomba de agua"
            className={baseInputStyle}
          />
        </div>

        <div>
          <label className="block text-stone-900 font-extrabold text-sm sm:text-base mb-1.5" htmlFor="descripcion">
            Descripción de lo realizado *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            disabled={submitting}
            rows={4}
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Explica qué encontraste, qué reparaste o qué material se utilizó..."
            className={`${baseInputStyle} resize-none`}
          />
        </div>
      </section>

      {/* SECCIÓN 3: PRIORIDAD */}
      <section className="bg-white border-2 border-stone-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <header className="flex items-center gap-2.5 pb-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow">
            3
          </span>
          <div>
            <h2 className="text-stone-900 font-black text-lg tracking-tight">
              Nivel de Prioridad
            </h2>
            <p className="text-stone-600 text-xs font-semibold">Selecciona la urgencia de atención:</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleSetPrioridad('baja')}
            disabled={submitting}
            className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center gap-2 transition-all ${
              form.prioridad === 'baja'
                ? 'bg-emerald-100 border-emerald-700 text-emerald-950 ring-2 ring-emerald-600'
                : 'bg-stone-50 border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-emerald-600 shadow-sm"></span>
            <span>Baja</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetPrioridad('media')}
            disabled={submitting}
            className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center gap-2 transition-all ${
              form.prioridad === 'media'
                ? 'bg-amber-100 border-amber-600 text-amber-950 ring-2 ring-amber-500'
                : 'bg-stone-50 border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-amber-500 shadow-sm"></span>
            <span>Normal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetPrioridad('alta')}
            disabled={submitting}
            className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center gap-2 transition-all ${
              form.prioridad === 'alta'
                ? 'bg-red-100 border-red-700 text-red-950 ring-2 ring-red-600'
                : 'bg-stone-50 border-stone-300 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></span>
            <span>Urgente</span>
          </button>
        </div>
      </section>

      {/* BOTÓN PRINCIPAL DE GUARDAR */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:bg-stone-400 disabled:cursor-not-allowed text-white font-black rounded-2xl p-5 min-h-16 text-xl shadow-md transition-transform active:scale-[0.99] flex items-center justify-center gap-3 border-2 border-emerald-900"
        >
          {submitting ? (
            <>
              <IconSync className="w-6 h-6 animate-spin text-white" />
              <span>Guardando reporte...</span>
            </>
          ) : (
            <>
              <IconSave className="w-6 h-6 text-white" />
              <span>GUARDAR REPORTE</span>
            </>
          )}
        </button>
        <p className="text-stone-600 text-xs text-center mt-2.5 font-bold flex items-center justify-center gap-1.5">
          <IconLock className="w-4 h-4 text-emerald-800" />
          <span>Se guarda inmediatamente en la memoria de este teléfono aunque no tengas cobertura.</span>
        </p>
      </div>
    </form>
  );
}
