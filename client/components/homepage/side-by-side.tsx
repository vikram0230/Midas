"use client";
import { Computer, Network, Sparkles } from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";
import { OrbitingCirclesComponent } from "./orbiting-circles";
import { motion } from "motion/react";

const features = [
  {
    name: "The Golden Touch of Automation",
    description:
      "Like King Midas himself, we turn your financial chaos into gold-standard organization. Unlike him, you can still eat your lunch afterwards.",
    icon: Computer,
  },
  {
    name: "Worth Its Weight in Gold",
    description:
      "Focus on growing your wealth while we handle the number-crunching. Consider us your personal financial alchemist, minus the medieval laboratory.",
    icon: FaBusinessTime,
  },
  {
    name: "Fortune Favors the Prepared",
    description:
      "Scale your finances from copper to gold with our enterprise-ready platform. We handle the heavy lifting, so your wallet can do the heavy growing.",
    icon: Network,
  },
];

export default function SideBySide() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:pr-8 lg:pt-4"
          >
            <div className="lg:max-w-lg">
              {/* Pill badge */}
              <div className="mb-6 w-fit rounded-full border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/30 px-4 py-1">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
                  <Sparkles className="h-4 w-4" />
                  <span>The Midas Difference</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 pb-2">
                Everything You Touch Will Turn to Gold*
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                *Metaphorically speaking. Let our AI-powered financial advisor
                help you make golden decisions. No ancient Greek curses
                included.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    key={feature.name}
                    className="relative pl-12 group hover:bg-amber-50 dark:hover:bg-amber-900/20 p-4 rounded-xl transition-colors"
                  >
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        className="absolute left-3 top-5 h-6 w-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-background/5 to-background/0 z-10"></div>
              <OrbitingCirclesComponent />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
