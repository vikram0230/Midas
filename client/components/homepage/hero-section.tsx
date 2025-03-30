"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  // Use state to ensure client-side only rendering for animations
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Generate fixed positions for dollar signs (no randomness during render)
  const dollarPositions = Array(30).fill(null).map((_, i) => ({
    id: i,
    x: `${(i % 10) * 10 + 5}%`,
    y: `${Math.floor(i / 10) * 20 + 10}%`,
    size: 24 + (i % 5) * 12,
    delay: (i % 7) * 0.4,
    duration: 3 + (i % 4),
  }));

  return (
    <section
      className="relative flex flex-col items-center justify-center py-20"
      aria-label="Midas Hero"
    >
      {/* Background gradient and grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-400 dark:bg-amber-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* Gold dollar signs background - only shown after mount */}
      {isMounted && (
        <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
          {/* Animated floating dollar signs */}
          {dollarPositions.map((dollar) => (
            <motion.div
              key={`dollar-${dollar.id}`}
              className="absolute text-amber-500 dark:text-amber-400 font-bold"
              style={{
                left: dollar.x,
                top: dollar.y,
                fontSize: dollar.size,
              }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0], 
                scale: [0, 1, 0],
                y: [0, -30],
                rotate: [0, (dollar.id % 2 === 0 ? 20 : -20)]
              }}
              transition={{
                duration: dollar.duration,
                delay: dollar.delay,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              $
            </motion.div>
          ))}
          
          {/* Gold sparkles - similar to the LinkedIn hover effect */}
          {Array(8).fill(null).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-amber-300"
              style={{
                top: `${20 + (i % 4) * 20}%`,
                left: `${30 + (i % 3) * 20}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 180],
                y: [0, -30]
              }}
              transition={{
                duration: 3 + (i % 3),
                delay: 1 + (i % 5) * 0.8,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Sparkles size={16 + (i % 3) * 8} />
            </motion.div>
          ))}
          
          {/* Golden glow effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 opacity-20 blur-[100px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      )}

      <div className="space-y-6 text-center max-w-4xl px-4 relative z-10">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/30 px-4 py-1 mb-6"
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
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 pb-2"
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
              className="rounded-full px-8 h-12 border-2 border-amber-200 dark:border-amber-800"
            >
              Watch Demo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}