// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import ShowcaseCarousel from "../components/ShowcaseCarousel.js";
import HeroSection from "../components/HeroSection.jsx";
import CTABanner from "../components/CTABanner.jsx";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      <section id="features">
      {/* Features */}
        <Features />
      </section>

      <section id="about">
      {/* How It Works */}
        <HowItWorks />
      </section>
      {/* Showcase Carousel */}
      <ShowcaseCarousel />

      {/* CTA Banner */}
      <CTABanner />
    </div>
  );
}
