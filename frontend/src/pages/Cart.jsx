import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();

  if (cart.items.length === 0) {
    return <section className="mx-auto max-w-4xl px-4 py-10"><EmptyState title="Your cart is empty" body="Add a few groceries and come back here to checkout." /></section>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
              <img className="h-28 w-full rounded object-cover sm:w-28" src={item.product.imageUrl} alt={item.product.name} />
              <div>
                <h2 className="font-bold">{item.product.name}</h2>
                <p className="text-sm text-black/60">${Number(item.product.price).toFixed(2)} per {item.product.unit}</p>
                <button className="mt-2 text-sm font-bold text-red-600" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
              <input className="input w-24" type="number" min="0" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} />
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-black">Summary</h2>
          <div className="mt-4 flex justify-between text-lg">
            <span>Total</span>
            <strong>${Number(cart.total).toFixed(2)}</strong>
          </div>
          <Link className="btn btn-green mt-5 w-full" to="/checkout">Checkout</Link>
        </aside>
      </div>
    </section>
  );
}
