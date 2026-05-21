import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  async function handleAdd() {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product.id, 1);
  }

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <Link to={`/products/${product.id}`}>
        <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{product.category?.name}</p>
          <Link to={`/products/${product.id}`} className="mt-1 block text-lg font-bold hover:text-leaf">{product.name}</Link>
          <p className="mt-1 line-clamp-2 text-sm text-black/60">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-black">${Number(product.price).toFixed(2)}</p>
            <p className="text-xs text-black/50">per {product.unit}</p>
          </div>
          <button className="btn btn-green" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </article>
  );
}
