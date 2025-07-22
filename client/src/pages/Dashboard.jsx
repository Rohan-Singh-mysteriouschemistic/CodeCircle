import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Code,
  Users,
  Trophy,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

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
      {/* Top spacing */}
      <div className="h-6" />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Blurs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="gradient-text">Your Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Manage your coding rooms, create new ones, or join your friends for collaborative coding sessions.
          </p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Join Room */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-purple-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Users className="h-6 w-6 mr-3 text-purple-400" />
                Join a Room
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Instantly collaborate by joining a coding room with your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                onClick={handleJoinRoom}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200"
              >
                Go to Join Room
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Create Room */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Code className="h-6 w-6 mr-3 text-blue-400" />
                Create a Room
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Set up your own coding space and host contests as the admin.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                onClick={() => navigate("/create-room")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
              >
                Go to Create Room
                <Code className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* My Rooms */}
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 hover:shadow-green-500/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Trophy className="h-6 w-6 mr-3 text-green-400" />
                My Rooms
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                View and manage the rooms you've created or joined.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                onClick={() => navigate("/rooms")}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
              >
                Show My Rooms
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tip Section */}
        <div className="mb-12 sm:mb-16">
          <Card className="bg-blue-500/10 border border-blue-500/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-full shrink-0">
                  <Lightbulb className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">
                    Pro Tip
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    Only the room creator (admin) can create contests and manage members.
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
