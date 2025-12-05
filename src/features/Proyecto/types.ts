export interface CreateProjectRequest {
  titulo: string;
  descripcion: string;
  id_usuario: number;
}

export interface ProjectResponseData {
  id_proyecto: number;
  titulo: string;
  fase: number;
  estado: string;
  fecha_creacion: string;
}

export interface Proyecto {
  id_proyecto?: number;
  titulo: string;
  descripcion: string;
  id_usuario?: number;
}

export interface ProjectView {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'new';
  createdAt: string;
  owner: string;
  progress?: number;
}

export interface ProjectCardProps {
  project: ProjectView;
  onAction: (action: 'view' | 'edit' | 'delete', id: string) => void;
}

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}