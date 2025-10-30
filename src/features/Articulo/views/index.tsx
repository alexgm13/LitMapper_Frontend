"use client";
import { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle, Filter, Settings } from "lucide-react";
import styles from "./articulo.module.css";
import { subirArchivoCSV } from "../services/articulo";
import { useContextoStore } from "@/features/Contexto/store/useContextoStore";
import type { Articulo } from "../types";
import { useRouter } from "next/navigation";
import { useArticuloStore } from "../store/useArticuloStore";

export default function ArticleSelector() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [articles, setArticles] = useState<Articulo[]>([]);
  const [activeTab, setActiveTab] = useState<"relevant" | "non-relevant">("relevant");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contexto = useContextoStore((s) => s.contextoActivo);
  const router = useRouter();
  const setArticulosRelevantes = useArticuloStore((s) => s.setArticulosRelevantes);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") setFile(selectedFile);
    else alert("Por favor selecciona un archivo CSV válido");
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!contexto) {
      alert("Error: No hay un contexto activo. Por favor, selecciona uno.");
      return;
    }
    setIsUploading(true);
    try {
      const result = await subirArchivoCSV(file, contexto);
      setArticles(result);
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error al procesar el archivo en el servidor.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleToggleRelevancia = async (doi?: string) => {
    if (!doi) return; 
    const prev = [...articles];
    setArticles((curr) =>
      curr.map((a) => (a.doi === doi ? { ...a, es_relevante: !a.es_relevante } : a))
    );
  };

  const resetSelection = () => {
    setArticles([]);
    setFile(null);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleEnviarRelevantes = () => {
    const relevantes = articles.filter((a) => a.es_relevante);
    if (relevantes.length === 0) {
      alert("No hay artículos relevantes para enviar.");
      return;
    }
    setArticulosRelevantes(relevantes);
    router.push("/articulo/detalle");
  };

  const relevantArticles = articles.filter((a) => a.es_relevante);
  const nonRelevantArticles = articles.filter((a) => !a.es_relevante);
  const filteredArticles = activeTab === "relevant" ? relevantArticles : nonRelevantArticles;

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {!uploadSuccess ? (
          <div className={styles.uploadCard}>
            <div className="text-center">
              <div className={styles.uploadIcon}>
                <Upload className="w-10 h-10" />
              </div>
              <h2 className={styles.sectionTitle}>Subir Archivo CSV</h2>
              <p className={styles.sectionText}>
                Sube un archivo CSV con tus artículos exportados desde Scopus o IEEE.
              </p>

              <div className={styles.uploadActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className={styles.uploadButton}>
                  Seleccionar Archivo
                </label>
                {file && <span className={styles.fileName}>{file.name}</span>}
              </div>

              {file && (
                <button onClick={handleUpload} disabled={isUploading} className={styles.processButton}>
                  {isUploading ? "Procesando..." : "Procesar Archivo"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.resultsCard}>
            <div className={styles.resultsHeader}>
            <div>
                <h2 className={styles.sectionTitle}>Artículos Procesados</h2>
                <p className={styles.sectionText}>
                Total: {articles.length} • Relevantes: {relevantArticles.length} • No relevantes:{" "}
                {nonRelevantArticles.length}
                </p>
            </div>

            <div className={styles.actions}>
                <button onClick={handleEnviarRelevantes} className={styles.sendButton}>
                <CheckCircle className="w-4 h-4" /> Enviar Relevantes
                </button>

                <button onClick={resetSelection} className={styles.resetButton}>
                <XCircle className="w-4 h-4" /> Reiniciar
                </button>
            </div>
            </div>


            <div className={styles.tabNav}>
              <button
                onClick={() => setActiveTab("relevant")}
                className={`${styles.tab} ${activeTab === "relevant" ? styles.tabActiveBlue : ""}`}
              >
                <CheckCircle className="w-4 h-4" /> Relevantes ({relevantArticles.length})
              </button>
              <button
                onClick={() => setActiveTab("non-relevant")}
                className={`${styles.tab} ${activeTab === "non-relevant" ? styles.tabActiveRed : ""}`}
              >
                <XCircle className="w-4 h-4" /> No Relevantes ({nonRelevantArticles.length})
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: "#f9fafb" }}>
                  <tr>
                    <th className={styles.tableHeader}>DOI</th>
                    <th className={styles.tableHeader}>Título</th>
                    <th className={styles.tableHeader}>Año</th>
                    <th className={styles.tableHeader}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((a, idx) => (
                    <tr key={a.doi || idx}>
                      <td className={`${styles.tableCell} ${styles.tdDoi}`}>{a.doi}</td>
                      <td className={`${styles.tableCell} ${styles.tdTitle}`}>{a.titulo}</td>
                      <td className={styles.tableCell}>{a.anio ?? "—"}</td>
                      <td className={styles.tableCell}>
                        <button
                          className={styles.actionButton}
                          title={
                            a.es_relevante ? "Marcar como NO relevante" : "Marcar como relevante"
                          }
                          onClick={() => handleToggleRelevancia(a.doi)}
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredArticles.length === 0 && (
                <div className={styles.emptyState}>
                  <Filter className="w-8 h-8 text-gray-400" />
                  <p className="text-gray-500">No hay artículos en esta categoría</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
