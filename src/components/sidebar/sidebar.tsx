'use client';
import { useState } from 'react';
import { Folder, Search, BookOpen, BarChart3, Users, Settings, LogOut, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('proyectos');
  const router = useRouter();

  const menuItems = [
    { id: 'proyectos', label: 'Proyectos', icon: Folder, path: '/dashboard/proyecto' },
    // { id: 'articulos', label: 'Artículos', icon: Search },
    // { id: 'reportes', label: 'Reportes', icon: BookOpen },
    // { id: 'analisis', label: 'Análisis', icon: BarChart3 },
    // { id: 'usuarios', label: 'Usuarios', icon: Users },
    // { id: 'configuracion', label: 'Configuración', icon: Settings }
  ];

  const handleNavigation = (path: string, id: string) => {
    setActiveMenuItem(id);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          <div className={`p-4 border-b border-gray-200 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          } flex items-center`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Layout className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">LitMapper AI</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path, item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        activeMenuItem === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile and Logout */}
          <div className={`p-4 border-t border-gray-200 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          } flex items-center`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">U</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Usuario</p>
                  <p className="text-xs text-gray-500">Investigador</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">U</span>
              </div>
            )}
            <button 
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
