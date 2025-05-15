import React, {useState, useEffect, type ChangeEvent, type FormEvent} from 'react';
import { useNavigate, useParams } from 'react-router';
import {API_URI} from "../../../lib/constants.ts";
import type {Project} from "../../../interfaces/Project.ts";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  project_id: number;
  due_date?: string | null;
}

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string | undefined>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URI}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch projects');
        }

        const data: { data: Project[] } = await response.json();
        setProjects(data.data);
      } catch (err: any) {
        setErrorProjects(err.message || 'Failed to fetch projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      fetchTaskData(id);
    }
  }, [id]);

  const fetchTaskData = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URI}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const taskData: Task = await response.json();
        setTitle(taskData.title);
        setDescription(taskData.description || '');
        setStatus(taskData.status);
        setProjectId(taskData.project_id);
        setDueDate(taskData.due_date || undefined);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch task data');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching task data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const apiUrl = id ? `${API_URI}/tasks/${id}` : `${API_URI}/tasks`;
    const method = id ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ title, description, status, project_id: projectId, due_date: dueDate }),
      });

      if (response.ok) {
        navigate('/tasks');
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} task`);
      }
    } catch (err: any) {
      setError(err.message || `An unexpected error occurred while ${isEditing ? 'updating' : 'adding'} task`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleProjectIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectId(value ? parseInt(value, 10) : null);
  };

  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && isEditing ? (
        <div className="flex items-center">
          <span className="loading loading-spinner"></span>
          Loading task data...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="project_id" className="block text-gray-700 text-sm font-bold mb-2">Project:</label>
            {loadingProjects ? (
              <span className="loading loading-spinner"></span>
            ) : errorProjects ? (
              <p className="text-red-500">{errorProjects}</p>
            ) : (
              <select
                id="project_id"
                className="select w-full appearance-none"
                value={projectId === null ? '' : projectId}
                onChange={handleProjectIdChange}
                required
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              className="input"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              className="select w-full appearance-none"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="pending">Pending</option>
              <option value="to do">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-gray-700 text-sm font-bold mb-2">Due Date:</label>
            <input
              type="date"
              id="due_date"
              className="input"
              value={dueDate || ''}
              onChange={handleDueDateChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || loadingProjects}
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;