'use client';
import { 
  Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar, User, FileText, Edit2, Trash2 
} from 'lucide-react';
import { ProjectCardProps } from '../types';
import ActionButton from './ActionButton';


export const ProjectCard = ({ project, onAction }: ProjectCardProps) => {

  const STATUS_MAP = {
    completed: { 
      text: 'Completado', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    in_progress: { 
      text: 'En Progreso', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Clock,
      iconColor: 'text-blue-600'
    },
    pending: { 
      text: 'Pendiente', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: AlertTriangle,
      iconColor: 'text-yellow-600'
    },
    new: { 
      text: 'Nuevo', 
      color: 'bg-gray-100 text-gray-800', 
      icon: FileText,
      iconColor: 'text-gray-600'
    }
  };

  const statusInfo = STATUS_MAP[project.status] ?? STATUS_MAP.new;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                {project.title}
              </h3>
              <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>
          </div>

          <span className={`px-3 py-1 ${statusInfo.color} text-xs font-medium rounded-full whitespace-nowrap`}>
            {statusInfo.text}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{project.createdAt}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="flex justify-between items-center">

          {project.progress && project.progress > 0 ? (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>{project.progress}% completado</span>
            </div>
          ) : <div />}

          <div className="flex gap-2">
            <button 
              onClick={() => onAction('view', project.id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Proyecto
            </button>

            <ActionButton 
              icon={<Edit2 className="w-4 h-4" />} 
              color="blue"
              onClick={() => onAction('edit', project.id)} 
            />
            <ActionButton 
              icon={<Trash2 className="w-4 h-4" />} 
              color="red"
              onClick={() => onAction('delete', project.id)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

