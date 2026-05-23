// src/pages/CreateUserPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import newUserImg from "../assets/images/newuser.jpg";

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
    gender: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.cpassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/useraccount` : '/api/useraccount';
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      alert(data.msg || "Account created!");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-shell py-6">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-100">
          <img src={newUserImg} alt="New User" className="h-full max-h-[520px] w-full object-cover" />
        </div>

        <div className="form-card">
          <div className="form-card-header flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5" />
            <span>Create Your Account</span>
          </div>
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input id="username" name="username" required className="input-field" onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" name="email" required className="input-field" onChange={handleChange} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                  <input id="password" type="password" name="password" required className="input-field" onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="cpassword" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input id="cpassword" type="password" name="cpassword" required className="input-field" onChange={handleChange} />
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-gray-700">Gender</span>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input type="radio" name="gender" value="male" required className="text-primary" onChange={handleChange} />
                    <span className="text-sm">Male</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input type="radio" name="gender" value="female" className="text-primary" onChange={handleChange} />
                    <span className="text-sm">Female</span>
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                <textarea id="address" name="address" rows={3} required className="input-field resize-none" onChange={handleChange} />
              </div>
              <button type="submit" className="btn-gradient w-full">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
