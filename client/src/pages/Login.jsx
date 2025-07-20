import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Background from "../components/Background.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
      });
      const data = await res.json();
      if(!res.ok){ setMsg(data.message || "Login failed"); }
      else { login(data.token); navigate("/"); }
    } catch(err) {
      setMsg("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <Background />
      <div className="z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/30 shadow-[0_0_25px_rgba(157,78,221,0.3)]">
        <div className="text-center mb-6">
          <div className="text-5xl font-extrabold gradient-text">&lt;/&gt;</div>
          <h1 className="text-3xl font-extrabold gradient-text mt-2">Welcome Back!</h1>
          <p className="text-gray-300 mt-2">Sign in to continue your coding journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={email} onChange={e=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={password} onChange={e=>setPassword(e.target.value)}
          />
          <div className="flex justify-between text-sm">
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox text-purple-500"/>
              <span>Remember me</span>
            </label>
            <Link className="text-purple-400 hover:text-blue-400" to="#">Forgot password?</Link>
          </div>
          {msg && <p className="text-red-400">{msg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-purple-500 to-blue-400 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link className="text-blue-400 hover:text-purple-400" to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
