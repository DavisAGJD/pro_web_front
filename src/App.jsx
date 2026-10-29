import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import OfflineBadge from './components/OfflineBadge.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import Home from './pages/Home.jsx';
import NuevoReporte from './pages/NuevoReporte.jsx';
import Reportes from './pages/Reportes.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-700 selection:text-white">
      {/* 1. Barra de navegación superior fija */}
      <Navbar />

      {/* 2. Banner de aviso cuando no hay internet */}
      <OfflineBadge />

      {/* 3. Contenido principal */}
      <main className="flex-1 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevo" element={<NuevoReporte />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>

      {/* 4. Banner para instalar la App */}
      <InstallPrompt />
    </div>
  );
}
