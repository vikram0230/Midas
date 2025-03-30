import { IconProps } from "@radix-ui/react-icons/dist/types";

// Custom financial-themed technology icons
const TechIcons = {
  nextjs: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 256 256" {...props}>
      <defs>
        <linearGradient id="nextjs-gradient" x1="55.633%" x2="83.228%" y1="56.385%" y2="96.08%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#DAA520" stopOpacity="0.8"/>
        </linearGradient>
        <linearGradient id="nextjs-gradient-b" x1="50%" x2="49.953%" y1="0%" y2="73.438%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#DAA520" stopOpacity="0.8"/>
        </linearGradient>
        <circle id="nextjs-circle" cx="128" cy="128" r="128"/>
      </defs>
      <mask id="nextjs-mask" fill="#fff">
        <use href="#nextjs-circle"/>
      </mask>
      <g mask="url(#nextjs-mask)">
        <circle cx="128" cy="128" r="128" fill="#000"/>
        <path fill="url(#nextjs-gradient)" d="M212.634 224.028 98.335 76.8H76.8v102.357h17.228V98.68L199.11 234.446a128.433 128.433 0 0 0 13.524-10.418Z"/>
        <path fill="url(#nextjs-gradient-b)" d="M163.556 76.8h17.067v102.4h-17.067z"/>
      </g>
    </svg>
  ),
  react: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="1.5" fill="#FFC700" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#FFC700" strokeWidth="1" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#FFC700" strokeWidth="1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#FFC700" strokeWidth="1" transform="rotate(120 12 12)" />
    </svg>
  ),
  tailwind: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33" width="30px" height="30px" {...props}>
      <g clipPath="url(#prefix__clip0)">
        <path fill="#FFD700" fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd"/>
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path fill="#fff" d="M0 0h54v32.4H0z"/>
        </clipPath>
      </defs>
    </svg>
  ),
  typescript: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <rect width="36" height="36" x="6" y="6" fill="#DAA520"/>
      <polygon fill="#fff" points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"/>
      <path fill="#fff" d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"/>
    </svg>
  ),
  python: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id="python-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#DAA520"/>
        </linearGradient>
      </defs>
      <path fill="url(#python-gradient)" d="M12 0C5.372 0 5.604 2.394 5.604 2.394l.01 2.476h6.512v.913H3.5S0 5.439 0 12.067c0 6.626 3.032 6.386 3.032 6.386h1.81v-3.076s-.101-3.076 3.044-3.076h5.96s3.02-.038 3.02-2.93V3.836S17.318 0 12 0zm-3.208 1.618c.675 0 1.22.54 1.22 1.208a1.214 1.214 0 0 1-1.22 1.207c-.675 0-1.22-.54-1.22-1.207 0-.669.545-1.208 1.22-1.208z"/>
      <path fill="url(#python-gradient)" d="M12 24c6.628 0 6.396-2.394 6.396-2.394l-.01-2.476h-6.512v-.913H20.5s3.5.344 3.5-6.284c0-6.626-3.032-6.386-3.032-6.386h-1.81v3.076s.101 3.076-3.044 3.076h-5.96s-3.02.038-3.02 2.93v5.534S6.682 24 12 24zm3.208-1.618a1.214 1.214 0 0 1-1.22-1.208c0-.669.545-1.207 1.22-1.207.675 0 1.22.538 1.22 1.207 0 .669-.545 1.208-1.22 1.208z"/>
    </svg>
  ),
  gemini: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 4L12 12L18 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 20L12 12L18 20" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12H21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="#FFD700" />
    </svg>
  ),
  plaid: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7C4 5.89543 4.89543 5 6 5Z" stroke="#DAA520" strokeWidth="1.5" />
      <path d="M4 9H20" stroke="#DAA520" strokeWidth="1.5" />
      <path d="M4 15H20" stroke="#DAA520" strokeWidth="1.5" />
      <path d="M12 5V19" stroke="#DAA520" strokeWidth="1.5" />
      <path d="M8 12H16" stroke="#DAA520" strokeWidth="1.5" />
      <path d="M9 9.5H7V7.5H9V9.5Z" fill="#DAA520" />
      <path d="M17 16.5H15V14.5H17V16.5Z" fill="#DAA520" />
    </svg>
  ),
  flask: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 3H15V6H9V3Z" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M10 6V11.5C10 12.33 9.76 13.14 9.32 13.83L5 21H19L14.68 13.83C14.24 13.14 14 12.33 14 11.5V6" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M6 15H18" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M7.5 18H16.5" stroke="#FFD700" strokeWidth="1.5" />
      <path d="M17 10L19 8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 9L17 6" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18.5" cy="5.5" r="0.75" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5" />
      <circle cx="19.5" cy="9.5" r="0.75" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5" />
    </svg>
  ),
  shadcn: (props: IconProps) => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="24" height="24" rx="4" fill="#000000" />
      <path d="M13.5 9.5L12 8L10.5 9.5L12 11L13.5 9.5Z" fill="#FFD700" />
      <path d="M17 13L15.5 11.5L14 13L15.5 14.5L17 13Z" fill="#FFD700" />
      <path d="M10 13L8.5 11.5L7 13L8.5 14.5L10 13Z" fill="#FFD700" />
      <path d="M13.5 16.5L12 15L10.5 16.5L12 18L13.5 16.5Z" fill="#FFD700" />
      <path d="M8.5 8.5L7 7L5.5 8.5L7 10L8.5 8.5Z" fill="#DAA520" />
      <path d="M18.5 8.5L17 7L15.5 8.5L17 10L18.5 8.5Z" fill="#DAA520" />
      <path d="M18.5 17.5L17 16L15.5 17.5L17 19L18.5 17.5Z" fill="#DAA520" />
      <path d="M8.5 17.5L7 16L5.5 17.5L7 19L8.5 17.5Z" fill="#DAA520" />
    </svg>
  )
};

const technologies = [
  {
    name: "Next.js",
    icon: TechIcons.nextjs,
    description: "Our frontend framework of choice, providing server-side rendering, routing, and API endpoints in a React environment, creating a fast and responsive financial interface."
  },
  {
    name: "React",
    icon: TechIcons.react,
    description: "Powers our interactive UI components with a component-based architecture that enables modular development and efficient state management for complex financial data displays."
  },
  {
    name: "TypeScript",
    icon: TechIcons.typescript,
    description: "Ensures type safety throughout our codebase, reducing errors in financial calculations and data handling while improving development speed and code quality."
  },
  {
    name: "Tailwind CSS",
    icon: TechIcons.tailwind,
    description: "Facilitates rapid UI development with utility-first styling, allowing us to create a consistent, responsive design system for our financial platform without writing custom CSS."
  },
  {
    name: "Python",
    icon: TechIcons.python,
    description: "Powers our backend ML models and data processing pipelines, handling complex financial analysis, pattern recognition, and predictive algorithms."
  },
  {
    name: "Gemini API",
    icon: TechIcons.gemini,
    description: "Integrates advanced AI capabilities into our chatbot, enabling natural language processing of financial queries and generating personalized financial insights and recommendations."
  },
  {
    name: "Plaid",
    icon: TechIcons.plaid,
    description: "Securely connects to users' bank accounts, providing real-time transaction data and account information while maintaining strict privacy and security standards."
  },
  {
    name: "Flask",
    icon: TechIcons.flask,
    description: "Lightweight Python web framework used for our ML model API endpoints, allowing seamless communication between our AI backend and Next.js frontend."
  },
  {
    name: "shadcn/ui",
    icon: TechIcons.shadcn,
    description: "Provides accessible, customizable UI components that accelerate development while maintaining a professional financial application appearance with consistent interactions."
  }
];

export default function TechnologyStack() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 pb-2">
          Built with Golden Technologies
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
          Our financial platform leverages cutting-edge technologies to deliver a secure, intelligent, and seamless experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-amber-100 dark:border-amber-900 hover:shadow-lg hover:shadow-amber-100/20 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 mr-3 flex items-center justify-center">
                  <tech.icon />
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