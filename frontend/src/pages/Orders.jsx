import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black">Orders</h1>
      {orders.length === 0 && <EmptyState title="No orders yet" body="Placed orders will appear here." />}
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Order #{order.id}</h2>
                <p className="text-sm text-black/60">{new Date(order.createdAt).toLocaleString()} - {order.status}</p>
              </div>
              <p className="text-xl font-black">${Number(order.total).toFixed(2)}</p>
            </div>
            <div className="mt-4 grid gap-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
