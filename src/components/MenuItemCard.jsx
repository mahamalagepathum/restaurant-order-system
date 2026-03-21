import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
      !item.isAvailable ? "opacity-60" : ""
    }`}>

      {/* Item Image */}
      <div className="relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.itemName} className="w-full h-32 object-cover" />
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
            <i className="fa fa-image text-3xl text-gray-300"></i>
          </div>
        )}

        {/* Badge */}
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
          item.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
        }`}>
          {item.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Item Info */}
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm truncate">{item.itemName}</p>
        <p className="text-[#023E8A] font-bold text-sm mt-0.5">Rs. {item.price}</p>
        {item.description && (
          <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>
        )}

        {/* Toggle button */}
        <button
          onClick={async () => {
            await updateDoc(doc(db, "menuItems", item.id), {
              isAvailable: !item.isAvailable,
            });
          }}
          className={`w-full mt-2 text-xs font-semibold py-1.5 rounded-lg transition-colors ${
            item.isAvailable
              ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
              : "bg-green-50 hover:bg-green-100 text-green-600"
          }`}
        >
          <i className={`fa ${item.isAvailable ? "fa-eye-slash" : "fa-eye"} mr-1`}></i>
          {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
        </button>

        {/* Edit / Delete buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 bg-[#e8eef8] hover:bg-[#d0ddf5] text-[#023E8A] text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            <i className="fa fa-pen mr-1"></i>Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            <i className="fa fa-trash mr-1"></i>Delete
          </button>
        </div>
      </div>
    </div>
  );
}