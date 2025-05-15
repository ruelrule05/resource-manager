import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { API_URI } from '../../../lib/constants';
import DeleteInventoryItem from './DeleteInventoryItem';
import type {ApiResponse} from "../../../interfaces/ApiResponse.ts"; // Create this component

interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  sku?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

let controller: AbortController;

const InventoryList: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState('');
  const [pageMeta, setPageMeta] = useState<ApiResponse['meta'] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchInventoryItems = useCallback(async () => {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams(location.search);
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

      const url = `${API_URI}/inventory-items?${queryParams.toString()}`;

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
        throw new Error(errorData.message || 'Failed to fetch inventory items');
      }

      const data: ApiResponse = await response.json();

      console.log({ data })
      setInventoryItems(data.data);
      setPageMeta(data.meta);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, sortDirection, filters, search, location.search]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPage = queryParams.get('page');
    if (initialPage) {
      setPage(parseInt(initialPage, 10));
    }

    const delayTimeoutId = setTimeout(fetchInventoryItems, 300);
    return () => {
      clearTimeout(delayTimeoutId);
      controller?.abort();
    };
  }, [fetchInventoryItems, search, location.search]);

  const handleSort = (column: string) => {
    const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newDirection);
    setPage(1);
    updateUrl({ sort_by: column, sort_direction: newDirection, page: 1 });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(1);
    updateUrl({ ...filters, [field]: value, page: 1 });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    updateUrl({ search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  const handlePerPageChange = (newPerPage: string) => {
    setPerPage(parseInt(newPerPage, 10));
    setPage(1);
    updateUrl({ per_page: newPerPage, page: 1 });
  };

  const handleEdit = (id: number) => {
    navigate(`/inventory-items/${id}/edit`);
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

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'in_stock':
        return 'badge-success';
      case 'out_of_stock':
        return 'badge-warning';
      case 'backordered':
        return 'badge-info';
      case 'discontinued':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <>
      <div className="flex items-center mb-4 space-x-4">
        <h2 className="text-2xl font-semibold">Inventory Items</h2>
        <Link to="/inventory-items/create" className="btn btn-primary">
          <span className="icon-[tabler--plus]"></span>
          Add
        </Link>
      </div>

      <div className="max-w-lg flex items-center justify-between">
        <div className="mb-4">
          <label htmlFor="search"
                 className="block text-gray-700 text-sm font-bold mb-2">Search:</label>
          <input
            type="text"
            id="search"
            placeholder="Search inventory items..."
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
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="backordered">Backordered</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {( loading ?
        (
          <div className="flex items-center">
            <span className="loading loading-spinner"></span>
            Loading inventory items...
          </div>
        ) : (
          <div>
            <div className="max-w-full overflow-x-auto">
              <table className="table max-w-full">
                <thead>
                <tr>
                  <th className="cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                  <th>Description</th>
                  <th className="cursor-pointer" onClick={() => handleSort('quantity')}>Quantity</th>
                  <th className="cursor-pointer" onClick={() => handleSort('sku')}>SKU</th>
                  <th className="cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="row-hover">
                    <td>{item.name}</td>
                    <td className="text-wrap">{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.sku}</td>
                    <td><span
                      className={`badge badge-soft text-xs capitalize ${getStatusBadgeClass(item.status)}`}
                    >{item.status}</span></td>
                    <td>
                      <button className="btn btn-circle btn-text btn-sm"
                              aria-label="Edit"
                              onClick={() => handleEdit(item.id)}
                      ><span className="icon-[tabler--pencil] size-5"></span>
                      </button>
                      <DeleteInventoryItem inventoryItemId={item.id} onInventoryItemDeleted={fetchInventoryItems}/>
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
                    [...Array(pageMeta?.last_page ?? 1)].map((_, i) => (
                      <button
                        key={i} type="button"
                        className={`btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary ${page === i + 1 ? 'btn-primary' : ''}`}
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
};

export default InventoryList;