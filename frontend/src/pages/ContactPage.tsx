import React, { useState } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; msg: string }>({
    type: "idle",
    msg: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Sending message..." });
    
    try {
      const apiUrl = ((import.meta.env.VITE_API_URL || '').endsWith('/api') ? `${import.meta.env.VITE_API_URL}/contact` : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/contact` : '/api/contact'));
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: "success", msg: data.msg || "Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", msg: data.msg || "Something went wrong." });
      }
    } catch (error) {
      setStatus({ type: "error", msg: "Failed to connect to the server." });
    }
  };

  return (
    <div className="page-shell">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle mb-8">
        Have any questions, suggestions, or feedback? We'd love to hear from you.
      </p>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {/* Contact Info Sidebar */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="form-card p-6 h-full bg-gradient-to-br from-primary to-secondary text-white">
            <h3 className="mb-6 text-xl font-semibold">Get in Touch</h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Our Location</h4>
                  <p className="text-sm text-blue-100 mt-1">123 Event Street, Tech City, TC 10020</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Phone Number</h4>
                  <p className="text-sm text-blue-100 mt-1">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Email Address</h4>
                  <p className="text-sm text-blue-100 mt-1">nexbyte@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="form-card">
            <div className="form-card-header">
              Send us a Message
            </div>
            <div className="p-6 md:p-8">
              {status.type !== "idle" && (
                <div className={`mb-6 rounded-lg p-4 text-sm ${status.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : status.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                  {status.msg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field resize-y"
                    placeholder="Type your message here..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={status.type === "loading"}
                  className="btn-gradient mt-2 py-3 text-base w-full sm:w-auto sm:self-end"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {status.type === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
