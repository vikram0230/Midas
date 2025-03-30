// Updated technology stack using existing icon files
const technologies = [
  {
    name: "Next.js",
    icon: "/nextjs-icon.svg",
    description: "Our frontend framework, providing server-side rendering and API routes for a fast, SEO-friendly financial application with optimized performance."
  },
  {
    name: "PyTorch",
    icon: "/pytorch-icon.svg",
    description: "Powers our advanced machine learning models for financial pattern recognition, spending predictions, and anomaly detection algorithms."
  },
  {
    name: "Three.js",
    icon: "/threejs.png",
    description: "Creates immersive 3D data visualizations that transform abstract financial data into intuitive interactive models for better understanding."
  },
  {
    name: "Midnight",
    icon: "/midnight.jpg",
    description: "Database technology that ensures round-the-clock reliability for financial transactions with high throughput and low latency performance."
  },
  {
    name: "Gemini API",
    icon: "/gemini.png",
    description: "Integrates Google's advanced AI capabilities into our chatbot, enabling natural language processing of financial queries and personalized insights."
  },
  {
    name: "Plaid",
    icon: "/plaid-icon.svg",
    description: "Securely connects to users' bank accounts, providing real-time transaction data while maintaining privacy and industry-standard security protocols."
  }
];

// Default export component with the correct name to fix the import issue
export default function MarketingCards() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 pb-2">
          The Inner Workings of Midas
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Our financial platform leverages these cutting-edge technologies to deliver a secure, intelligent, and seamless experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-amber-100 dark:border-amber-900 hover:shadow-lg hover:shadow-amber-100/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-3 flex items-center justify-center">
                  <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}