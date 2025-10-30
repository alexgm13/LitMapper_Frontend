"use client";

import { useState } from "react";
import { Sparkles, FileText, Search, Brain, X, Check } from "lucide-react";
import styles from "./proyecto.module.css"; 
import { crearProyecto } from "../services/proyecto";
import { useRouter } from "next/navigation";
import { useProyectoStore } from "../store/useProyectoStore";


export default function ProyectoView() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const setProyectoActivo = useProyectoStore(
  (state) => state.setProyectoActivo
);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const nuevoProyecto = await crearProyecto({
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      id_usuario: 1, 
    });
    setProyectoActivo(nuevoProyecto);
    console.log("✅ Proyecto creado:", nuevoProyecto);
    setShowSuccess(true);
     setTimeout(() => {
        router.push("/contexto");
      }, 1000);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ titulo: "", descripcion: "" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {showSuccess && (
          <div className={styles.successBox}>
            <div className={styles.successHeader}>
              <Check className={styles.successIcon} />
              <span className={styles.successTitle}>¡Proyecto creado exitosamente!</span>
            </div>
            <p className={styles.successMessage}>
              Tu proyecto de investigación ha sido inicializado y está listo para comenzar el análisis de literatura científica.
            </p>
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Nuevo Proyecto de Investigación</h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label htmlFor="titulo" className={styles.label}>
                  <FileText className={styles.labelIcon} />
                  Título del Proyecto de Investigación
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Análisis de algoritmos de aprendizaje profundo en diagnóstico médico..."
                  className={styles.input}
                  required
                />
                <p className={styles.helperText}>
                  Este será el tema principal para la búsqueda y análisis de artículos científicos
                </p>
              </div>

              <div>
                <label htmlFor="descripcion" className={styles.label}>
                  <Search className={styles.labelIcon} />
                  Descripción del Tema de Investigación
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe en detalle tu tema de investigación..."
                  rows={5}
                  className={styles.textarea}
                  required
                />
                <p className={styles.helperText}>
                  Proporciona contexto adicional para mejorar la precisión de la búsqueda y análisis de literatura científica
                </p>
              </div>

              <div className={styles.buttons}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      <span className={styles.loadingText}>
                        <Sparkles className={styles.sparkIcon} />
                        Iniciando Análisis IA...
                      </span>
                    </div>
                  ) : (
                    <div className={styles.loadingText}>
                      <Sparkles className={styles.sparkIcon} />
                      Crear Proyecto con IA
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelBtn}
                >
                  <X className={styles.cancelIcon} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
