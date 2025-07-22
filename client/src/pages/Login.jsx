import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || "Login failed");
      } else {
        login(data.token);
        navigate("/");
      }
    } catch (err) {
      setMsg("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col">
      {/* ✅ Hero section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back <span className="gradient-text">to CodeCircle</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to continue your coding journey
          </p>
        </div>
      </section>

      {/* ✅ Login Card */}
      <section className="flex-grow flex flex-col items-center justify-start px-4 pb-12 mt-9">
        <div className="z-10 w-full max-w-md mt-4 sm:mt-10 p-6 sm:p-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="User-Id"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-between text-sm text-gray-400">
              <Link className="text-purple-600 hover:underline" to="#">
                Forgot password?
              </Link>
            </div>
            {msg && <p className="text-red-500">{msg}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-transform shadow-md text-white"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link className="text-blue-600 hover:underline" to="/register">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
