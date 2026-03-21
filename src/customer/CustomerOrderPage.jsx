import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection, query, where, getDocs,
  addDoc, serverTimestamp, doc, getDoc, onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const SESSION_KEY = "activeOrder";

export default function CustomerOrderPage() {
  const { restaurantId } = useParams();
  const [shopName, setShopName]       = useState("");
  const [menuItems, setMenuItems]     = useState([]);
  const [cart, setCart]               = useState({});
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");
  const [loadError, setLoadError]     = useState("");
  const [orderId, setOrderId]         = useState(null);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [orderTotal, setOrderTotal]   = useState(0);
  const [orderTable, setOrderTable]   = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const { id, total, table, rId } = JSON.parse(saved);
        if (rId === restaurantId && id) {
          setOrderId(id);
          setOrderTotal(total);
          setOrderTable(table);
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, [restaurantId]);

  useEffect(() => {
    async function loadData() {
      setLoadError("");
      try {
        const shopSnap = await getDoc(doc(db, "restaurants", restaurantId));
        if (shopSnap.exists()) {
          setShopName(shopSnap.data().shopName);
        } else {
          setLoadError("Restaurant not found.");
          setLoading(false);
          return;
        }
        const q    = query(collection(db, "menuItems"), where("restaurantId", "==", restaurantId));
        const snap = await getDocs(q);
        const all  = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMenuItems(all.filter((i) => i.isAvailable !== false));
      } catch {
        setLoadError("Failed to load menu. Please try again.");
      }
      setLoading(false);
    }
    loadData();
  }, [restaurantId]);

  useEffect(() => {
    if (!orderId) return;
    const unsub = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists()) setOrderStatus(snap.data().status);
    });
    return unsub;
  }, [orderId]);

  const updateCart = (item, delta) => {
    setCart((prev) => {
      const next = (prev[item.id] || 0) + delta;
      if (next <= 0) { const u = { ...prev }; delete u[item.id]; return u; }
      return { ...prev, [item.id]: next };
    });
  };

  const cartItems  = Object.keys(cart).map((id) => ({ ...menuItems.find((m) => m.id === id), qty: cart[id] }));
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleOrder = async () => {
    setError("");
    if (!tableNumber.trim()) return setError("Please enter your table number.");
    if (cartItems.length === 0) return setError("Please select at least one item.");
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, "orders"), {
        restaurantId,
        tableNumber: tableNumber.trim(),
        items:       cartItems.map((i) => ({ itemName: i.itemName, qty: i.qty, price: i.price })),
        totalPrice,
        status:    "Pending",
        createdAt: serverTimestamp(),
      });
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        id: ref.id, total: totalPrice, table: tableNumber.trim(), rId: restaurantId,
      }));
      setOrderTotal(totalPrice);
      setOrderTable(tableNumber.trim());
      setOrderId(ref.id);
    } catch {
      setError("Failed to place order. Please try again.");
    }
    setSubmitting(false);
  };

  const handleNewOrder = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setOrderId(null);
    setOrderStatus("Pending");
    setCart({});
    setTableNumber("");
  };

  const grouped = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Loading status

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#023E8A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  // load errors
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full">
          <i className="fa fa-circle-exclamation text-3xl text-red-400 mb-4 block"></i>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Could not load menu</h2>
          <p className="text-gray-500 text-sm">{loadError}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 bg-[#023E8A] text-white font-semibold px-6 py-2 rounded-lg text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Order Status
  if (orderId) {
    const isConfirmed = orderStatus === "Confirmed";
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {isConfirmed ? "Order Confirmed!" : "Order Placed!"}
          </h2>
          <p className="text-gray-400 text-sm">Table {orderTable}</p>
          <p className="text-[#023E8A] font-bold text-lg mt-1">Rs. {orderTotal}</p>
          <div className="mt-4">
            <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-1.5 rounded-full transition-colors duration-500 ${
              isConfirmed ? "bg-green-100 text-green-600" : "bg-[#e8eef8] text-[#023E8A]"
            }`}>
              <i className={isConfirmed ? "fa fa-check-circle" : "fa fa-hourglass-half"}></i>
              {orderStatus}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            {isConfirmed
              ? "Your order has been confirmed. It is being prepared now."
              : "Please wait. The restaurant will confirm your order shortly."}
          </p>
          {!isConfirmed && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 bg-[#023E8A] rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-400">Waiting for confirmation...</span>
            </div>
          )}
          {isConfirmed && (
            <button onClick={handleNewOrder}
              className="mt-6 w-full bg-[#023E8A] hover:bg-[#012d6b] text-white font-bold py-3 rounded-xl text-sm transition-colors">
              Place Another Order
            </button>
          )}
        </div>
      </div>
    );
  }

  //  Main Order Form
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#023E8A] text-white px-4 py-5 text-center">
        <i className="fa fa-store text-2xl mb-2 block"></i>
        <h1 className="text-xl font-bold">{shopName}</h1>
        <p className="text-[#e8eef8] text-sm mt-1">Select items and place your order</p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5">

        {menuItems.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-xl px-4 py-4 mb-5 text-center">
            No menu items available at the moment.
          </div>
        )}

        {/* Table Number and add text input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            <i className="fa fa-chair mr-2 text-[#023E8A]"></i>Enter Table Number
          </label>
          <input
            type="text"
            placeholder="e.g. 5"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#023E8A]"
          />
        </div>

        {/* Menu Items cards */}
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold text-[#023E8A] uppercase tracking-wide">{cat}</span>
              <div className="flex-1 h-px bg-[#e8eef8]"></div>
            </div>
            <div className="space-y-2">
              {grouped[cat].map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 p-3">
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.itemName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="fa fa-image text-gray-300 text-xl"></i>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.itemName}</p>
                    {item.description && <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>}
                    <p className="text-[#023E8A] font-bold text-sm mt-1">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateCart(item, -1)} disabled={!cart[item.id]}
                      className={`w-7 h-7 rounded-lg text-sm font-bold border transition-colors ${
                        cart[item.id]
                          ? "bg-[#023E8A] text-white border-[#023E8A] hover:bg-[#012d6b]"
                          : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"}`}>-</button>
                    <span className="w-5 text-center text-sm font-bold text-gray-700">{cart[item.id] || 0}</span>
                    <button onClick={() => updateCart(item, 1)}
                      className="w-7 h-7 rounded-lg text-sm font-bold border bg-[#023E8A] text-white border-[#023E8A] hover:bg-[#012d6b] transition-colors">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Order lists */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.itemName} <span className="text-gray-400">x{item.qty}</span></span>
                  <span className="text-gray-700 font-medium">Rs. {item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-3 mt-3">
              <span>Total</span>
              <span className="text-[#023E8A]">Rs. {totalPrice}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            <i className="fa fa-circle-exclamation mr-2"></i>{error}
          </div>
        )}

        <button onClick={handleOrder} disabled={submitting || menuItems.length === 0}
          className="w-full bg-[#023E8A] hover:bg-[#012d6b] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-md">
          {submitting ? "Placing Order..." : "Order Now"}
        </button>
      </div>
    </div>
  );
}