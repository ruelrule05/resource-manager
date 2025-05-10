import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { API_URI } from "../../../lib/constants.ts";

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

function ResourceForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      fetchProjectData(id);
    }
  }, [id]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URI + `/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const { data }: { data: Project } = await response.json();
        setName(data.name);
        setDescription(data.description || '');
        setStatus(data.status);
        setStartDate(data.start_date ? formatDateForInput(new Date(data.start_date)) : undefined);
        setEndDate(data.end_date ? formatDateForInput(new Date(data.end_date)) : undefined);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch project data');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching project data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const apiUrl = id ? `${API_URI}/projects/${id}` : `${API_URI}/projects`;
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
        body: JSON.stringify({ name, description, status, start_date: startDate, end_date: endDate }),
      });

      if (response.ok) {
        navigate('/projects');
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} project`);
      }
    } catch (err: any) {
      setError(err.message || `An unexpected error occurred while ${isEditing ? 'updating' : 'adding'} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading && isEditing ? (
        <div className="flex items-center">
          <span className="loading loading-spinner"></span>
          Loading project data...
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus={true}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select
              id="status"
              className="select w-full appearance-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
            <input
              type="date"
              id="start_date"
              className="input"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
            <input
              type="date"
              id="end_date"
              className="input"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
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
              disabled={loading}
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ResourceForm;