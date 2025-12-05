'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Layers,
  AlertTriangle,
  FlaskConical,
  Save,
  ArrowLeft,
  Check
} from "lucide-react";
import { useProyectoStore } from "@/features/Proyecto/store/useProyectoStore";
import { createContexto } from "../services/contexto";
import { useContextoStore } from "../store/useContextoStore";

export default function ContextoView() {
  const [formData, setFormData] = useState({
    areaGeneral: "",
    temaEspecifico: "",
    problemaInvestigacion: "",
    metodologia: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const proyecto = useProyectoStore((state) => state.proyectoActivo);
  const router = useRouter();
  const setContextoActivo = useContextoStore((state) => state.setContextoActivo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const response = await createContexto({
        id_proyecto: proyecto?.id_proyecto!,
        area_general: formData.areaGeneral,
        tema_especifico: formData.temaEspecifico,
        problema_investigacion: formData.problemaInvestigacion,
        metodologia: formData.metodologia,
    });

        if (response.success && response.data) {
            setContextoActivo(response.data);
            console.log("✅ Contexto creado:", response.data);
            setShowSuccess(true);
             setTimeout(() => {
                router.push("/dashboard/articulo");
              }, 1000);
        } else {
            throw new Error(response.message || "Error al crear contexto");
        }
    } catch (error) {
        console.error("Error al crear Contexto:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/proyecto");
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Delimitación del Tema
            </h1>
            <p className="text-blue-100">
              Define con precisión los límites de tu investigación
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="p-4 bg-green-50 border-b border-green-200 text-green-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">¡Delimitación guardada exitosamente!</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Área General de Investigación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  Área General de Investigación
                </label>
                <input
                  type="text"
                  name="areaGeneral"
                  value={formData.areaGeneral}
                  onChange={handleChange}
                  placeholder="Ej: Ciencias de la Computación, Salud Pública..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Tema Específico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600" />
                  Tema Específico
                </label>
                <input
                  type="text"
                  name="temaEspecifico"
                  value={formData.temaEspecifico}
                  onChange={handleChange}
                  placeholder="Ej: Algoritmos de aprendizaje profundo para diagnóstico médico..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Problema de Investigación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Problema de Investigación
                </label>
                <textarea
                  name="problemaInvestigacion"
                  value={formData.problemaInvestigacion}
                  onChange={handleChange}
                  placeholder="Formula claramente el problema que deseas investigar..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white resize-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Metodología o Método */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-purple-600" />
                  Metodología o Método
                </label>
                <textarea
                  name="metodologia"
                  value={formData.metodologia}
                  onChange={handleChange}
                  placeholder="Describe el enfoque metodológico que utilizarás..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-gray-50 hover:bg-white resize-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </div>
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>Guardar y Continuar</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
