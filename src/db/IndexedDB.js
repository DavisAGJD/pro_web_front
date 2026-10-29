import { openDB } from 'idb';

const DB_NAME = 'techfield-db';
const DB_VERSION = 1;
const STORE_NAME = 'reportes';

// Abrir/crear la base de datos IndexedDB
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('fechaCreacion', 'fechaCreacion');
      }
    },
  });
}

// Guardar un reporte localmente respetando su estado de sincronización
export async function guardarReporteLocal(reporte) {
  const db = await getDB();
  const sincronizado = reporte.sincronizado !== undefined ? Boolean(reporte.sincronizado) : false;
  await db.put(STORE_NAME, { ...reporte, sincronizado });
}

// Obtener todos los reportes locales
export async function obtenerReportesLocales() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

// Obtener reportes pendientes de sincronizar (sin usar boolean en IDBIndex)
export async function obtenerPendientes() {
  const db = await getDB();
  const todos = await db.getAll(STORE_NAME);
  return todos.filter((r) => !r.sincronizado);
}

// Marcar reporte como sincronizado
export async function marcarSincronizado(id) {
  const db = await getDB();
  const reporte = await db.get(STORE_NAME, id);
  if (reporte) {
    reporte.sincronizado = true;
    await db.put(STORE_NAME, reporte);
  }
}

// Eliminar un reporte local
export async function eliminarReporteLocal(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

// Limpiar todos los reportes
export async function limpiarReportes() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
