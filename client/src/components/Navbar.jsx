import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Code } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id) => {
    if (location.pathname !== "/") {
      // Navigate to home first, then scroll after a short delay
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Already on home, just scroll
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = user
    ? [
        { name: "Home", to: "/" },
        { name: "Dashboard", to: "/dashboard" },
        { name: "Profile", to: "/profile" },
      ]
    : [
        { name: "Home", to: "/" },
        { name: "Features", to: "#features" },
        { name: "About", to: "#about" },
      ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-gray-900/70 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-gradient-to-br from-[#9D4EDD] to-[#3BE8B0]">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="tracking-tight">CodeCircle</span>
        </span>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.to.startsWith("#") ? (
              <button
                key={link.name}
                onClick={() => handleScroll(link.to.substring(1))}
                className="text-white relative group transition duration-300 opacity-80 hover:opacity-100"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#9D4EDD] to-[#3BE8B0] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : (
              <span
                key={link.name}
                onClick={() => navigate(link.to)}
                className={`cursor-pointer text-white relative group transition duration-300 ${
                  location.pathname === link.to
                    ? "font-semibold"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#9D4EDD] to-[#3BE8B0] transition-all duration-300 group-hover:w-full"></span>
              </span>
            )
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3 items-center">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 rounded-lg border border-white/30 text-white hover:border-[#9D4EDD] hover:text-[#9D4EDD] transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#9D4EDD] to-[#3BE8B0] text-white font-semibold hover:opacity-90 transition-all duration-300"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg border border-white/20 text-white hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
