import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function RegisterPage() {
  const [form, setForm]       = useState({ ownerName: "", shopName: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.ownerName || !form.shopName || !form.email || !form.password)
      return setError("All fields are required.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "restaurants", result.user.uid), {
        ownerName: form.ownerName,
        shopName:  form.shopName,
        email:     form.email,
        uid:       result.user.uid,
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#023E8A] mb-1">Register your restaurant</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            <i className="fa fa-circle-exclamation mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Owner Name</label>
            <input name="ownerName" placeholder="Your full name"
              value={form.ownerName} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#023E8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Restaurant Name</label>
            <input name="shopName" placeholder="e.g. Kamal's Kitchen"
              value={form.shopName} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#023E8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
            <input name="email" type="email" placeholder="email@example.com"
              value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#023E8A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
            <input name="password" type="password" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#023E8A]"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#023E8A] hover:bg-[#012d6b] text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-[#023E8A] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}