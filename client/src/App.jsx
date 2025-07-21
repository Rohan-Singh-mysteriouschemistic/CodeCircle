import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateRoom from "./pages/CreateRoom.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import Rooms from "./pages/Rooms.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import RoomChat from "./pages/RoomChat.jsx";
import RoomResults from "./pages/RoomResults.jsx";

export default function App() {
  const location = useLocation();

  // 👇 Define paths where Navbar should be hidden
  const noNavbarRoutes = ["/login", "/register"];
  // 👇 Define paths where Footer should be hidden
  const noFooterRoutes = ["/login", "/register"];
  const isRoomChat = location.pathname.startsWith("/rooms/") && location.pathname.endsWith("/chat");

  const hideNavbar = noNavbarRoutes.includes(location.pathname);
  const hideFooter = noFooterRoutes.includes(location.pathname) || isRoomChat;

  return (
    <>
      {/* ✅ Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-room"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard/:roomId"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId/chat"
          element={
            <ProtectedRoute>
              <RoomChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId/results"
          element={
            <ProtectedRoute>
              <RoomResults />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ✅ Conditionally render Footer */}
      {!hideFooter && <Footer />}
    </>
  );
}
