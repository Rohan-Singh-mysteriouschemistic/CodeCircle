import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Background from "../components/Background.jsx";

export default function Register() {
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(password!==confirm){
      setError("Passwords do not match");
      return;
    }
    try{
      await axios.post("http://localhost:5000/api/users/register",{username,email,password});
      navigate("/login");
    }catch(err){
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <Background />
      <div className="z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-400/30 shadow-[0_0_25px_rgba(157,78,221,0.3)]">
        <div className="text-center mb-6">
          <div className="text-5xl font-extrabold gradient-text">&lt;/&gt;</div>
          <h1 className="text-3xl font-extrabold gradient-text mt-2">Create Your Account</h1>
          <p className="text-gray-300 mt-2">Join CodeSpace Buddies and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={username} onChange={e=>setUsername(e.target.value)}
          />
          <input
            type="email" placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={email} onChange={e=>setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={password} onChange={e=>setPassword(e.target.value)}
          />
          <input
            type="password" placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg bg-transparent border border-purple-400 focus:outline-none focus:border-blue-400 transition-colors"
            value={confirm} onChange={e=>setConfirm(e.target.value)}
          />
          {error && <p className="text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-purple-500 to-blue-400 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:text-purple-400" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
