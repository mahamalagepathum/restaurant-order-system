import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";

export default function QRCodeDisplay({ onClose }) {
  const { user }        = useAuth();
  const qrRef           = useRef();
  const [ready, setReady] = useState(false);

  const orderUrl = `${window.location.origin}/order/${user.uid}`;

  //  loading a show QR
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link    = document.createElement("a");
    link.download = "restaurant-qrcode.png";
    link.href     = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4 mb-6 text-center">

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Your Restaurant Menu QR Code</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors text-base font-bold"
        >
          ✕
        </button>
      </div>

      {/* Loading and QR */}
      {!ready ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-12 h-12 border-4 border-[#023E8A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium">Generating QR Code...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          {/* QR Code */}
          <div
            ref={qrRef}
            className="inline-block p-4 bg-white border-2 border-[#023E8A] rounded-xl shadow-sm"
          >
            <QRCodeCanvas
              value={orderUrl}
              size={200}
              fgColor="#023E8A"
            />
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="bg-[#023E8A] hover:bg-[#012d6b] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            <i className="fa fa-download mr-2"></i>Download QR Code
          </button>
        </div>
      )}
    </div>
  );
}