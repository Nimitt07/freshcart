import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-black">
            <span className="grid h-9 w-9 place-items-center rounded bg-leaf text-white">V</span>
            Veena Traders
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <NavLink className="nav-link" to="/products">Products</NavLink>
            {user && <NavLink className="nav-link" to="/orders">Orders</NavLink>}
            {user?.role === 'ADMIN' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cart" className="btn btn-light">Cart ({count})</Link>
            {user ? (
              <button className="btn btn-dark" onClick={logout}>Logout</button>
            ) : (
              <Link className="btn btn-dark" to="/login">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
          <p>Veena Traders - local-first grocery store.</p>
          <p>Admin seed login: admin@grocery.test / admin123</p>
        </div>
      </footer>
    </div>
  );
}
