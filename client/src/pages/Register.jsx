import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col">
      {/* ✅ Hero section styled same as Login page */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="gradient-text">CodeCircle</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Create your account and start your coding journey
          </p>
        </div>
      </section>

      {/* ✅ Register Card styled same as Login card */}
      <section className="flex-grow flex flex-col items-center justify-start px-4 pb-12 space-y-8 mt-9">
        <div className="z-10 w-full max-w-md mt-10 p-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-transform shadow-md text-white"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
