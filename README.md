# CheckIn App

A social check-in application that allows users to share their location, connect with friends, and discover places around them.

O app vai ser como https://checkin-social-hub-93.lovable.app/home

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
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives with custom styling

## API Data Contract (Frontend)

The frontend expects the following `Venue` shape from the backend:

```ts
// src/lib/api.ts
export interface Venue {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  address?: string | null;
  latitude?: string | null;   // updated: now string
  longitude?: string | null;  // updated: now string
  phone?: string | null;
  website?: string | null;
  hours?: string | null;
  price_range?: string | null; // updated: now string
  rating: number;
  total_reviews: number;
  image_url?: string | null;
  tags?: string[] | null;
  is_active: boolean;
  features?: string | null;   // new: semicolon/comma separated features
}
```

Notes:
- `features` is a plain string (e.g.: "Aceita cartão; Mesas ao ar livre; Wi-fi gratuito"). The UI splits by comma or semicolon and renders chips.
- If you compute distances or map markers, parse `latitude`/`longitude` with `parseFloat` before calculations.

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
- Conta no Supabase (para autenticação e banco de dados)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd checkin-frontend

# Install dependencies
npm install

# Configure Supabase
# 1. Crie um projeto no Supabase
# 2. Execute o schema em database/schema_only.sql
# 3. Configure as variáveis de ambiente (veja SUPABASE_SETUP.md)

# Start development server
npm run dev
```

### Environment

Set `VITE_API_BASE_URL` to point the frontend to your backend, and the Supabase variables as per `SUPABASE_SETUP.md`.

### Configuração do Supabase

O projeto já está configurado com as credenciais do Supabase. Para começar:

1. **Configuração Rápida**: Veja [QUICK_SETUP.md](./QUICK_SETUP.md)
2. **Configuração Detalhada**: Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. **Credenciais**: Veja [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)

**Importante**: Execute o schema `database/schema_only.sql` no Supabase antes de usar o app.

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

## Changelog (Frontend)

- Updated `Venue.latitude`/`longitude` to `string | null` (were numbers)
- Updated `Venue.price_range` to `string | null` (was a union)
- Added `Venue.features: string | null` and UI chips in Venue Details
- Reduced tagline font-size in Welcome screen ("Where are we going?")
- Removed outdated React Native navigation files from project root
- Removed duplicate Supabase client under `src/integrations/supabase/`
- Cleaned excessive console logs and TODO markers

## Contributing

1. Follow the existing code style and patterns
2. Use the design system components and classes
3. Test on mobile devices
4. Ensure accessibility standards are met

## License

This project is private and proprietary.
