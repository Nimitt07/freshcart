import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAdd() {
    if (!user) return navigate('/login');
    await addToCart(product.id, quantity);
    navigate('/cart');
  }

  if (loading) return <Spinner />;
  if (!product) return null;

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2">
      <img className="h-[520px] w-full rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
      <div className="self-center">
        <p className="text-sm font-bold uppercase tracking-wide text-leaf">{product.category.name}</p>
        <h1 className="mt-2 text-5xl font-black">{product.name}</h1>
        <p className="mt-4 text-lg text-black/65">{product.description}</p>
        <div className="mt-6 flex items-end gap-3">
          <p className="text-4xl font-black">${Number(product.price).toFixed(2)}</p>
          <p className="pb-1 text-black/50">per {product.unit}</p>
        </div>
        <p className="mt-3 text-sm text-black/60">{product.stock} in stock</p>
        <div className="mt-8 flex gap-3">
          <input className="input w-28" type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
          <button className="btn btn-green" onClick={handleAdd}>Add to cart</button>
        </div>
      </div>
    </section>
  );
}
