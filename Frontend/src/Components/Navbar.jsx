import { Link, useNavigate } from "react-router";
import "./Navbar.css";

const BrandIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 4.5h9a2 2 0 0 1 2 2v12a1 1 0 0 1-1.55.83L12 16.8l-3.95 2.53A1 1 0 0 1 6.5 18.5v-12a2 2 0 0 1 2-2Z" />
    <path d="M9 8h6M9 11h6" />
  </svg>
);

const Navbar = ({ onAddNote }) => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(sessionStorage.getItem("token"));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Main navigation">
        <Link className="navbar-brand" to="/" aria-label="iNotebook home">
          <span className="navbar-mark"><BrandIcon /></span>
          <span>iNotebook</span>
        </Link>

        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <button className="navbar-add-note" type="button" onClick={onAddNote}>+ Add Note</button>
              <button className="navbar-logout" type="button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link className="navbar-login" to="/login">Log in</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
