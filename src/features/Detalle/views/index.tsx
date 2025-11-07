"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, FileText, ExternalLink, CheckCircle } from "lucide-react";
import styles from "./detalle.module.css";
import { obtenerArticulosRelevantesDetallados, procesarPDF } from "../services/detalle";
import { useArticuloStore } from "@/features/Articulo/store/useArticuloStore";
import { useContextoStore } from "@/features/Contexto/store/useContextoStore";
import { useRouter } from "next/navigation";
import { ArticuloDetalleListado } from "../types";
import { useProyectoStore } from "@/features/Proyecto/store/useProyectoStore";
import { useArticuloDetalleStore } from "../store/useDetalleStore";

export default function DetalleView() {
  const { articulosRelevantes } = useArticuloStore();
  const [articles, setArticles] = useState<ArticuloDetalleListado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const proyecto = useProyectoStore((s) => s.proyectoActivo);
  const contexto = useContextoStore((s) => s.contextoActivo);
  const router = useRouter();
  const setArticulosDetalle = useArticuloDetalleStore((s) => s.setArticulosDetalle);


  useEffect(() => {
    if (!proyecto?.id_proyecto) return;

    const fetchRelevantes = async () => {
      setIsLoading(true);
      try {
        if (!proyecto.id_proyecto) return;
        const result = await obtenerArticulosRelevantesDetallados(proyecto.id_proyecto);
        setArticles(result);
      } catch (err) {
        console.error("Error al obtener artículos relevantes:", err);
        alert("No se pudieron cargar los artículos relevantes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelevantes();
  }, [proyecto?.id_proyecto]);


  const handleFileChange = async (idDetalle: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!contexto) return router.push("/proyecto");
    if (file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido");
      return;
    }

    try {
      const result = await procesarPDF(file, contexto);
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
    }
  };
  
  const handleGenerarEstadoDelArte = () => {
    if (articles.length === 0) {
      alert("No hay artículos cargados.");
      return;
    }

    const procesados = articles.filter((a) => a.pdf_procesado);

    // Validar cantidad mínima y estado de procesamiento
    if (procesados.length < 1) {
      alert("Debes procesar al menos 5 artículos antes de generar el Estado del Arte.");
      return;
    }

    setArticulosDetalle(procesados);

    router.push("/sota");
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id_articulo_detalle}>
                  <td>{a.titulo}</td>
                  <td>{a.objetivo_estudio || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.enfoque_metodologico || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.principales_resultados || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.tipo_brecha || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.brecha_identificada || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>
                    {a.pdf_procesado ? (
                      <span className={styles.processed}>
                        <CheckCircle className="w-4 h-4" /> Procesado
                      </span>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(a.id_articulo_detalle!, e)}
                          className="hidden"
                          id={`pdf-${a.id_articulo_detalle}`}
                        />
                        <label htmlFor={`pdf-${a.id_articulo_detalle}`} className={styles.uploadButton}>
                          <Upload className="w-4 h-4" /> Subir PDF
                        </label>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
