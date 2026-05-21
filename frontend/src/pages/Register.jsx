import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <form className="rounded-lg border border-black/10 bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-3xl font-black">Create account</h1>
        {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <label className="label">Email</label>
        <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="label">Password</label>
        <input className="input" type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn btn-green mt-6 w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <p className="mt-4 text-center text-sm text-black/60">Already have an account? <Link className="font-bold text-leaf" to="/login">Login</Link></p>
      </form>
    </section>
  );
}
