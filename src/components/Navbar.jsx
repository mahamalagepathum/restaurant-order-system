import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Navbar({ shopName }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-[#023E8A] text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Shop Name */}
        <div className="flex items-center gap-2">
          <i className="fa fa-store text-lg"></i>
          <span className="font-bold text-lg truncate max-w-xs">
            {shopName || "My Restaurant"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-[#023E8A] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#e8eef8] transition-colors"
        >
          <i className="fa fa-sign-out-alt"></i>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}