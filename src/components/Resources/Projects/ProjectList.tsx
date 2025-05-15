import React, { useEffect, useState, useCallback } from "react";
import { API_URI } from "../../../lib/constants.ts";
import {Link, useLocation, useNavigate} from "react-router";
import DeleteProject from "./DeleteProject.tsx";
import type {ApiResponse, PageMeta} from "../../../interfaces/ApiResponse.ts";

interface Resource {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

let controller: AbortController;

export function ProjectList() {
  const [resourceList, setResourceList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState<string>('');
  const [pageMeta, setPageMeta] = useState<PageMeta | null>(null)
  const navigate = useNavigate();
  const location = useLocation();

  const fetchResources = useCallback(async () => {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      queryParams.set('per_page', perPage.toString());
      if (sortBy) {
        queryParams.set('sort_by', sortBy);
        queryParams.set('sort_direction', sortDirection);
      }
      if (search) {
        queryParams.set('search', search);
      }
      for (const key in filters) {
        if (filters[key]) {
          queryParams.set(key, filters[key]);
        }
      }

      const url = API_URI + `/projects?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch resources');
      }

      const data: ApiResponse = await response.json();
      setResourceList(data.data);
      setPageMeta(data.meta);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, sortDirection, filters, search]);

  useEffect(() => {
    const delayTimeoutId = setTimeout(fetchResources, 300);

    return () => {
      clearTimeout(delayTimeoutId);
      controller?.abort();
    };
  }, [fetchResources, search]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handleEdit = (id: number) => {
    navigate(`/projects/${id}/edit`);
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters({...filters, [field]: value});
    setPage(1);
    updateUrl({ page: 1 })
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    updateUrl({ per_page: newPerPage, page: 1 })
  };

  const updateUrl = (queryParams: { [key: string]: string | number | null }) => {
    const newSearchParams = new URLSearchParams(location.search);
    for (const key in queryParams) {
      const value = queryParams[key];
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    }
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  if (error) {
    return <div className="text-red-500">Error loading resources: {error}</div>;
  }

  return (
    <>
      <div className="flex items-center mb-4 space-x-4">
        <h2 className="text-2xl font-semibold">Project List</h2>
        <Link to="/projects/create" className="btn btn-primary">
          <span className="icon-[tabler--plus]"></span>
          Add
        </Link>
      </div>


      <div className="max-w-lg flex items-center justify-between">
        <div className="mb-4">
          <label htmlFor="status"
                 className="block text-gray-700 text-sm font-bold mb-2">Search:</label>
          <input
            type="text"
            placeholder="Search resources..."
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="mb-4 flex space-x-4">
          <div>
            <label htmlFor="status"
                   className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
            <select className="select max-w-sm appearance-none"
                    aria-label="select"
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {( loading ?
          (
            <div className="flex items-center">
              <span className="loading loading-spinner"></span>
              Loading resources...
            </div>
          ) : (
            <div>
              <div className="max-w-full overflow-x-auto">
                <table className="table max-w-full">
                  <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>Name</th>
                    <th onClick={() => handleSort('description')}>Description
                    </th>
                    <th onClick={() => handleSort('status')}>Status</th>
                    <th onClick={() => handleSort('start_date')}>Start Date</th>
                    <th onClick={() => handleSort('end_date')}>End Date</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {resourceList.map((resource, index) => (
                    <tr key={index} className="row-hover">
                      <td>{resource.name}</td>
                      <td className="text-wrap">{resource.description}</td>
                      <td><span
                        className={`badge badge-soft text-xs capitalize ${
                          resource.status === 'active' ? 'badge-success' :
                            resource.status === 'inactive' ? 'badge-warning' :
                              resource.status === 'pending' ? 'badge-info' :
                                resource.status === 'completed' ? 'badge-primary' :
                                  resource.status === 'on_hold' ? 'badge-secondary' :
                                    'badge-neutral'
                        }`}
                      >{resource.status}</span>
                      </td>
                      <td>{resource.start_date}</td>
                      <td>{resource.end_date}</td>
                      <td>
                        <button className="btn btn-circle btn-text btn-sm"
                                aria-label="Action button"><span
                          className="icon-[tabler--pencil] size-5"
                          onClick={() => handleEdit(resource.id)}
                        ></span>
                        </button>
                        <DeleteProject projectId={resource.id} onProjectDeleted={fetchResources} />
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex">
                  <select className="select max-w-sm appearance-none"
                          aria-label="select"
                          value={perPage}
                          onChange={(e) => handlePerPageChange(e.target.value)}
                  >
                    <option value="5">5 Items</option>
                    <option value="10">10 Items</option>
                    <option value="15">15 Items</option>
                    <option value="20">20 Items</option>
                    <option value="50">50 Items</option>
                    <option value="100">100 Items</option>
                  </select>
                </div>

                <nav className="flex items-center gap-x-1">
                  <button type="button" className="btn btn-soft"
                          disabled={page === 1}
                          onClick={() => handlePageChange(page - 1)}
                  >Previous
                  </button>
                  <div className="flex items-center gap-x-1">
                    {
                      [...Array(pageMeta?.last_page ?? 1)].map((x, i) => (
                        <button
                          key={i} type="button"
                          className="btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary"
                          aria-current={page === i + 1 ? 'page' : undefined}
                          onClick={() => handlePageChange(i + 1)}
                        >{i + 1}</button>
                      ))
                    }
                  </div>
                  <button type="button" className="btn btn-soft"
                          disabled={page === pageMeta?.last_page}
                          onClick={() => handlePageChange(page + 1)}>Next
                  </button>
                </nav>
              </div>
            </div>
          )
      )}
    </>
  );
}