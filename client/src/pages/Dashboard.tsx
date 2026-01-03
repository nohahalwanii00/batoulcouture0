import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dressAPI } from '../services/api';
import { Dress } from '../types/Dress';
import './Dashboard.css';

const CATEGORY_OPTIONS = [
  'Abaya underdresses',
  'Black abayas Kuwaiti',
  '2024 Winter Collection',
  '2025 Summer Collection',
  'Chemise',
  'Set',
  'Scarfs',
  'Gloves',
];

const getCategoryOptions = (currentValue: string) => {
  if (!currentValue) return CATEGORY_OPTIONS;
  return CATEGORY_OPTIONS.includes(currentValue) ? CATEGORY_OPTIONS : [currentValue, ...CATEGORY_OPTIONS];
};

const DEFAULT_CATEGORY = CATEGORY_OPTIONS[0];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: DEFAULT_CATEGORY,
    size: [] as string[],
    color: [] as string[],
    material: '',
    careInstructions: '',
    availability: 'in-stock',
    featured: false,
    stockQuantity: '1',
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: DEFAULT_CATEGORY,
    size: [] as string[],
    color: [] as string[],
    material: '',
    careInstructions: '',
    availability: 'in-stock',
    featured: false,
    stockQuantity: '1',
  });
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    // Simple route guard: if no token, redirect to login
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const res = await dressAPI.getAll();
        setDresses(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load abayas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear auth token and any sensitive client-side state
    localStorage.removeItem('auth_token');
    // Clear possible cached error messages or form state
    setError('');
    setForm({
      name: '',
      description: '',
      price: '',
      category: DEFAULT_CATEGORY,
      size: [],
      color: [],
      material: '',
      careInstructions: '',
      availability: 'in-stock',
      featured: false,
      stockQuantity: '1',
    });
    setImages([]);
    setEditingDress(null);
    setEditImages([]);
    // Navigate back to login page with flag to clear inputs
    navigate('/login', { state: { fromLogout: true } });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Delete this abaya?')) return;
    try {
      await dressAPI.delete(id);
      setDresses(prev => prev.filter(d => d._id !== id && d.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelectChange = (name: 'size' | 'color', value: string) => {
    setForm(prev => {
      const arr = new Set(prev[name]);
      if (arr.has(value)) arr.delete(value); else arr.add(value);
      return { ...prev, [name]: Array.from(arr) };
    });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
  };

  // Edit handlers
  const handleEditOpen = (dress: Dress) => {
    setEditingDress(dress);
    setEditForm({
      name: dress.name || '',
      description: dress.description || '',
      price: String(dress.price ?? ''),
      category: dress.category || DEFAULT_CATEGORY,
      size: Array.isArray(dress.size) ? dress.size : [],
      color: Array.isArray(dress.color) ? dress.color : [],
      material: dress.material || '',
      careInstructions: dress.careInstructions || '',
      availability: dress.availability || 'in-stock',
      featured: !!dress.featured,
      stockQuantity: String(dress.stockQuantity ?? '1'),
    });
    setEditImages([]);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditMultiSelectChange = (name: 'size' | 'color', value: string) => {
    setEditForm(prev => {
      const arr = new Set(prev[name]);
      if (arr.has(value)) arr.delete(value); else arr.add(value);
      return { ...prev, [name]: Array.from(arr) };
    });
  };

  const handleEditImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setEditImages(files);
  };

  const handleEditCancel = () => {
    setEditingDress(null);
    setEditImages([]);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDress) return;
    setEditSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('description', editForm.description);
      fd.append('price', String(editForm.price));
      fd.append('category', editForm.category);
      editForm.size.forEach(s => fd.append('size', s));
      editForm.color.forEach(c => fd.append('color', c));
      fd.append('material', editForm.material);
      fd.append('careInstructions', editForm.careInstructions);
      fd.append('availability', editForm.availability);
      fd.append('featured', String(editForm.featured));
      fd.append('stockQuantity', String(editForm.stockQuantity));
      editImages.forEach(img => fd.append('images', img));

      const id = String(editingDress._id || editingDress.id);
      const res = await dressAPI.update(id, fd);
      const updated = res.data;
      setDresses(prev => prev.map(d => (String(d._id || d.id) === id ? updated : d)));
      setEditingDress(null);
      setEditImages([]);
      alert('Abaya updated successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', String(form.price));
      fd.append('category', form.category);
      // send size and color as comma-separated
      form.size.forEach(s => fd.append('size', s));
      form.color.forEach(c => fd.append('color', c));
      fd.append('material', form.material);
      fd.append('careInstructions', form.careInstructions);
      fd.append('availability', form.availability);
      fd.append('featured', String(form.featured));
      fd.append('stockQuantity', String(form.stockQuantity));
      images.forEach(img => fd.append('images', img));

      const res = await dressAPI.create(fd);
      const created = res.data;
      setDresses(prev => [created, ...prev]);
      // reset form
      setForm({
        name: '', description: '', price: '', category: DEFAULT_CATEGORY, size: [], color: [], material: '', careInstructions: '', availability: 'in-stock', featured: false, stockQuantity: '1'
      });
      setImages([]);
      alert('Abaya added successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>

        {editingDress && (
          <div className="card" style={{ marginBottom: 20, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
            <h2 style={{ marginTop: 0 }}>Edit Abaya</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <label>Name * </label>
                  <input name="name" value={editForm.name} onChange={handleEditInputChange} className="form-control" required />
                </div>
                <div>
                  <label>Description *</label>
                  <textarea name="description" value={editForm.description} onChange={handleEditInputChange} className="form-control" required />
                </div>
                <div>
                  <label>Price *</label>
                  <input type="number" name="price" value={editForm.price} onChange={handleEditInputChange} className="form-control" required />
                </div>
                <div>
                  <label>Category *</label>
                  <select name="category" value={editForm.category} onChange={handleEditInputChange} className="form-control" required>
                    {getCategoryOptions(editForm.category).map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Sizes *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {['XS','S','M','L','XL','XXL'].map(s => (
                      <label key={s} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                        <input type="checkbox" checked={editForm.size.includes(s)} onChange={() => handleEditMultiSelectChange('size', s)} /> {s}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Colors *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {['black','white','gold','beige','red','blue','green'].map(c => (
                      <label key={c} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                        <input type="checkbox" checked={editForm.color.includes(c)} onChange={() => handleEditMultiSelectChange('color', c)} /> {c}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label>Material *</label>
                  <input name="material" value={editForm.material} onChange={handleEditInputChange} className="form-control" required />
                </div>
                <div>
                  <label>Care Instructions</label>
                  <input name="careInstructions" value={editForm.careInstructions} onChange={handleEditInputChange} className="form-control" />
                </div>
                <div>
                  <label>Availability</label>
                  <select name="availability" value={editForm.availability} onChange={handleEditInputChange} className="form-control">
                    <option value="in-stock">In Stock</option>
                    <option value="limited">Limited</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label>Featured</label>
                  <input type="checkbox" name="featured" checked={editForm.featured} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label>Stock Quantity</label>
                  <input type="number" name="stockQuantity" value={editForm.stockQuantity} onChange={handleEditInputChange} className="form-control" />
                </div>
                <div>
                  <label>New Images (optional)</label>
                  <input type="file" multiple accept="image/*" onChange={handleEditImagesChange} />
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-secondary" disabled={editSubmitting}>
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-link" onClick={handleEditCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Add Dress Form */}
        <div className="card" style={{ marginBottom: 20, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <h2 style={{ marginTop: 0 }}>Add New Abaya</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div>
                <label>Name *</label>
                <input name="name" value={form.name} onChange={handleInputChange} className="form-control" required />
              </div>
              <div>
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleInputChange} className="form-control" required />
              </div>
              <div>
                <label>Price *</label>
                <input type="number" name="price" value={form.price} onChange={handleInputChange} className="form-control" required />
              </div>
              <div>
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleInputChange} className="form-control" required>
                  {getCategoryOptions(form.category).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Sizes *</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {['XS','S','M','L','XL','XXL'].map(s => (
                    <label key={s} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                      <input type="checkbox" checked={form.size.includes(s)} onChange={() => handleMultiSelectChange('size', s)} /> {s}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label>Colors *</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {['black','white','gold','beige','red','blue','green'].map(c => (
                    <label key={c} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                      <input type="checkbox" checked={form.color.includes(c)} onChange={() => handleMultiSelectChange('color', c)} /> {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label>Material *</label>
                <input name="material" value={form.material} onChange={handleInputChange} className="form-control" required />
              </div>
              <div>
                <label>Care Instructions</label>
                <input name="careInstructions" value={form.careInstructions} onChange={handleInputChange} className="form-control" />
              </div>
              <div>
                <label>Availability</label>
                <select name="availability" value={form.availability} onChange={handleInputChange} className="form-control">
                  <option value="in-stock">In Stock</option>
                  <option value="limited">Limited</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label>Featured</label>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleInputChange} />
              </div>
              <div>
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleInputChange} className="form-control" />
              </div>
              <div>
                <label>Images</label>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit" className="btn btn-secondary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Add Abaya'}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="abayas-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dresses.map((dress) => (
                  <tr key={dress._id || dress.id}>
                    <td className="cell-image">
                      {dress.images && dress.images.length > 0 ? (
                        <img src={dress.images[0].url} alt={dress.images[0].alt || dress.name} className="thumb" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{dress.name}</td>
                    <td>${dress.price}</td>
                    <td>{dress.category}</td>
                    <td className="cell-actions">
                      <button className="btn btn-link" onClick={() => handleEditOpen(dress)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(dress._id || dress.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
