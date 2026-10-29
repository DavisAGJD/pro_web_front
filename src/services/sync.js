import { obtenerPendientes, marcarSincronizado } from '../db/IndexedDB.js';

const API_URL = '/api/reportes';

// Sincronizar reportes pendientes cuando hay conexión
export async function sincronizarReportes() {
  const pendientes = await obtenerPendientes();
  
  if (pendientes.length === 0) {
    return { sincronizados: 0, total: 0 };
  }

  let sincronizados = 0;

  for (const reporte of pendientes) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporte),
      });

      if (res.ok) {
        await marcarSincronizado(reporte.id);
        sincronizados++;
      }
    } catch {
      // Ignorar fallas temporales de red en sincronización silenciosa
    }
  }

  return { sincronizados, total: pendientes.length };
}

// Escuchar cuando vuelve la conexión y sincronizar automáticamente
export function iniciarAutoSync() {
  window.addEventListener('online', () => {
    sincronizarReportes();
  });
}
