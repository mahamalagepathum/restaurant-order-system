import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import OrderCard from "./OrderCard";

function playBeep() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

export default function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders]             = useState([]);
  const [alert, setAlert]               = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const knownIds = useRef(new Set());
  const isFirst  = useRef(true);
  const timerRef = useRef(null);

  const showAlert = (order) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlert({
      tableNumber: order.tableNumber,
      itemCount:   order.items.reduce((s, i) => s + i.qty, 0),
      total:       order.totalPrice,
    });
    setAlertVisible(true);
    playBeep();
    timerRef.current = setTimeout(() => setAlertVisible(false), 6000);
  };

  const dismissAlert = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAlertVisible(false);
  };

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("restaurantId", "==", user.uid)
    );
    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) =>
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
      );
      if (!isFirst.current) {
        const newOrders = data.filter(
          (o) => !knownIds.current.has(o.id) && o.status === "Pending"
        );
        if (newOrders.length > 0) showAlert(newOrders[0]);
      }
      data.forEach((o) => knownIds.current.add(o.id));
      isFirst.current = false;
      setOrders(data);
    });
  }, [user]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleConfirm = async (id) =>
    await updateDoc(doc(db, "orders", id), { status: "Confirmed" });

  const pendingOrders   = orders.filter((o) => o.status === "Pending");
  const confirmedOrders = orders.filter((o) => o.status === "Confirmed");

  return (
    <div className="space-y-5">

      {/* New Order Alert Banner */}
      <div className={`overflow-hidden transition-all duration-500 ${
        alertVisible ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="bg-[#023E8A] text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <i className="fa fa-bell text-xl animate-bounce"></i>
            <div>
              <p className="font-bold text-base leading-tight">
                New Order — Table {alert?.tableNumber}
              </p>
              <p className="text-[#e8eef8] text-sm mt-0.5">
                {alert?.itemCount} item{alert?.itemCount !== 1 ? "s" : ""} &nbsp;·&nbsp; Rs. {alert?.total}
              </p>
            </div>
          </div>
          <button
            onClick={dismissAlert}
            className="ml-4 text-white text-xl font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </div>

      {/* No Orders */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <i className="fa fa-bell text-4xl text-gray-300 mb-3 block"></i>
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-1">New orders will appear here in real time</p>
        </div>
      )}

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-[#023E8A] uppercase tracking-wide">Pending</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {pendingOrders.length} New
            </span>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} onConfirm={handleConfirm} />
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Orders */}
      {confirmedOrders.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-bold text-green-600 uppercase tracking-wide">Confirmed</span>
            <div className="flex-1 h-px bg-green-100"></div>
          </div>
          <div className="space-y-3">
            {confirmedOrders.map((order) => (
              <OrderCard key={order.id} order={order} onConfirm={handleConfirm} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}