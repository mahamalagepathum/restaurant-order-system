import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import Navbar    from "../components/Navbar";
import OrdersTab from "../components/OrdersTab";
import MenuTab   from "../components/MenuTab";

export default function DashboardPage() {
  const { user } = useAuth();
  const [shopName, setShopName]   = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    async function loadShop() {
      const snap = await getDoc(doc(db, "restaurants", user.uid));
      if (snap.exists()) setShopName(snap.data().shopName);
    }
    loadShop();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <Navbar shopName={shopName} />

      {/* Main Content class */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Tab Buttons */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "orders"
                ? "bg-[#023E8A] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fa fa-list-check"></i>
            Orders
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "menu"
                ? "bg-[#023E8A] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="fa fa-utensils"></i>
            Customize Menu
          </button>
        </div>

        {/* Active tab content */}
        {activeTab === "orders" ? <OrdersTab /> : <MenuTab />}

      </div>
    </div>
  );
}