'use client';
import { useEffect, useState } from 'react';
import { Plus, Folder, CheckCircle, Clock } from 'lucide-react';
import { ProjectCard } from '../components/Card'; 
import { ProjectView } from '../types';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import ProjectModal from '../components/ProyectoModal';
import { getProjectsByUser } from '../services/proyecto';
import { useAuthStore } from '../../../store/authStore';

export default function ProjectsView() {
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id_usuario) return;
      
      try {
        setIsLoading(true);
        const response = await getProjectsByUser(user.id_usuario);
        
        if (response.success && response.data) {
          const mappedProjects: ProjectView[] = response.data.map(p => ({
            id: p.id_proyecto.toString(),
            title: p.titulo,
            description: '', 
            status: p.estado === 'ACTIVO' ? 'in_progress' : 'completed', 
            createdAt: p.fecha_creacion,
            owner: user.nombre || 'Usuario',
            progress: p.fase 
          }));
          setProjects(mappedProjects);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleProjectAction = async (action: string, projectId: number | string) => {
    console.log(`Action: ${action} on project: ${projectId}`);

    switch (action) {
      case 'delete':
        if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
          try {
            await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
            setProjects(prev => prev.filter(p => p.id !== projectId));
          } catch {
            alert('Error al eliminar el proyecto');
          }
        }
        break;
      case 'edit':
        // Aquí puedes abrir un modal o redirigir
        console.log('Editar proyecto', projectId);
        break;
      case 'view':
        // Redirige a detalle
        console.log('Ver proyecto', projectId);
        break;
    }
  };

   const handleCreateNewProject = () => {
    setIsModalOpen(true);
  };

  // 🔹 Lógica cuando se crea un nuevo proyecto desde el modal
  const handleProjectCreated = (nuevoProyecto: ProjectView) => {
    setProjects(prev => [...prev, nuevoProyecto]); // agrega el nuevo a la lista
    setIsModalOpen(false);
  };

  const total = projects.length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const inProgress = projects.filter(p => p.status === 'in_progress').length;


  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mis Proyectos de Investigación
            </h1>
            <p className="text-gray-600 text-lg">
              Gestiona todos tus proyectos de investigación y estados del arte
            </p>
          </div>

          <button
            onClick={handleCreateNewProject}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nuevo Proyecto
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Proyectos" value={total} icon={<Folder className="w-8 h-8 text-blue-600" />} />
        <StatCard label="Completados" value={completed} icon={<CheckCircle className="w-8 h-8 text-green-600" />} />
        <StatCard label="En Progreso" value={inProgress} icon={<Clock className="w-8 h-8 text-blue-600" />} />
      </section>

      {projects.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onAction={handleProjectAction} 
            />
          ))}
        </section>
      ) : (
        <EmptyState onCreate={handleCreateNewProject} />
      )}
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}




