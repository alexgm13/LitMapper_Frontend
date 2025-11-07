"use client";
import { useState, useRef, useEffect } from "react";

import { Upload, CheckCircle, XCircle, Filter, Settings } from "lucide-react";
import styles from "./articulo.module.css";
import { actualizarRelevancia, obtenerArticulos, subirArchivoCSV } from "../services/articulo";
import { useContextoStore } from "@/features/Contexto/store/useContextoStore";
import type { ArticuloListado } from "../types";
import { useRouter } from "next/navigation";
import { useArticuloStore } from "../store/useArticuloStore";
import { useProyectoStore } from "@/features/Proyecto/store/useProyectoStore";

export default function ArticuloView() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [articles, setArticles] = useState<ArticuloListado[]>([]);
  const [activeTab, setActiveTab] = useState<"relevant" | "non-relevant">("relevant");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const proyecto = useProyectoStore((state) => state.proyectoActivo)
  const contexto = useContextoStore((s) => s.contextoActivo);
  const router = useRouter();

  useEffect(() => {
    if (proyecto?.id_proyecto) {
      const fetchArticulos = async () => {
        try {
          if (!proyecto.id_proyecto) return;
          const result = await obtenerArticulos(proyecto.id_proyecto);
          if (!result) return;
          if (result && result.length > 0) {
            setArticles(result);
            setUploadSuccess(true); 
          } else {
            setArticles([]);
            setUploadSuccess(false); 
          }
        } catch (e) {
          console.error("Error al obtener artículos:", e);
        }
      };
      fetchArticulos();
    }
  }, [proyecto?.id_proyecto]);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || selected.type !== "text/csv") {
      alert("Selecciona un archivo CSV válido");
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
  if (!file) return alert("Selecciona un archivo");
  if (!contexto) return router.push("/proyecto");

  setIsUploading(true);
  try {
    const idProyecto = proyecto?.id_proyecto!;
    await subirArchivoCSV(file, contexto, idProyecto); // no devuelve artículos

    // luego listar los artículos
    const nuevos = await obtenerArticulos(idProyecto);
    if (!nuevos) return alert("Error al obtener artículos después de subir CSV");
    setArticles(nuevos);
    setUploadSuccess(true);
  } catch (e) {
    console.error(e);
    alert("Error al procesar el archivo");
  } finally {
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

  const toggleRelevancia = async (id_articulo_detalle?: number, es_relevante?: boolean) => {
  if (!id_articulo_detalle || es_relevante === undefined) return;

  try {
    await actualizarRelevancia(id_articulo_detalle, !es_relevante);

    setArticles((prev) =>
      prev.map((a) =>
        a.id_articulo_detalle === id_articulo_detalle
          ? { ...a, es_relevante: !a.es_relevante }
          : a
      )
    );
  } catch (error) {
    console.error(error);
    alert("Error al actualizar la relevancia en el servidor.");
  }
};

  const resetSelection = () => {
    setArticles([]);
    setFile(null);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEnviarRelevantes = () => {
    const relevantes = articles.filter((a) => a.es_relevante);
    console.log("Artículos relevantes a enviar:", relevantes);
    if (relevantes.length === 0) {
      alert("No hay artículos relevantes para enviar.");
      return;
    }
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
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={styles.processButton}
                >
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
                <button
                  onClick={handleEnviarRelevantes}
                  className={styles.sendButton}
                >
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
                className={`${styles.tab} ${
                  activeTab === "relevant" ? styles.tabActiveBlue : ""
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Relevantes (
                {relevantArticles.length})
              </button>
              <button
                onClick={() => setActiveTab("non-relevant")}
                className={`${styles.tab} ${
                  activeTab === "non-relevant" ? styles.tabActiveRed : ""
                }`}
              >
                <XCircle className="w-4 h-4" /> No Relevantes (
                {nonRelevantArticles.length})
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: "#f9fafb" }}>
                  <tr>
                    <th className={styles.tableHeader}>DOI</th>
                    <th className={styles.tableHeader}>Título</th>
                    <th className={styles.tableHeader}>Explicacion</th>
                    <th className={styles.tableHeader}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((a) => (
                    <tr key={a.id_articulo_detalle}>
                      <td className={`${styles.tableCell} ${styles.tdId}`}>
                        {a.doi}
                      </td>
                      <td className={`${styles.tableCell} ${styles.tdTitle}`}>
                        {a.titulo}
                      </td>
                      <td className={`${styles.tableCell} ${styles.tdExplicacion}`}>
                        {a.explicacion}
                      </td>
                      <td className={styles.tableCell}>
                        <button
                          className={styles.actionButton}
                          title={
                            a.es_relevante
                              ? "Marcar como NO relevante"
                              : "Marcar como relevante"
                          }
                          onClick={() =>
                            toggleRelevancia(a.id_articulo_detalle, a.es_relevante)
                          }
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
                  <p className="text-gray-500">
                    No hay artículos en esta categoría
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

