
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Social from "./pages/Social";
import Post from "./pages/Post";
import Restaurantes from "./pages/Restaurantes";
import Profile from "./pages/Profile";
import VenueDetails from "./pages/VenueDetails";
import BotecoDaMariaProfile from "./pages/BotecoDaMariaProfile";
import Status from "./pages/Status";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import MainNavigation from "@/components/MainNavigation";

const queryClient = new QueryClient();

// Component to conditionally render navigation
const ConditionalNavigation = () => {
  const location = useLocation();
  
  // Pages that shouldn't show navigation
  const noNavPages = ['/welcome', '/auth/callback'];
  
  // Don't show navigation on auth pages
  if (noNavPages.includes(location.pathname)) {
    return null;
  }
  
  return <MainNavigation />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* Mobile App Container - 19.5:9 aspect ratio */}
          <div className="mobile-viewport bg-background">
            <div className="mobile-container bg-background">
              <Routes>
                <Route path="/" element={<Navigate to="/welcome" replace />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/checkin" element={
                  <ProtectedRoute>
                    <CheckIn />
                  </ProtectedRoute>
                } />
                <Route path="/social" element={
                  <ProtectedRoute>
                    <Social />
                  </ProtectedRoute>
                } />
                <Route path="/post" element={
                  <ProtectedRoute>
                    <Post />
                  </ProtectedRoute>
                } />
                <Route path="/restaurantes" element={
                  <ProtectedRoute>
                    <Restaurantes />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/venue/:id" element={
                  <ProtectedRoute>
                    <VenueDetails />
                  </ProtectedRoute>
                } />
                <Route path="/venue/boteco-da-maria" element={
                  <ProtectedRoute>
                    <BotecoDaMariaProfile />
                  </ProtectedRoute>
                } />
                <Route path="/status" element={
                  <ProtectedRoute>
                    <Status />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ConditionalNavigation />
            </div>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
