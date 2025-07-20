// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4rem 2rem",
        textAlign: "center",
      }}
    >
      {/* Main headline */}
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          fontWeight: "bold",
        }}
      >
        🚀 Welcome to{" "}
        <span
          style={{
            background: "linear-gradient(45deg,#9D4EDD,#3BE8B0)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          CodeSpace Buddies
        </span>
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "800px",
          margin: "0 auto",
          lineHeight: 1.6,
          opacity: 0.9,
        }}
      >
        CodeSpace Buddies is your collaborative coding hub.  
        Create private rooms with your friends, join rooms with invite codes,
        and soon swap skills, chat, and call each other while competing on
        leaderboards. Build, learn, and grow — together.
      </p>

      {/* Image or illustration */}
      <div style={{ marginTop: "3rem" }}>
        <img
          src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
          alt="Coding Illustration"
          style={{
            maxWidth: "600px",
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0 0 30px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Call-to-action buttons */}
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              style={buttonStyle("#3498db")}
            >
              🔑 Login
            </button>
            <button
              onClick={() => navigate("/register")}
              style={buttonStyle("#2ecc71")}
            >
              ✨ Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              style={buttonStyle("#9D4EDD")}
            >
              📋 Go to Dashboard
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "4rem",
          fontSize: "0.9rem",
          opacity: 0.6,
        }}
      >
        © {new Date().getFullYear()} CodeSpace Buddies. All rights reserved.
      </footer>
    </div>
  );
}

function buttonStyle(color) {
  return {
    padding: "0.8rem 1.5rem",
    fontSize: "1.1rem",
    backgroundColor: color,
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };
}
