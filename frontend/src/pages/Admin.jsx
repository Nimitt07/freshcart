import { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  stock: '',
  unit: '',
  featured: false,
  categoryId: ''
};

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const [productResponse, categoryResponse] = await Promise.all([api.get('/products'), api.get('/categories')]);
    setProducts(productResponse.data);
    setCategories(categoryResponse.data);
  }

  useEffect(() => {
    load();
  }, []);

  function edit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      unit: product.unit,
      featured: product.featured,
      categoryId: product.categoryId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event) {
    event.preventDefault();
    if (editingId) {
      await api.put(`/products/${editingId}`, form);
    } else {
      await api.post('/products', form);
    }
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  async function remove(id) {
    await api.delete(`/products/${id}`);
    await load();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Admin products</h1>
      <form className="mb-8 grid gap-4 rounded-lg border border-black/10 bg-white p-5 md:grid-cols-2" onSubmit={submit}>
        <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="input" placeholder="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} required />
        <input className="input" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
        <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
        <input className="input md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} required />
        <select className="input" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required>
          <option value="">Choose category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
        <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        <button className="btn btn-green md:w-fit">{editingId ? 'Update product' : 'Add product'}</button>
      </form>
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        {products.map((product) => (
          <div key={product.id} className="grid gap-4 border-b border-black/10 p-4 md:grid-cols-[80px_1fr_auto] md:items-center">
            <img className="h-20 w-20 rounded object-cover" src={product.imageUrl} alt={product.name} />
            <div>
              <h2 className="font-black">{product.name}</h2>
              <p className="text-sm text-black/60">${Number(product.price).toFixed(2)} - {product.category?.name} - stock {product.stock}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-light" onClick={() => edit(product)}>Edit</button>
              <button className="btn btn-danger" onClick={() => remove(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
