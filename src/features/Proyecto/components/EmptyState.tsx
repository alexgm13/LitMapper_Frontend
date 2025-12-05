import { Plus, Folder} from 'lucide-react';

export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Folder className="w-10 h-10 text-gray-400" />
      </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No tienes proyectos aún
    </h3>
    <p className="text-gray-600 mb-6">
      Crea tu primer proyecto de investigación para comenzar a generar estados del arte automatizados
    </p>
    <button
      onClick={onCreate}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Crear Primer Proyecto
      </div>
    </button>
  </div>
)}
