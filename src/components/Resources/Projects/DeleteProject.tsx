import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import { API_URI } from "../../../lib/constants.ts";
import {useAuth} from "../../../hooks/useAuth.tsx";
import {HSStaticMethods} from "flyonui/flyonui";

interface DeleteProjectProps {
  projectId: number;
  onProjectDeleted: () => void;
}

function DeleteProject({ projectId, onProjectDeleted }: DeleteProjectProps) {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshToken } = useAuth();

  useEffect(() => {
    HSStaticMethods.autoInit();
  }, [])

  const handleDeleteClick = () => {
    setIsConfirming(true);
  };

  const handleCancelDelete = () => {
    setIsConfirming(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_URI + `/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        onProjectDeleted();
        setIsConfirming(false);
      } else if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const retryResponse = await fetch(API_URI + `/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          if (retryResponse.ok) {
            onProjectDeleted();
            setIsConfirming(false);
          } else {
            const retryErrorData = await retryResponse.json();
            setError(retryErrorData.message || 'Failed to delete project after token refresh.');
          }
        } else {
          setError('Authentication failed, please log in again.');
          navigate('/login');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete project.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during deletion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-circle btn-text btn-sm" aria-haspopup="dialog"
              aria-expanded="false" aria-controls="basic-modal"
              data-overlay="#basic-modal"
              onClick={handleDeleteClick}
      >
        <span className="icon-[tabler--trash] size-5"></span>
      </button>

      <div id="basic-modal"
           className="overlay modal overlay-open:opacity-100 hidden overlay-open:duration-300"
           role="dialog" tabIndex="-1">

        {isConfirming && (
        <div className="modal-dialog overlay-open:opacity-100 overlay-open:duration-300">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
              <div className="modal-body">
                <p className="py-4">Are you sure you want to delete this
                  project?</p>
                {error && <p className="text-red-500">{error}</p>}
                <div className="modal-action flex space-x-2">
                  <button className="btn" onClick={handleCancelDelete}
                          disabled={loading}>Cancel
                  </button>
                  <button className="btn btn-error"
                          onClick={handleConfirmDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DeleteProject;