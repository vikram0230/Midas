# Midas - Your AI Financial Assistant 💰

## Overview
Midas is a modern financial management platform that combines real-time transaction tracking with AI-powered insights. Using advanced data visualization and a conversational AI interface, Midas helps users understand their spending patterns and make better financial decisions.

## App Website
https://midas-new.vercel.app/

## 🚀 Tech Stack
- **Frontend**: Next.js 15, Shadcn UI, Tailwind CSS, Three.js, Radix UI, Chart.js
- **Backend**: Convex, Flask, Next.js
- **AI**: Gemini
- **Authentication**: Clerk
- **Banking Integration**: Plaid
- **Machine Learning**: PyTorch

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- A Convex account
- A Clerk account
- A Plaid account (for banking integration)

### Installation
```bash
# Clone the repository
git clone https://github.com/ArslanKamchybekov/midas.git

# Navigate to the project directory
cd uncommonhacks

# Install dependencies
npm install

# Set up environment variables
cp .env.local
```

### Development
```bash
# Start the development server
npm run dev

# Start Convex development server
npx convex dev
```

### Production Deployment
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🎮 Features

### 1. Smart Financial Dashboard
- Real-time transaction tracking
- Dynamic spending analytics
- Category-based expense breakdown
- Interactive charts and graphs

### 2. Midas AI Assistant
- Natural language financial queries
- Personalized financial insights
- Budget recommendations
- Anomaly detection in spending patterns

### 3. Transaction Management
- Automatic transaction categorization
- Custom budget settings
  - Weekly budget tracking
  - Bi-weekly budget tracking
  - Monthly budget tracking
- Real-time transaction updates

### 4. Data Visualization
- Bar charts for category spending
- Pie charts for expense distribution
- Line charts for spending trends
- Anomaly detection visualization

## 💬 Using Midas AI

Simply chat with Midas using natural language. Example queries:
- "How are my finances looking?"
- "Show me my spending by category"
- "What's my biggest expense this month?"
- "Am I staying within my budget?"
- "Any unusual spending patterns?"

## 🔒 Security
- Secure authentication via Clerk
- Encrypted banking connections through Plaid
- Protected API endpoints
- Secure data storage with Convex

## 📊 Data Integration
- Import transactions via CSV
- Connect bank accounts through Plaid
- Real-time transaction syncing
- Automated categorization

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
