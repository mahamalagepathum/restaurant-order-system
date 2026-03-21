import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc, } from "firebase/firestore";
import { db }           from "../firebase/firebaseConfig";
import { useAuth }      from "../context/AuthContext";
import AddItemModal     from "./AddItemModal";
import MenuItemCard     from "./MenuItemCard";
import QRCodeDisplay    from "./QRCodeDisplay";

export default function MenuTab() {
  const { user } = useAuth();
  const [items, setItems]         = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [showQR, setShowQR]       = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "menuItems"),
      where("restaurantId", "==", user.uid)
    );
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?"))
      await deleteDoc(doc(db, "menuItems", id));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      {/* Top Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#023E8A] hover:bg-[#012d6b] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          <i className="fa fa-plus"></i> Add Item
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-2 bg-white border-2 border-[#023E8A] text-[#023E8A] hover:bg-[#e8eef8] font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          <i className="fa fa-qrcode"></i>
          Generate QR Code
        </button>
      </div>

      {/* QR Code Section */}
      {showQR && <QRCodeDisplay onClose={() => setShowQR(false)} />}

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center mt-4">
          <i className="fa fa-utensils text-4xl text-gray-300 mb-3 block"></i>
          <p className="text-gray-500 font-medium">No menu items yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Item" to get started</p>
        </div>
      ) : (
        Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold text-[#023E8A] uppercase tracking-wide">{cat}</span>
              <div className="flex-1 h-px bg-[#e8eef8]"></div>
              <span className="text-xs text-gray-400 bg-[#e8eef8] px-2 py-0.5 rounded-full">
                {grouped[cat].length} items
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {grouped[cat].map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <AddItemModal
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}