# Clause - AI-Powered Contract Analyzer

**Clause** is an AI-powered web application that helps tenants and patients in Massachusetts automatically detect illegal clauses in contracts and medical bills, calculate potential refunds, and generate professional demand letters. Built with Next.js 15, featuring a modern liquid glass design inspired by iOS 18.

## 🌟 Overview

Clause uses advanced AI to analyze rental leases and medical bills, identifying potential violations of Massachusetts state law. The app automatically:

- 🔍 **Detects illegal clauses** in leases and medical bills
- 💰 **Calculates potential refunds** based on legal violations
- 📝 **Generates demand letters** ready to send to landlords or providers
- 📚 **Provides legal guidance** with an integrated policies library
- 🔒 **Protects your privacy** with automatic document de-identification

## ✨ Key Features

### Design & User Experience
- **Liquid Glass Design** - Modern, iOS 18-inspired UI with translucent surfaces and warm gradients
- **Dark & Light Modes** - Fully designed themes with distinct identities
- **Consumer-Friendly** - Warm, approachable, and trustworthy interface
- **Responsive** - Optimized for desktop and mobile devices

### Core Functionality
- **Document Upload & Analysis** - Upload leases or medical bills for AI-powered analysis
- **Document Workspace** - Dedicated workspace for each document with document-scoped AI chat
- **Case Management** - Track your cases, monitor progress, and manage recovery efforts
- **Policies & Documents Hub** - Access your past documents and legal guides in one place
- **AI Helper** - Get instant answers about your documents and legal rights
- **Review Step** - Review detected information before analysis (de-identification preview)
- **Results Dashboard** - Beautiful results page with key findings and suggested next steps

### Technical Features
- **Next.js 15** - Latest Next.js features with App Router
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Custom warm color palette and liquid glass utilities
- **Mock Data Integration** - Realistic mock data for development and demonstration
- **Template Modals** - Preview analysis, generate letters, and create cases with template modals

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SonnyZhan/Clause_frontend.git
cd Clause_frontend
```

2. **Install dependencies**

```bash
npm install
```

Or if you're using Yarn:

```bash
yarn install
```

3. **Start the development server**

```bash
npm run dev
```

Or with Yarn:

```bash
yarn dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
clause/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (home)/            # Dashboard and home pages
│   │   ├── analysis/          # Document analysis view
│   │   ├── auth/              # Authentication pages
│   │   ├── cases/             # Case management pages
│   │   ├── policies/          # Policies & Documents Hub
│   │   ├── results/           # Results pages
│   │   ├── upload/            # Document upload flow
│   │   └── welcome/           # Landing page
│   ├── components/            # React components
│   │   ├── Layouts/          # Sidebar, Header, etc.
│   │   ├── Modals/           # Modal components
│   │   ├── MockActivity/     # Mock activity components
│   │   └── ...
│   ├── data/                 # Mock data
│   ├── css/                  # Global styles
│   └── ...
├── public/                    # Static assets
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Color Palette

The app uses a warm, consumer-friendly color palette:

- **Peach** - Soft, warm primary color
- **Coral** - Energetic accent color
- **Orchid** - Premium secondary color
- **Gold** - Warning and attention color
- **Mint** - Success and security color

### Liquid Glass

Liquid glass surfaces are created using:
- Translucent backgrounds with `backdrop-blur`
- Soft inner shadows and highlights
- Rounded corners (pill and blob shapes)
- Warm gradient overlays

## 🔐 Privacy & Security

Clause takes privacy seriously:

- **Automatic De-identification** - All documents are de-identified before AI analysis
- **No PII in Vector Database** - Personally identifiable information is never stored in the AI database
- **Encrypted Storage** - All data is encrypted at rest and in transit
- **User Control** - You can delete your data at any time

## 📄 Pages & Routes

- `/` - Dashboard (home)
- `/welcome` - Landing page
- `/auth/sign-in` - Sign in / Sign up
- `/upload` - Document upload flow
- `/upload/review` - Review detected information
- `/results/[id]` - Analysis results page
- `/analysis` - Full analysis view
- `/cases` - Case management hub
- `/cases/[id]` - Case detail page
- `/policies` - Policies & Documents Hub
- `/policies/document/[id]` - Document workspace
- `/security` - Security & Settings
- `/help` - Help & Support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Design**: Custom liquid glass design system
- **Icons**: Custom SVG icons
- **State Management**: React hooks (useState, useEffect)

## 📝 Mock Data

The app includes comprehensive mock data for development:

- Mock documents (leases, medical bills)
- Mock cases with different statuses
- Mock policies and legal guides
- Mock analysis results
- Mock chat conversations

See `src/data/mockData.ts` for the full mock data structure.

## 🎯 Key Components

### Modals
- `AnalysisPreviewModal` - Preview analysis results
- `GenerateLetterModal` - Generate demand letters
- `CreateCaseModal` - Create new cases

### Layout Components
- `Sidebar` - Main navigation with liquid glass styling
- `Header` - Top bar with search and theme toggle
- `Logo` - Free Money branding with sparkles icon

### Mock Activity
- `RecentActivity` - Recent activity feed
- `ApiStatusBadges` - API connection status indicators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Design inspired by iOS 18 liquid glass aesthetics

## 📧 Support

For support, email support@clause.app or open an issue in the GitHub repository.

---

**Made with ❤️ for tenants and patients in Massachusetts**

