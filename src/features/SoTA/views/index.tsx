"use client";

import { useEffect, useState } from "react";
import { FileText, Thermometer, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generarSota } from "@/features/SoTA/service/sota";

import { useContextoStore } from "@/features/Contexto/store/useContextoStore";
import { useArticuloDetalleStore } from "@/features/Detalle/store/useDetalleStore";

export default function SotaView() {
  const { articulosDetalle } = useArticuloDetalleStore();
  const contexto = useContextoStore((s) => s.contextoActivo);

  const [estadoArte, setEstadoArte] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [entropyData, setEntropyData] = useState(0);
  const [showEntropy, setShowEntropy] = useState(false);

  useEffect(() => {
    const fetchEstadoArte = async () => {
      if (!contexto || !articulosDetalle?.length) {
        setIsLoading(false);
        setEstadoArte("⚠️ No hay artículos procesados para generar el Estado del Arte.");
        return;
      }

      setIsLoading(true);
      try {
        const result = await generarSota(contexto, articulosDetalle);

        setEstadoArte(result.sota);
        setEntropyData(result.entropia);
        setShowEntropy(true);
      } catch (error) {
        console.error("❌ Error al generar el Estado del Arte:", error);
        setEstadoArte("Error al generar el Estado del Arte.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadoArte();
  }, [contexto, articulosDetalle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl mb-4 mx-auto">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Estado del Arte Generado
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            Documento generado automáticamente a partir de tus artículos relevantes procesados
          </p>
        </div>


        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generando Estado del Arte...
            </h3>
            <p className="text-gray-600 mb-4">
              Analizando y redactando automáticamente el documento
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* 🧮 Tarjeta de Entropía */}
            {showEntropy && entropyData && (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-200 mb-8 p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Métricas de Entropía del Estado del Arte
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-700">
                      {entropyData.toFixed(3)}
                    </div>
                    <div className="text-sm text-purple-600">Valor de Entropía</div>
                  </div>
                </div>
              </div>
            )}

            {/* 📄 Texto del Estado del Arte */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 prose max-w-none text-gray-900">
                <ReactMarkdown>{estadoArte}</ReactMarkdown>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                Información
              </h3>
              <p className="text-sm text-blue-700">
                Este estado del arte fue generado automáticamente mediante IA,
                con base en los artículos relevantes que procesaste.  
                La entropía mide la diversidad y riqueza informativa del texto.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
