const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api/reportes`;

export async function fetchReportes() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener reportes');
  return res.json();
}

export async function crearReporte(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear reporte');
  return res.json();
}

export async function eliminarReporte(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar reporte');
  return res.json();
}
