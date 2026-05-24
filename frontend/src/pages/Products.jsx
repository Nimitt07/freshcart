import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ q: '', category: '', maxPrice: '' });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get(`/products${query ? `?${query}` : ''}`)
      .then(({ data }) => setProducts(data))
      .catch(() => {
        setProducts([]);
        setError('Could not load products from the server. Please refresh once.');
      })
      .finally(() => setLoading(false));
  }, [query]);

  const hasFilters = Boolean(filters.q || filters.category || filters.maxPrice);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">Store</p>
        <h1 className="text-4xl font-black">Shop groceries</h1>
        {!loading && !error && (
          <p className="mt-2 text-sm text-black/60">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}{hasFilters ? ' for your filters' : ''}
          </p>
        )}
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-black/10 bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <input className="input" placeholder="Search products" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select className="input" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
        </select>
        <input className="input" type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
        <button className="btn btn-light" type="button" onClick={() => setFilters({ q: '', category: '', maxPrice: '' })}>Clear</button>
      </div>
      {loading && <Spinner />}
      {!loading && error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
      {!loading && !error && products.length === 0 && <EmptyState title="No products found" body="Try another search or category filter." />}
      {!loading && products.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
    </section>
  );
}
