import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true')
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-leaf">Fresh groceries, simple checkout</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Daily essentials delivered with a calmer shopping flow.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-black/65">
              Browse produce, bakery, dairy, pantry staples, and beverages. Create an account, build a cart, and place orders from one clean local app.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn btn-green" to="/products">Shop products</Link>
              <Link className="btn btn-light" to="/register">Create account</Link>
            </div>
          </div>
          <img
            className="h-[420px] w-full rounded-lg object-cover"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Fresh grocery selection"
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-citrus">Featured</p>
            <h2 className="text-3xl font-black">Popular this week</h2>
          </div>
          <Link className="font-bold text-leaf" to="/products">View all</Link>
        </div>
        {loading ? <Spinner /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </section>
    </>
  );
}
