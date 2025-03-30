"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center py-20 w-full bg-white dark:bg-black"
      aria-label="Midas Hero"
    >
      {/* Full-width background */}
      <div className="absolute inset-0 w-screen bg-white dark:bg-black">
        {/* Dollar signs with better distribution */}
        <div className="absolute inset-0 w-screen pointer-events-none">
          {/* Top and middle dollar signs */}
          <div className="dollar-sign" style={{ left: "5%", top: "15%", fontSize: "30px", animationDelay: "0s" }}>$</div>
          <div className="dollar-sign" style={{ left: "15%", top: "40%", fontSize: "35px", animationDelay: "0.8s" }}>$</div>
          <div className="dollar-sign" style={{ left: "25%", top: "65%", fontSize: "28px", animationDelay: "1.6s" }}>$</div>
          <div className="dollar-sign" style={{ left: "35%", top: "20%", fontSize: "32px", animationDelay: "2.4s" }}>$</div>
          <div className="dollar-sign" style={{ left: "45%", top: "50%", fontSize: "30px", animationDelay: "3.2s" }}>$</div>
          <div className="dollar-sign" style={{ left: "55%", top: "75%", fontSize: "34px", animationDelay: "4.0s" }}>$</div>
          <div className="dollar-sign" style={{ left: "65%", top: "25%", fontSize: "29px", animationDelay: "0.4s" }}>$</div>
          <div className="dollar-sign" style={{ left: "75%", top: "60%", fontSize: "36px", animationDelay: "1.2s" }}>$</div>
          <div className="dollar-sign" style={{ left: "85%", top: "35%", fontSize: "31px", animationDelay: "2.0s" }}>$</div>
          <div className="dollar-sign" style={{ left: "95%", top: "80%", fontSize: "33px", animationDelay: "2.8s" }}>$</div>
        </div>
      </div>

      {/* Section transition - this is key for blending with the next section */}
      <div className="absolute left-0 right-0 -bottom-12 h-24 pointer-events-none z-20">
        {/* Transition dollar signs that appear to "swim" between sections */}
        <div className="transition-dollar" style={{ left: "20%", fontSize: "36px", animationDelay: "0.5s" }}>$</div>
        <div className="transition-dollar" style={{ left: "40%", fontSize: "32px", animationDelay: "1.1s" }}>$</div>
        <div className="transition-dollar" style={{ left: "60%", fontSize: "38px", animationDelay: "1.7s" }}>$</div>
        <div className="transition-dollar" style={{ left: "80%", fontSize: "34px", animationDelay: "2.3s" }}>$</div>
        <div className="transition-dollar" style={{ left: "30%", fontSize: "30px", animationDelay: "2.9s" }}>$</div>
        <div className="transition-dollar" style={{ left: "50%", fontSize: "35px", animationDelay: "3.5s" }}>$</div>
        <div className="transition-dollar" style={{ left: "70%", fontSize: "33px", animationDelay: "4.1s" }}>$</div>
        
        {/* Subtle gradient connector to eliminate the "line" */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-white dark:via-black dark:to-black z-10"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4 relative z-10">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
            <Sparkles className="h-4 w-4" />
            <span>The Modern Midas Touch</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-300 dark:to-amber-400 pb-2"
        >
          Turn Your Finances <br className="hidden sm:block" />
          Into Gold
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Let AI be your financial alchemist. Transform your spending habits
          into wealth-building opportunities, without turning your lunch into
          literal gold.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-500 text-white rounded-full px-8 h-12"
            >
              Start Your Golden Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/demo" aria-label="Watch Demo">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 border-2 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/30"
            >
              Watch Demo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Updated animations with specialized transition dollars */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(15px) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-70px) scale(1.05);
            opacity: 0;
          }
        }
        
        .dollar-sign {
          position: absolute;
          color: #B45309;
          font-weight: bold;
          animation: float-up 6s infinite; /* Faster animation: 8s → 6s */
          text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
        }
        
        @media (prefers-color-scheme: dark) {
          .dollar-sign {
            color: #EAB308;
          }
        }
        
        /* Special transition dollar signs that "swim" between sections */
        .transition-dollar {
          position: absolute;
          color: #B45309;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
          opacity: 0;
          animation: swim-between 7s infinite; /* Faster animation: 10s → 7s */
        }
        
        @media (prefers-color-scheme: dark) {
          .transition-dollar {
            color: #EAB308;
          }
        }
        
        @keyframes swim-between {
          0% {
            transform: translate(0, -5px) scale(0.9);
            opacity: 0;
          }
          10% {
            transform: translate(10px, 0) scale(1);
            opacity: 0.8;
          }
          30% {
            transform: translate(-5px, 10px) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: translate(5px, 15px) scale(1);
            opacity: 0.4;
          }
          70% {
            transform: translate(-10px, 20px) scale(0.9);
            opacity: 0.2;
          }
          100% {
            transform: translate(0, 30px) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite; /* Faster animation: 5s → 4s */
        }
      `}</style>
    </section>
  );
}