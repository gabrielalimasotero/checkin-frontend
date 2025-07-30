# CheckIn App

A social check-in application that allows users to share their location, connect with friends, and discover places around them.

## Project Overview

CheckIn is a mobile-first social networking app built with React and TypeScript. Users can:

- **Check-in** at venues and share their location
- **Connect** with friends and see their check-ins
- **Discover** new places and people nearby
- **Manage** their social network and invitations
- **Rate** and review places they've visited

## Features

### Core Functionality
- **Check-in System**: Users can check-in at venues and share their status
- **Social Network**: Friend connections and social interactions
- **Venue Discovery**: Find and explore new places
- **Real-time Updates**: Live status and location sharing
- **Invitation System**: Send and receive event invitations

### User Interface
- **Mobile-First Design**: Optimized for mobile devices
- **Tab Navigation**: Easy navigation between main sections
- **Real-time Notifications**: Stay updated with friend activities
- **Clean UI**: Modern, intuitive interface using shadcn/ui components

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query for server state
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with custom styling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Main application pages
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and design system
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd checkin-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run check-design` - Check design system consistency

## Design System

The app uses a consistent design system with:

- **Color Palette**: Primary blue (#084d6e), white, and black
- **Typography**: Helvetica as default, Ubuntu for headings
- **Components**: Standardized UI components with consistent spacing
- **Layout**: Mobile-first responsive design

## Contributing

1. Follow the existing code style and patterns
2. Use the design system components and classes
3. Test on mobile devices
4. Ensure accessibility standards are met

## License

This project is private and proprietary.
