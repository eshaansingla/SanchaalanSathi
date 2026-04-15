"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface VoiceBriefingProps {
  taskTitle: string;
  taskDescription: string;
  taskLocation: string;
  language?: string; // BCP 47: "hi-IN", "en-US", "ta-IN"
}

export function VoiceBriefing({ taskTitle, taskDescription, taskLocation, language = "en-US" }: VoiceBriefingProps) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    // Truncate inputs to prevent excessively long utterances
    const text = `Task: ${taskTitle.slice(0, 100)}. ${taskDescription.slice(0, 300)}. Location: ${taskLocation.slice(0, 80)}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel(); // stop any ongoing speech first
    window.speechSynthesis.speak(utterance);
  };

  if (unsupported) {
    return (
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <VolumeX size={13} />
        Voice briefing not supported in this browser
      </p>
    );
  }

  return (
    <button
      onClick={speak}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.97] ${
        speaking
          ? "bg-[#115E54]/10 border border-[#115E54]/30 text-[#115E54]"
          : "bg-[#115E54] hover:bg-[#0d4a42] text-white shadow-sm"
      }`}
    >
      {speaking ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Stop Briefing
        </>
      ) : (
        <>
          <Volume2 size={15} />
          Listen to Briefing
        </>
      )}
    </button>
  );
}
