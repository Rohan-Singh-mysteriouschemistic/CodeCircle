import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Trophy } from "lucide-react";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/rooms/my-rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => console.error("❌ Failed to fetch rooms:", err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your <span className="gradient-text">Rooms</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Here are the rooms you’ve joined or created. View leaderboards, chat
            with friends, or check contest results.
          </p>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {rooms.length === 0 ? (
            <div className="text-center bg-gray-800/40 rounded-xl border border-gray-700 p-10">
              <p className="text-gray-300 text-lg">
                You haven’t joined any rooms yet.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Create or join a room to get started with your friends!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card
                  key={room._id}
                  className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-purple-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col rounded-2xl"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Users className="h-6 w-6 mr-2 text-purple-400" />
                      {room.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm break-all">
                      Invite Code: <span className="text-white">{room.inviteCode}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-3">
                    <Button
                      onClick={() => navigate(`/leaderboard/${room._id}`)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Button>
                    <Button
                      onClick={() => navigate(`/rooms/${room._id}/chat`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Chat
                    </Button>
                    <Button
                      onClick={() => navigate(`/room/${room._id}/results`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                    >
                      🏅 Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
