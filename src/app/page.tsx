'use client'

import { Inter } from "next/font/google";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 animate-gradient-x overflow-hidden relative">
      {/* Psychedelic background elements */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full mix-blend-screen animate-pulse"
            style={{
              width: `${Math.random() * 30 + 10}vw`,
              height: `${Math.random() * 30 + 10}vw`,
              background: `radial-gradient(circle, rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.8) 0%, rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0) 70%)`,
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating fractals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={`fractal-${i}`}
            className="absolute animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
              animation: `float ${Math.random() * 20 + 10}s infinite linear`,
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path
                d="M50 10 L90 50 L50 90 L10 50 Z"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M30 30 L70 30 L70 70 L30 70 Z"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-purple-400 to-cyan-300 mb-8 tracking-tight animate-pulse">
          ARMI TIER LIST
        </h1>
        
        <Link href="/game">
          <button 
            className="group relative overflow-hidden rounded-full text-2xl font-bold py-6 px-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 hover:from-pink-400 hover:via-purple-500 hover:to-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white"
          >
            <span className="relative z-10">START GAME!</span>
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-lg"></span>
          </button>
        </Link>
      </main>

      {/* Add some CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
