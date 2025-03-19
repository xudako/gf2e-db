import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  const isMenuActive = ["/calculator", "/stages", "/story"].some((path) =>
    location.pathname.startsWith(path)
  );

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-white hover:text-gray-300 transition-colors ${isActive ? "text-orange-500 font-bold" : ""}`;

  return (
    <header className="bg-gray-800 text-white">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}images/default.png`}
                alt="Logo"
                className="h-10 w-10 mr-4"
              />
              <span className="text-xl font-bold">GF2E-DB</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <NavLink to="/dolls" className={navLinkClasses}>
              Dolls
            </NavLink>
            <NavLink to="/weapons" className={navLinkClasses}>
              Weapons
            </NavLink>
            <NavLink to="/enemies" className={navLinkClasses}>
              Enemies
            </NavLink>
            <div className="relative">
              <button
                onClick={handleMenuToggle}
                className={`flex items-center text-white hover:text-gray-300 transition-colors ${
                  isMenuActive ? "text-orange-500 font-bold" : ""
                }`}
              >
                Tools
                <svg
                  className={`ml-1 h-5 w-5 transform transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Tools Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <NavLink
                    to="/calculator"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Calculator
                  </NavLink>
                  <NavLink
                    to="/stages"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Stages
                  </NavLink>
                  <NavLink
                    to="/story"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Story
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileToggle}
            className="sm:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/dolls"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Dolls
            </NavLink>
            <NavLink
              to="/weapons"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Weapons
            </NavLink>
            <NavLink
              to="/enemies"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Enemies
            </NavLink>
            <NavLink
              to="/calculator"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Calculator
            </NavLink>
            <NavLink
              to="/stages"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Stages
            </NavLink>
            <NavLink
              to="/story"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? "bg-gray-700 text-orange-500" : "hover:bg-gray-700"
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              Story
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
