
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Welcome from "./pages/Welcome";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
                <Route path="/home" element={<Home />} />
                <Route path="/checkin" element={<CheckIn />} />
                <Route path="/social" element={<Social />} />
                <Route path="/post" element={<Post />} />
                <Route path="/restaurantes" element={<Restaurantes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/venue/:id" element={<VenueDetails />} />
                <Route path="/venue/boteco-da-maria" element={<BotecoDaMariaProfile />} />
                <Route path="/status" element={<Status />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
