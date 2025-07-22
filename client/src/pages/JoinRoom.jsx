import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Users, Lightbulb } from "lucide-react";

export default function JoinRoom() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "❌ Error joining room");
      setMessage(`✅ Joined room: ${data.room.name}`);
      setInviteCode("");
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Join a <span className="gradient-text">Room</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Enter your invite code below to join your friends and start collaborating instantly.
          </p>
        </div>
      </section>

      {/* Join Room Form */}
      <section className="flex-grow flex flex-col items-center justify-start px-4 pb-12 space-y-8 mt-6 sm:mt-10">
        <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 shadow-lg w-full max-w-md rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="h-6 w-6 mr-3 text-purple-400" />
              Join a Room
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Paste your invite code below and click join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="bg-gray-900 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
                required
              />
              <Button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white flex justify-center items-center transition-all duration-200"
              >
                Join Room
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
            {message && (
              <p className="mt-4 text-sm font-medium text-center text-gray-300">
                {message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tip Section */}
        <Card className="bg-blue-500/10 border border-blue-500/30 w-full max-w-3xl rounded-2xl">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 text-center sm:text-left">
            <div className="p-3 bg-blue-500/20 rounded-full mb-4 sm:mb-0">
              <Lightbulb className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-lg">After Joining</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Once you join a room, you can chat with members, view the leaderboard, and participate in contests created by the room admin.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
