import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Logo from "./Logo";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    // Clear auth state before navigating, and force it to flush synchronously.
    // Otherwise ProtectedRoute (still mounted on the current protected page)
    // can react to the cleared token and redirect to /login in a race against
    // this explicit navigate("/"), landing on whichever one settles last.
    flushSync(() => {
      logout();
    });
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />
        <nav className="navbar-links">
          <Link to="/recipes">Recipes</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
