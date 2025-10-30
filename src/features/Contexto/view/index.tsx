"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  Layers,
  AlertTriangle,
  FlaskConical,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import styles from "./proyecto.module.css";
import { useProyectoStore } from "@/features/Proyecto/store/useProyectoStore";
import { crearContexto } from "../services/contexto";
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
  const proyecto = useProyectoStore((state) => state.proyectoActivo)
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
        const contexto = await crearContexto({
        id_proyecto: proyecto?.id_proyecto!,
        area_general: formData.areaGeneral,
        tema_especifico: formData.temaEspecifico,
        problema_investigacion: formData.problemaInvestigacion,
        metodologia: formData.metodologia,
    });
        setContextoActivo(contexto);
        console.log("✅ Contexto creado:", contexto);
        setShowSuccess(true);
         setTimeout(() => {
            router.push("/articulo");
          }, 1000);
        } catch (error) {
          console.error("Error al crear Contexto:", error);
        } finally {
          setIsSubmitting(false);
        }
  };

  const handleBack = () => {
    router.push("/proyecto");

  };

  const handleClear = () => {
    setFormData({
      areaGeneral: "",
      temaEspecifico: "",
      problemaInvestigacion: "",
      metodologia: "",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          
        </div>
        {showSuccess && (
          <div className={styles.successBox}>
            <div className={styles.successHeader}>
              <Check className={styles.successIcon} />
              <span className={styles.successTitle}>
                ¡Delimitación guardada exitosamente!
              </span>
            </div>
            <p className={styles.successMessage}>
              Tu delimitación del tema ha sido registrada y está lista para el
              siguiente paso del proceso.
            </p>
          </div>
        )}

        {/* Tarjeta principal */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.nav}>
              <button onClick={handleBack} className={styles.backButton}>
                <ArrowLeft className={styles.backIcon} />
                Volver al proyecto
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Área General */}
              <div>
                <label htmlFor="areaGeneral" className={styles.label}>
                  <Layers className={styles.labelIconBlue} />
                  Área General de Investigación
                </label>
                <input
                  type="text"
                  id="areaGeneral"
                  name="areaGeneral"
                  value={formData.areaGeneral}
                  onChange={handleChange}
                  placeholder="Ej: Ciencias de la Computación, Salud Pública, Educación..."
                  className={styles.input}
                  required
                />
                <p className={styles.helper}>
                  Campo amplio o disciplina académica a la que pertenece tu
                  investigación
                </p>
              </div>

              {/* Tema Específico */}
              <div>
                <label htmlFor="temaEspecifico" className={styles.label}>
                  <Target className={styles.labelIconIndigo} />
                  Tema Específico
                </label>
                <input
                  type="text"
                  id="temaEspecifico"
                  name="temaEspecifico"
                  value={formData.temaEspecifico}
                  onChange={handleChange}
                  placeholder="Ej: Algoritmos de aprendizaje profundo para diagnóstico médico temprano..."
                  className={styles.input}
                  required
                />
                <p className={styles.helper}>
                  Enfoque concreto y delimitado dentro del área general
                </p>
              </div>

              {/* Problema */}
              <div>
                <label htmlFor="problemaInvestigacion" className={styles.label}>
                  <AlertTriangle className={styles.labelIconRed} />
                  Problema de Investigación
                </label>
                <textarea
                  id="problemaInvestigacion"
                  name="problemaInvestigacion"
                  value={formData.problemaInvestigacion}
                  onChange={handleChange}
                  placeholder="Formula claramente el problema que deseas investigar..."
                  rows={4}
                  className={styles.textarea}
                  required
                />
                <p className={styles.helper}>
                  Pregunta o situación problemática específica que guiará tu
                  investigación
                </p>
              </div>

              {/* Metodología */}
              <div>
                <label htmlFor="metodologia" className={styles.label}>
                  <FlaskConical className={styles.labelIconPurple} />
                  Metodología o Método
                </label>
                <textarea
                  id="metodologia"
                  name="metodologia"
                  value={formData.metodologia}
                  onChange={handleChange}
                  placeholder="Describe el enfoque metodológico que utilizarás..."
                  rows={4}
                  className={styles.textarea}
                  required
                />
                <p className={styles.helper}>
                  Enfoque sistemático que emplearás para abordar el problema de
                  investigación
                </p>
              </div>

              {/* Botones */}
              <div className={styles.buttons}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      <span>Guardando Delimitación...</span>
                    </div>
                  ) : (
                    "Guardar Delimitación"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className={styles.clearBtn}
                >
                  <X className={styles.clearIcon} />
                  Limpiar Formulario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
