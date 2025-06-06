import React, { useEffect, useRef } from "react";

interface PopupProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Popup({ onClose, children }: PopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={ref} className="bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
