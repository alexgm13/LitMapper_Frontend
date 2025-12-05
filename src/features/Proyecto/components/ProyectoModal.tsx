"use client";

import { useState } from "react";
import { Sparkles, FileText, Search, Plus, X, Check } from "lucide-react";
import { createProject } from "../services/proyecto";
import { useRouter } from "next/navigation";
import { useProyectoStore } from "../store/useProyectoStore";
import { ProjectModalProps } from "../types";
import { useAuthStore } from "../../../store/authStore";

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
    
  const [formData, setFormData] = useState({ titulo: '', descripcion: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const setProyectoActivo = useProyectoStore((state) => state.setProyectoActivo);
  const user = useAuthStore((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id_usuario) {
      alert("Usuario no identificado");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createProject({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        id_usuario: user.id_usuario, 
      });

      if (response.success && response.data) {
        const projectForStore = {
          id_proyecto: response.data.id_proyecto,
          titulo: response.data.titulo,
          descripcion: formData.descripcion,
          id_usuario: user.id_usuario
        };
        
        setProyectoActivo(projectForStore);
        console.log('Proyecto creado:', response);
        setShowSuccess(true);

        setTimeout(() => {
          router.push('/dashboard/contexto');
        }, 1000);

        setFormData({ titulo: '', descripcion: '' });
        onClose();
      } else {
        throw new Error(response.message || 'Error al crear proyecto');
      }
    } catch (error) {
      console.error('Error al crear proyecto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ titulo: '', descripcion: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Crear Nuevo Proyecto
            </h2>
            <p className="text-gray-600">
              Define tu tema de investigación para iniciar el proceso automatizado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="titulo" 
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Título del Proyecto
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Análisis de algoritmos de aprendizaje profundo en diagnóstico médico..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label 
                htmlFor="descripcion" 
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                Descripción del Proyecto
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe en detalle tu tema de investigación..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none text-gray-900"
                required
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando...</span>
                  </div>
                ) : (
                  'Crear Proyecto'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};