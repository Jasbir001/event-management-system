// src/routes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
import SessionTimeout from "./components/SessionTimeout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateUserPage from "./pages/CreateUserPage";
import AboutPage from "./pages/AboutPage";
import EventBookedPage from "./pages/EventBookedPage";
import MyBookingPage from "./pages/MyBookingPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <SessionTimeout />
    <Header />
    <Chat />
    {/* Main content wrapper */}
    <main className="min-h-[calc(100vh-5rem)]">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/useraccount" element={<CreateUserPage />} />
        <Route path="/forget_password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/eventbooked" element={<EventBookedPage />} />
        <Route path="/booked" element={<EventBookedPage />} />
        <Route path="/mybooking" element={<MyBookingPage />} />
        <Route path="/booking" element={<MyBookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Catch-all Route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default AppRoutes;
