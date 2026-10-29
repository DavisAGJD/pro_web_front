import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { IconLogo, IconPlus, IconFolder, IconHome, IconMenu, IconClose } from './Icons.jsx';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-stone-300 shadow-sm text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logotipo y Título */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow">
              <IconLogo className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="font-black text-lg sm:text-xl text-stone-900 tracking-tight block leading-tight">
                TechField
              </span>
              <p className="text-xs text-stone-600 font-semibold hidden sm:block">
                Servicios Técnicos en Campo
              </p>
            </div>
          </Link>

          {/* Enlaces de Navegación de Escritorio */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/nuevo"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`
              }
            >
              <IconPlus className="w-4 h-4" />
              <span>Nuevo Reporte</span>
            </NavLink>
            <NavLink
              to="/reportes"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`
              }
            >
              Mis Reportes
            </NavLink>
          </nav>

          {/* Botón Menú para Celulares */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden w-11 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-800 flex items-center justify-center transition-colors"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuAbierto ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú Desplegable en Celulares */}
        {menuAbierto && (
          <div className="md:hidden py-3 border-t-2 border-stone-200 space-y-1.5">
            <NavLink
              to="/"
              end
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl text-base font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              <IconHome className="w-5 h-5" />
              <span>Inicio</span>
            </NavLink>
            <NavLink
              to="/nuevo"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl text-base font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              <IconPlus className="w-5 h-5" />
              <span>Nuevo Reporte</span>
            </NavLink>
            <NavLink
              to="/reportes"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-3 rounded-xl text-base font-bold ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-800 hover:bg-stone-100'
                }`
              }
            >
              <IconFolder className="w-5 h-5" />
              <span>Mis Reportes</span>
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
