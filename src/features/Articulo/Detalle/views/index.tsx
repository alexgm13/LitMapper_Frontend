"use client";
import { useState, useRef } from "react";
import { Upload, FileText, ExternalLink, CheckCircle } from "lucide-react";
import styles from "./detalle.module.css";
import { procesarPDF, AnalisisArticulo } from "../services/detalle";
import { useArticuloStore } from "@/features/Articulo/store/useArticuloStore";

export default function DetalleView() {
  const { articulosRelevantes } = useArticuloStore();
  const [articles, setArticles] = useState<AnalisisArticulo[]>(articulosRelevantes || []);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFileChange = async (articleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido");
      return;
    }

    try {
      setArticles((prev) =>
        prev.map((a) => (a.id_articulo === articleId ? { ...a, isProcessing: true } : a))
      );

      const result = await procesarPDF(articleId, file);

      setArticles((prev) =>
        prev.map((a) =>
          a.id_articulo === articleId
            ? { ...a, ...result, pdf_procesado: true, isProcessing: false }
            : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar el PDF");
      setArticles((prev) =>
        prev.map((a) => (a.id_articulo === articleId ? { ...a, isProcessing: false } : a))
      );
    }
  };

  const openPublicationLink = (link?: string) => {
    if (link) window.open(link, "_blank");
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
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Investigación</th>
                <th>Objetivo</th>
                <th>Metodología</th>
                <th>Hallazgos</th>
                <th>Brecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id_articulo}>
                  <td>{a.titulo}</td>
                  <td>{a.objetivo_estudio || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.metodologia || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.hallazgos || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>{a.tipo_brecha || <span className={styles.empty}>PDF no procesado</span>}</td>
                  <td>
                    {a.pdf_procesado ? (
                      <span className={styles.processed}>
                        <CheckCircle className="w-4 h-4" /> Procesado
                      </span>
                    ) : (
                      <>
                        <input
                          ref={(el) => {fileInputRefs.current[a.id_articulo] = el}}
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(a.id_articulo, e)}
                          className="hidden"
                          id={`pdf-${a.id_articulo}`}
                        />
                        <label htmlFor={`pdf-${a.id_articulo}`} className={styles.uploadButton}>
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
