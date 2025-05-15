import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { API_URI } from '../../../lib/constants';

interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  sku?: string | null;
  status: string;
}

interface InventoryItemApiResponse {
  data: InventoryItem;
}

const InventoryForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [sku, setSku] = useState<string | null>(null);
  const [status, setStatus] = useState('in_stock');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      fetchInventoryItemData(id);
    }
  }, [id]);

  const fetchInventoryItemData = async (itemId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URI}/inventory-items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const inventoryItemApiResponse: InventoryItemApiResponse = await response.json();
        const itemData = inventoryItemApiResponse.data;
        setName(itemData.name);
        setDescription(itemData.description || '');
        setQuantity(itemData.quantity);
        setSku(itemData.sku || null);
        setStatus(itemData.status);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch inventory item data');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while fetching inventory item data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const apiUrl = id ? `${API_URI}/inventory-items/${id}` : `${API_URI}/inventory-items`;
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
        body: JSON.stringify({ name, description, quantity, sku, status }),
      });

      if (response.ok) {
        navigate('/inventory-items');
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} inventory item`);
      }
    } catch (err: any) {
      setError(err.message || `An unexpected error occurred while ${isEditing ? 'updating' : 'adding'} inventory item`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory-items');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value ? parseInt(value, 10) : 0);
  };

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSku(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Inventory Item' : 'Create New Inventory Item'}</h2>
  {error && <p className="text-red-500 mb-4">{error}</p>}

    {loading && isEditing ? (
        <div className="flex items-center">
        <span className="loading loading-spinner"></span>
      Loading inventory item data...
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
    <div>
      <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
    <input
      type="text"
      id="name"
      className="input"
      value={name}
      onChange={handleNameChange}
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
      onChange={handleDescriptionChange}
      />
      </div>
      <div>
      <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
    <input
      type="number"
      id="quantity"
      className="input"
      value={quantity}
      onChange={handleQuantityChange}
      required
      />
      </div>
      <div>
      <label htmlFor="sku" className="block text-gray-700 text-sm font-bold mb-2">SKU:</label>
    <input
      type="text"
      id="sku"
      className="input"
      value={sku || ''}
      onChange={handleSkuChange}
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
      <option value="in_stock">In Stock</option>
    <option value="out_of_stock">Out of Stock</option>
    <option value="backordered">Backordered</option>
      <option value="discontinued">Discontinued</option>
      </select>
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
        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Item' : 'Create Item')}
        </button>
        </div>
        </form>
    )}
    </div>
  );
  };

  export default InventoryForm;