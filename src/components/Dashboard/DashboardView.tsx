import React, { useState, useEffect } from 'react';
import {API_URI} from "../../lib/constants.ts";

interface DashboardMetrics {
  total_projects: number;
  projects_by_status: { [key: string]: number };
  recent_projects: any[];
}

const DashboardView: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'pending':
        return 'badge-info';
      case 'completed':
        return 'badge-primary';
      default:
        return 'badge-neutral';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch( API_URI + '/dashboard/metrics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }

        const data: DashboardMetrics = await response.json();

        setMetrics(data);

        console.log({ data })
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center">
      <span className="spinner loading-spinner"></span>
      Loading dashboard data...
    </div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading dashboard: {error}</div>;
  }

  if (metrics) {
    return (
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Projects Card */}
          <div className="card bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
            <p className="text-xl font-bold text-blue-600">{metrics.total_projects}</p>
          </div>

          {/* Recent Projects Card */}
          <div className="card bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-semibold mb-2">Recent Projects</h3>
            <ul className="list-disc pl-5">
              {metrics.recent_projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </div>

          <div className="card bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-semibold mb-2">Projects by Status</h3>
            <ul className="pl-0 space-y-2">
              {Object.entries(metrics.projects_by_status).map(([status, count]) => (
                <li key={status} className="flex items-center space-x-2 capitalize">
                  <span className="font-semibold">{status}:</span>
                  <span className={`badge ${getStatusBadgeClass(status)}`}>{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {metrics.projects_by_status && Object.keys(metrics.projects_by_status).length > 0 && (
          <div className="card bg-white shadow-md rounded-md mt-6 p-6">
            <h3 className="text-lg font-semibold mb-4">Project Status Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(metrics.projects_by_status).map(([status, count]) => (
                <div key={status} className="flex items-center space-x-2">
                  <span className="font-semibold capitalize">{status}:</span>
                  <span className={`badge ${getStatusBadgeClass(status)}`}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default DashboardView;