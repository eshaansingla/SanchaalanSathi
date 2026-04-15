"use client";

import React, { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";

export default function CameraCapture({ onCapture }: { onCapture: (file: File) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleConfirm = () => {
    if (file) onCapture(file);
  };

  const clear = () => {
    setPreviewUrl(null);
    setFile(null);
  };

  if (previewUrl) {
    return (
      <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Captured preview" className="object-cover w-full h-full" />
          <button
            onClick={clear}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-200"
          >
            <X size={16} />
          </button>
        </div>
        <button
          onClick={handleConfirm}
          className="w-full bg-[#115E54] hover:bg-[#0d4a42] py-3 rounded-xl font-semibold text-white transition-colors active:scale-[0.98]"
        >
          Confirm Verification Photo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative p-6 border-2 border-dashed border-gray-200 bg-white rounded-xl hover:border-[#115E54]/40 hover:bg-[#115E54]/4 transition-all flex flex-col items-center justify-center cursor-pointer min-h-[200px]">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="bg-[#115E54]/8 p-4 rounded-full mb-3">
          <Camera size={28} className="text-[#115E54]" />
        </div>
        <h3 className="font-semibold text-gray-800 text-sm">Open Camera</h3>
        <p className="text-xs text-gray-400 mt-1">Take a live photo for verification</p>
      </div>

      <div className="relative p-4 border border-gray-200 bg-white rounded-xl flex items-center justify-center gap-2 hover:border-[#115E54]/30 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleCapture}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">Upload existing photo</span>
      </div>
    </div>
  );
}
