import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { obtenerReportesLocales, obtenerPendientes } from '../db/IndexedDB.js';
import { sincronizarReportes, iniciarAutoSync } from '../services/sync.js';
import {
  IconClipboardPlus,
  IconFolder,
  IconSync,
  IconArrowRight,
  IconCloudUpload,
  IconSignalSlash,
  IconMapPin,
  IconCheckCircle,
} from '../components/Icons.jsx';

export default function Home() {
  const isOnline = useOnlineStatus();
  const [totalReportes, setTotalReportes] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  async function cargarEstadisticas() {
    try {
      const locales = await obtenerReportesLocales();
      const pends = await obtenerPendientes();
      setTotalReportes(locales.length);
      setPendientes(pends.length);
    } catch {
      // Ignorar errores en carga
    }
  }

  useEffect(() => {
    cargarEstadisticas();
    iniciarAutoSync();
  }, []);

  useEffect(() => {
    cargarEstadisticas();
  }, [isOnline]);

  async function handleSyncManual() {
    if (!isOnline) {
      alert('Para transmitir los reportes a la central se requiere conexión a internet o datos móviles.');
      return;
    }
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await sincronizarReportes();
      if (res.total === 0) {
        setSyncResult('Todos los reportes ya se encuentran guardados en la oficina central.');
      } else {
        setSyncResult(`Se transmitieron con éxito ${res.sincronizados} de ${res.total} reporte(s) a la central.`);
      }
      await cargarEstadisticas();
    } catch {
      setSyncResult('No se pudo conectar con el servidor.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 text-left">
      {/* ── 1. PANEL PRINCIPAL: PRESENTACIÓN DEL SISTEMA ── */}
      <section className="bg-white border-2 border-stone-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-4">
          {/* Distintivo de plataforma */}
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase px-3 py-1 rounded-full">
              Servicios Técnicos Rurales
            </span>
          </div>

          {/* Título claro y conciso */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              Servicio de Campo
            </h1>
            <p className="text-emerald-800 font-extrabold text-base sm:text-lg mt-0.5">
              Control de Órdenes y Levantamiento de Fallas en Sitio
            </p>
          </div>

          {/* Explicación sencilla orientada al trabajador */}
          <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
            Herramienta diseñada para el trabajo en zonas rurales y predios sin cobertura celular.
            Captura la falla técnica o mantenimiento realizado, toma tu ubicación GPS con un toque y los datos se guardarán en este teléfono para transmitirse a la central al volver a tener señal.
          </p>

          {/* Pastillas informativas con iconos SVG */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl">
              <IconSignalSlash className="w-4 h-4 text-emerald-800 flex-shrink-0" />
              <span>Funciona sin señal</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl">
              <IconMapPin className="w-4 h-4 text-emerald-800 flex-shrink-0" />
              <span>Coordenadas GPS</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl">
              <IconSync className="w-4 h-4 text-emerald-800 flex-shrink-0" />
              <span>Sincronización automática</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. AVISO DE REPORTES PENDIENTES DE ENVÍO (Si hay en memoria) ── */}
      {pendientes > 0 && (
        <section className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0">
              <IconCloudUpload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-stone-900 text-base">
                {pendientes} reporte(s) guardado(s) en la memoria del teléfono
              </p>
              <p className="text-stone-600 text-xs sm:text-sm font-medium">
                {isOnline
                  ? 'Hay señal disponible. Puedes enviarlos a la oficina central ahora mismo.'
                  : 'Se enviarán automáticamente cuando el teléfono recupere cobertura.'}
              </p>
            </div>
          </div>

          {isOnline && (
            <button
              onClick={handleSyncManual}
              disabled={syncing}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-sm px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap min-h-12"
            >
              <IconSync className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Transmitiendo...' : 'Transmitir a Central'}</span>
            </button>
          )}
        </section>
      )}

      {syncResult && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-950 text-sm font-bold text-center flex items-center justify-center gap-2">
          <IconCheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{syncResult}</span>
        </div>
      )}

      {/* ── 3. BOTONES DE ACCIÓN PRINCIPAL (ALTO IMPACTO Y VISIBILIDAD) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Opción 1: Levantar Nuevo Reporte (Destacado Verde Campo) */}
        <Link
          to="/nuevo"
          className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white border-2 border-emerald-900 rounded-3xl p-6 sm:p-7 shadow-md transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-md flex-shrink-0">
              <IconClipboardPlus className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Levantar Nuevo Reporte
              </h2>
              <p className="text-emerald-100 text-sm font-medium mt-1 leading-relaxed">
                Registra la falla técnica, asigna el cliente o predio y captura las coordenadas GPS.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-emerald-600/60 font-black text-sm sm:text-base">
            <span>Iniciar captura de orden</span>
            <IconArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Opción 2: Consultar Historial (Blanco de Alto Contraste) */}
        <Link
          to="/reportes"
          className="bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border-2 border-stone-400 hover:border-stone-500 rounded-3xl p-6 sm:p-7 shadow-sm transition-all group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-800 border-2 border-stone-300 flex items-center justify-center shadow-inner flex-shrink-0">
              <IconFolder className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  Historial de Reportes
                </h2>
                <span className="bg-stone-200 text-stone-900 text-xs font-black px-2.5 py-1 rounded-full border border-stone-300">
                  {totalReportes}
                </span>
              </div>
              <p className="text-stone-600 text-sm font-medium mt-1 leading-relaxed">
                Revisa los reportes registrados en este equipo y confirma si ya fueron transmitidos.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-200 font-black text-sm sm:text-base text-stone-800">
            <span>Ver listado de órdenes</span>
            <IconArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>
      </section>

      {/* ── 4. GUÍA RÁPIDA EN 3 PASOS PARA EL TÉCNICO EN CAMPO ── */}
      <section className="bg-white border-2 border-stone-300 rounded-3xl p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-black text-stone-900 mb-4 pb-2 border-b-2 border-stone-200 flex items-center gap-2">
          <span>¿Cómo utilizar esta herramienta en campo?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Paso 1 */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 flex gap-3 items-start">
            <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              1
            </span>
            <div>
              <h3 className="font-black text-stone-900 text-sm">Captura en sitio</h3>
              <p className="text-stone-600 text-xs mt-1 font-medium leading-relaxed">
                Llena el reporte aunque no tengas señal. La información se guarda directamente en la memoria del teléfono.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 flex gap-3 items-start">
            <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              2
            </span>
            <div>
              <h3 className="font-black text-stone-900 text-sm">Marca tu GPS</h3>
              <p className="text-stone-600 text-xs mt-1 font-medium leading-relaxed">
                Toca el botón «Marcar GPS» para guardar las coordenadas satelitales exactas del predio o falla.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-4 flex gap-3 items-start">
            <span className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              3
            </span>
            <div>
              <h3 className="font-black text-stone-900 text-sm">Transmisión automática</h3>
              <p className="text-stone-600 text-xs mt-1 font-medium leading-relaxed">
                Al salir a carretera o conectarte a Wi-Fi, todos tus reportes se envían a la base central de inmediato.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
