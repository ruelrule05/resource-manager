import {Link} from "react-router";
import {useAuth} from "../hooks/useAuth.tsx";

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="navbar border-b border-base-content/10 shadow-base-300/20 shadow-sm">
        <div className="w-full md:flex md:items-center md:gap-2">
          <div className="flex items-center justify-between">
            <div
              className="navbar-start items-center justify-between max-md:w-full">
              <Link to="/"
                className="link text-base-content link-neutral text-xl font-bold no-underline">
                Resource Management
              </Link>
              <div className="md:hidden">
                <button type="button"
                        className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square"
                        data-collapse="#dropdown-navbar-collapse"
                        aria-controls="dropdown-navbar-collapse"
                        aria-label="Toggle navigation">
                  <span
                    className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                  <span
                    className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
                </button>
              </div>
            </div>
          </div>
          <div id="dropdown-navbar-collapse"
               className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full">
            <ul
              className="menu md:menu-horizontal gap-4 p-0 text-base max-md:mt-2 flex items-center justify-evenly">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/about-us" className="hover:text-primary">About Us</Link>
              <Link to="/contact-us" className="hover:text-primary">Contact Us</Link>
              { isAuthenticated && (
                <>
                  <Link to="/projects" className="hover:text-primary">Projects</Link>
                  <Link to="/tasks" className="hover:text-primary">Tasks</Link>
                  <Link to="/inventory-items" className="hover:text-primary">Inventory Items</Link>
                  <a href="#" onClick={() => logout()}>Logout</a>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}