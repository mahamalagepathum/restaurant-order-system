import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function OrderCard({ order, onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  const isPending = order.status === "Pending";

  const time = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await updateDoc(doc(db, "orders", order.id), { status: "Confirmed" });
      if (onConfirm) onConfirm(order.id);
    } catch (err) {
      console.error("Confirm failed:", err);
    }
    setConfirming(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${
      isPending ? "border-[#023E8A]" : "border-green-500"
    }`}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <i className="fa fa-chair text-gray-400 text-sm"></i>
            <span className="font-bold text-gray-800">Table {order.tableNumber}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{time}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isPending ? "bg-[#e8eef8] text-[#023E8A]" : "bg-green-100 text-green-600"
        }`}>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3 space-y-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {item.itemName} <span className="text-gray-400">x{item.qty}</span>
            </span>
            <span className="text-gray-600">Rs. {item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {/* Total and  Confirm status */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-800 text-sm">
          Total: <span className="text-[#023E8A]">Rs. {order.totalPrice}</span>
        </span>
        {isPending && (
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fa fa-check mr-1"></i>
            {confirming ? "Confirming..." : "Confirm Order"}
          </button>
        )}
      </div>
    </div>
  );
}