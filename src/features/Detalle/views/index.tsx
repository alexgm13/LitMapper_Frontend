"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, ExternalLink, CheckCircle, BarChart2, Activity, X } from "lucide-react";
import styles from "./detalle.module.css";
import { procesarPDF } from "../services/detalle";
import { useArticuloStore } from "@/features/Articulo/store/useArticuloStore";
import { useContextoStore } from "@/features/Contexto/store/useContextoStore";
import { useRouter } from "next/navigation";
import { ArticuloDetalleListado } from "../types";
import { useProyectoStore } from "@/features/Proyecto/store/useProyectoStore";
import { useArticuloDetalleStore } from "../store/useDetalleStore";

// Modal Components
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const MetricsModal = ({ article, isOpen, onClose }: { article: ArticuloDetalleListado; isOpen: boolean; onClose: () => void }) => {
  const score = article.score?.score_factualidad_descripcion || 0;
  // 0 -> High Hallucination (Bad), 1 -> Low Hallucination (Good)
  const isGood = score > 0.7;
  const isMedium = score > 0.4 && score <= 0.7;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Métricas de Alucinación">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div 
            className={`h-4 rounded-full ${isGood ? 'bg-green-600' : isMedium ? 'bg-yellow-500' : 'bg-red-600'}`} 
            style={{ width: `${score * 100}%` }}
          ></div>
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800">{score.toFixed(2)}</span>
          <p className="text-sm text-gray-600 mt-2">
            {score > 0.8 ? "Alta confiabilidad. El modelo probablemente no alucinó." : 
             score > 0.4 ? "Confiabilidad media. Verificar manualmente." : 
             "Baja confiabilidad. Posible alucinación detectada."}
          </p>
        </div>
      </div>
    </Modal>
  );
};

const EntropyModal = ({ article, isOpen, onClose }: { article: ArticuloDetalleListado; isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entropía del Modelo">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-blue-50 rounded-full">
            <Activity className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800">{article.entropy?.toFixed(4) || "N/A"}</span>
          <p className="text-sm text-gray-600 mt-2">
            Valor de entropía devuelto por el modelo.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default function DetalleView() {
  const { articulosRelevantes } = useArticuloStore();
  const [articles, setArticles] = useState<ArticuloDetalleListado[]>([]);
  
  // State for loading per article
  const [uploadingArticles, setUploadingArticles] = useState<Record<number, boolean>>({});
  
  // State for modals
  const [activeModal, setActiveModal] = useState<{ type: 'metrics' | 'entropy' | null, articleId: number | null }>({ type: null, articleId: null });

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const proyecto = useProyectoStore((s) => s.proyectoActivo);
  const contexto = useContextoStore((s) => s.contextoActivo);
  const router = useRouter();
  const setArticulosDetalle = useArticuloDetalleStore((s) => s.setArticulosDetalle);


  useEffect(() => {
    if (articulosRelevantes.length > 0) {
      console.log("Articulos relevantes en Detalle:", articulosRelevantes);
      const mappedArticles: ArticuloDetalleListado[] = articulosRelevantes.map((a, index) => ({
        id_articulo_detalle: a.id_articulo ?? index,
        titulo: a.titulo,
        autores: [],
        palabras_clave: [],
        doi: a.doi || "",
        objetivo_estudio: "",
        enfoque_metodologico: "",
        principales_resultados: "",
        brechas_identificada: { tipo: "", descripcion: "" }, 
        notas_relevancia_contexto: a.detalle.justificacion, 
        pdf_procesado: false,
      }));
      setArticles(mappedArticles);
    }
  }, [articulosRelevantes]);


  const handleFileChange = async (idDetalle: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!contexto) return router.push("/proyecto");
    if (file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido");
      return;
    }

    setUploadingArticles(prev => ({ ...prev, [idDetalle]: true }));

    try {
      const result = await procesarPDF(file);
      console.log("PDF procesado:", result);

      setArticles((prev) =>
        prev.map((a) =>
          a.id_articulo_detalle === idDetalle
            ? { ...a, ...result, pdf_procesado: true }
            : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar el PDF");
    } finally {
        setUploadingArticles(prev => ({ ...prev, [idDetalle]: false }));
    }
  };
  
  const handleGenerarEstadoDelArte = () => {
    if (articles.length === 0) {
      alert("No hay artículos cargados.");
      return;
    }

    const procesados = articles.filter((a) => a.pdf_procesado);

    if (procesados.length < 1) {
      alert("Debes procesar al menos 5 artículos antes de generar el Estado del Arte.");
      return;
    }

    setArticulosDetalle(procesados);

    router.push("/dashboard/sota");
  };

  const openModal = (type: 'metrics' | 'entropy', articleId: number) => {
    setActiveModal({ type, articleId });
  };

  const closeModal = () => {
    setActiveModal({ type: null, articleId: null });
  };

  const getActiveArticle = () => {
    return articles.find(a => a.id_articulo_detalle === activeModal.articleId);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className={styles.title}>Análisis de Artículos Relevantes</h1>
          <p className={styles.subtitle}>
            Sube el PDF de cada artículo para extraer automáticamente información clave.
          </p>
           <button
              onClick={() => handleGenerarEstadoDelArte()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Generar Estado del Arte
            </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Investigación</th>
                <th>Objetivo</th>
                <th>Metodología</th>
                <th>Hallazgos</th>
                <th>Tipo Brecha</th>
                <th>Brecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id_articulo_detalle}>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{a.titulo}</span>
                      {a.doi ? (
                        <a 
                          href={`https://doi.org/${a.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()} 
                        >
                          doi.org/{a.doi}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No DOI disponible</span>
                      )}
                    </div>
                  </td>
                  <td>{a.objetivo_estudio || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.enfoque_metodologico || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.principales_resultados || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.brechas_identificada?.tipo || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.brechas_identificada?.descripcion || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>
                    {a.pdf_procesado ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Procesado
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Pendiente</span>
                    )}
                  </td>
                  <td className="relative">
                    <div className="flex items-center gap-2">
                        {/* Option 1: Upload PDF */}
                        <button
                            onClick={() => document.getElementById(`pdf-${a.id_articulo_detalle}`)?.click()}
                            disabled={uploadingArticles[a.id_articulo_detalle!] || a.pdf_procesado}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Subir PDF"
                        >
                            {uploadingArticles[a.id_articulo_detalle!] ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                        </button>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(a.id_articulo_detalle!, e)}
                            className="hidden"
                            id={`pdf-${a.id_articulo_detalle}`}
                        />

                        {/* Option 2: Metrics */}
                        <button
                            onClick={() => openModal('metrics', a.id_articulo_detalle!)}
                            disabled={!a.pdf_procesado}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ver métricas"
                        >
                            <BarChart2 className="w-5 h-5" />
                        </button>

                        {/* Option 3: Entropy */}
                        <button
                            onClick={() => openModal('entropy', a.id_articulo_detalle!)}
                            disabled={!a.pdf_procesado}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ver entropía"
                        >
                            <Activity className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeModal.type === 'metrics' && getActiveArticle() && (
        <MetricsModal 
            article={getActiveArticle()!} 
            isOpen={true} 
            onClose={closeModal} 
        />
      )}
      {activeModal.type === 'entropy' && getActiveArticle() && (
        <EntropyModal 
            article={getActiveArticle()!} 
            isOpen={true} 
            onClose={closeModal} 
        />
      )}
    </div>
  );
}
