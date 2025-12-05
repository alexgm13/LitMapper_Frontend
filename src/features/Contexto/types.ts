export interface CreateContextRequest {
    id_proyecto: number;
    area_general: string;
    tema_especifico: string;
    problema_investigacion: string;
    metodologia: string;
}

export interface ContextResponseData {
    id_contexto: number;
    id_proyecto: number;
    area_general: string;
    tema_especifico: string;
    problema_investigacion: string;
    metodologia: string;
}

export interface Contexto extends ContextResponseData {}