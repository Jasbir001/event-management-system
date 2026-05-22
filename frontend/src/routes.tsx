// src/routes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateUserPage from "./pages/CreateUserPage";
import AllEventPage from "./pages/AllEventPage";
import EventBookedPage from "./pages/EventBookedPage";
import MyBookingPage from "./pages/MyBookingPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Chat />
    {/* pt-20 clears fixed navbar so marquee and page content sit below it */}
    <main className="min-h-[calc(100vh-5rem)] pt-20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/useraccount" element={<CreateUserPage />} />
        <Route path="/eventbooks" element={<AllEventPage />} />
        <Route path="/eventbooked" element={<EventBookedPage />} />
        <Route path="/mybooking" element={<MyBookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRoutes;
