import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, PlusCircle } from "lucide-react";

export default function CreateRoom() {
  const { token } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Error creating room");
      setMessage(`✅ Room created! Invite code: ${data.room.inviteCode}`);
      setRoomName("");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col">
      <div className="h-16" />
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your <span className="gradient-text">Own Room</span></h1>
          <p className="text-gray-400 text-lg">
            Set up a new coding space, invite your friends, and start collaborating. 
            As the creator, you’ll be the admin and can host contests!
          </p>
        </div>
      </section>

      {/* Main Card */}
      <section className="flex-grow flex flex-col items-center justify-start px-4 pb-12 space-y-8 mt-9">
        <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 shadow-lg w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <PlusCircle className="h-7 w-7 mr-3 text-purple-400" />
              Create a New Room
            </CardTitle>
            <CardDescription className="text-gray-400">
              Set up your own coding space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name"
                className="bg-gray-900 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
                required
              />
              <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200">
                Create Room
              </Button>
            </form>
            {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
          </CardContent>
        </Card>

        {/* Pro Tip Section */}
        <Card className="bg-blue-500/10 border border-blue-500/30 w-full rounded-lg">
          <CardContent className="p-6 flex items-center justify-center sm:justify-start space-x-4 max-w-7xl mx-auto">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Lightbulb className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-1 text-lg">Pro Tip</h3>
              <p className="text-gray-300 text-sm">
                As the room creator, you’re the admin. You can organize contests, manage members, and lead collaborative coding sessions.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
