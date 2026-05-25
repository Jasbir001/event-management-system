// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import loginImg from "../assets/images/login.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/login` : '/api/login';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("userLoggedIn", "true");
        sessionStorage.setItem("userRole", data.role || "user");
        sessionStorage.setItem("userEmail", email);
        
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="overflow-hidden rounded-2xl border-4 border-white shadow-xl ring-2 ring-blue-100">
            <img src={loginImg} alt="login" className="h-44 w-44 object-cover" />
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-gradient w-full">
                Login
              </button>
            </form>
            <div className="mt-6 space-y-2 text-center text-sm">
              <Link to="/forget_password" className="block text-primary transition-colors hover:text-blue-700">
                Forgot Password?
              </Link>
              <Link to="/useraccount" className="block font-medium text-primary transition-colors hover:text-blue-700">
                New user? Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
