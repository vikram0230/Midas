"use client";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqs = [
  {
    question: "How does Midas AI analyze my financial data?",
    answer:
      "Like King Midas's touch, our AI transforms raw financial data into golden insights. We use advanced algorithms to analyze your spending patterns, income, and financial goals - all while keeping your data secure and private.",
  },
  {
    question: "Will this actually turn my money into gold?",
    answer:
      "Not literally! Unlike the original Midas, we won't turn your assets into physical gold. Instead, we help you make smarter financial decisions that can grow your wealth through AI-powered insights and personalized recommendations.",
  },
  {
    question: "How secure is my financial information?",
    answer:
      "We guard your data like a dragon guards its treasure. We use bank-level encryption, secure servers, and follow strict privacy protocols to ensure your financial information is safer than gold in Fort Knox.",
  },
  {
    question: "Can I try Midas before committing?",
    answer:
      "Yes! We offer a free trial period where you can experience the golden touch of our AI advisor. Unlike King Midas, you can test the waters without any permanent consequences.",
  },
  {
    question: "What makes Midas different from other financial advisors?",
    answer:
      "While traditional advisors rely on human intuition, Midas combines AI technology with financial expertise to provide 24/7 monitoring and real-time insights. Think of it as having a financial alchemist in your pocket, minus the medieval laboratory.",
  },
];

export function AccordionComponent() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Pill badge */}
          <div className="mx-auto w-fit rounded-full border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/30 px-4 py-1 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
              <HelpCircle className="h-4 w-4" />
              <span>Golden Questions</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 pb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Everything you need to know about turning your finances into gold.
            Can&apos;t find what you&apos;re looking for? Our support team has
            the Midas touch for helping.
          </p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border border-amber-200 dark:border-amber-800 rounded-lg mb-4 px-2 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-4 px-2">
                  <span className="font-medium text-left text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
