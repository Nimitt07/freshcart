import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    deliveryAddress: '',
    phone: ''
  });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await api.post('/orders', form);
      setCart({ items: [], total: 0 });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <form className="rounded-lg border border-black/10 bg-white p-6" onSubmit={submit}>
        <h1 className="text-4xl font-black">Checkout</h1>
        {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="label">Full name</label>
        <input className="input" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} required />
        <label className="label">Email</label>
        <input className="input" type="email" value={form.customerEmail} onChange={(event) => setForm({ ...form, customerEmail: event.target.value })} required />
        <label className="label">Delivery address</label>
        <textarea className="input min-h-28" value={form.deliveryAddress} onChange={(event) => setForm({ ...form, deliveryAddress: event.target.value })} required />
        <label className="label">Phone</label>
        <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
        <button className="btn btn-green mt-6">Place order</button>
      </form>
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-xl font-black">Order total</h2>
        <div className="mt-4 space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span>{item.product.name} x {item.quantity}</span>
              <strong>${(Number(item.product.price) * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-black/10 pt-4 text-lg">
          <span>Total</span>
          <strong>${Number(cart.total).toFixed(2)}</strong>
        </div>
      </aside>
    </section>
  );
}
