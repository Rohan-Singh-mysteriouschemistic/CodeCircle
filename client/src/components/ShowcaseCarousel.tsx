import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import dashboardMockup from "../assets/dashboard-mockup.png";
import chatMockup from "@/assets/chat-mockup.png";
import contestMockup from "@/assets/contest-mockup.jpg";

const slides = [
  {
    id: 1,
    image: dashboardMockup,
    title: "Room Dashboard",
    caption: "Create rooms, sync stats, and stay on top of your coding community."
  },
  {
    id: 2,
    image: chatMockup,
    title: "Chat Channels",
    caption: "Collaborate in real time with focused discussions for every room."
  },
  {
    id: 3,
    image: contestMockup,
    title: "LeaderBoards",
    caption: "Track rankings and performance with clear, insightful analytics."
  }
];

const ShowcaseCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            See It in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
            Explore the powerful features that make CodeCircle Buddies the perfect platform for collaborative coding.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-6 overflow-hidden">
            {/* Slides Container */}
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-xl"></div>
                  
                  {/* Slide Content */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-white/80 text-lg">
                      {slide.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 border border-border/20"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 border border-border/20"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;