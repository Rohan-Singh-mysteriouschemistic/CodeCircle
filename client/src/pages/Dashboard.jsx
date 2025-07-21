import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Trophy, Lightbulb, LogOut, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!user?.leetCodeId) {
      alert("❌ Please link your LeetCode ID first in your Profile");
      navigate("/profile");
      return;
    }
    navigate("/join-room");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="h-6" />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to <span className="gradient-text">Your Dashboard</span></h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Manage your coding rooms, create new ones, or join your friends for collaborative coding sessions.
          </p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Join Room Card */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="h-6 w-6 mr-3 text-purple-400" />
                Join a Room
              </CardTitle>
              <CardDescription className="text-gray-400">
                Click below to navigate to the join room page and start collaborating instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button onClick={handleJoinRoom} className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200">
                Go to Join Room
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Create Room Card */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Code className="h-6 w-6 mr-3 text-blue-400" />
                Create a Room
              </CardTitle>
              <CardDescription className="text-gray-400">
                Set up your own coding space. As the creator, you become the room's admin and can create contests for members.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button onClick={() => navigate("/create-room")} className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200">
                Go to Create Room
                <Code className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* My Rooms Card */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Trophy className="h-6 w-6 mr-3 text-purple-400" />
                My Rooms
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage the rooms you've joined or created. Click below to view your rooms.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button onClick={() => navigate("/rooms")} className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200">
                Show My Rooms
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tip Section */}
        <div className="mb-16">
          <Card className="bg-blue-500/10 border border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pro Tip</h3>
                  <p className="text-gray-400">
                    Only the room creator (admin) can create contests and manage members. Look for the admin badge to identify your permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}