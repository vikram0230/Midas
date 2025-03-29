"use client";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center py-20"
      aria-label="Midas Hero"
    >
      {/* Background gradient and grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-400 dark:bg-amber-500 opacity-20 blur-[100px]"></div>

        {/* Stock chart SVG - Updated for better visibility */}
        <div className="absolute inset-0 -z-20 opacity-30 dark:opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
            className="text-amber-500 dark:text-amber-400 transform scale-150"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop
                  offset="0%"
                  style={{ stopColor: "rgb(217, 119, 6)", stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "rgb(217, 119, 6)", stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>

            {/* Area under the chart */}
            <path
              d="M0 1000 L0 650 C150 620, 300 550, 450 600 C600 650, 750 500, 900 400 L1000 350 L1000 1000 Z"
              fill="url(#gradient)"
            />

            {/* Main stock trend line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0 650 C150 620, 300 550, 450 600 C600 650, 750 500, 900 400 L1000 350"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* Data points */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <circle cx="150" cy="620" r="8" fill="currentColor" />
              <circle cx="300" cy="550" r="8" fill="currentColor" />
              <circle cx="450" cy="600" r="8" fill="currentColor" />
              <circle cx="750" cy="500" r="8" fill="currentColor" />
              <circle cx="900" cy="400" r="8" fill="currentColor" />
            </motion.g>
          </svg>
        </div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
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
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 animate-gradient-x pb-2"
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
