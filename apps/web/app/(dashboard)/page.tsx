"use client";

import React, { useEffect, useState, useCallback } from "react";
import SaathiMap from "../../components/map/SynapseMap";
import StatsBar from "../../components/dashboard/StatsBar";
import NeedList from "../../components/dashboard/NeedList";
import FileUpload from "../../components/upload/FileUpload";
import SimulationPanel from "../../components/dashboard/SimulationPanel";
import AnalyticsPanel from "../../components/dashboard/AnalyticsPanel";
import NotificationBell from "../../components/dashboard/NotificationBell";
import TaskKanban from "../../components/dashboard/TaskKanban";
import VolunteerRegistration from "../../components/dashboard/VolunteerRegistration";
import { Map as MapIcon, LayoutDashboard, Users } from "lucide-react";
import { fetchNeeds, fetchVolunteers, fetchHotspots } from "../../lib/api";
import { NeedNode, HotspotResult } from "../../lib/types";

export default function Dashboard() {
  const [needs, setNeeds] = useState<NeedNode[]>([]);
  const [vols, setVols] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<HotspotResult[]>([]);
  const [selectedNeed, setSelectedNeed] = useState<NeedNode | null>(null);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "kanban">("map");

  const loadData = useCallback(async () => {
    try {
      const fetchedNeeds = await fetchNeeds();
      setNeeds(fetchedNeeds);
      const fetchedVols = await fetchVolunteers();
      setVols(fetchedVols);
      const fetchedHotspots = await fetchHotspots();
      setHotspots(fetchedHotspots);
    } catch (error) {
      console.error("Failed to sync dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="flex flex-col h-screen bg-[#F5F6F1]">

      {/* ── Top Navigation Bar ──────────────────────────── */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-3 shrink-0 z-20 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-icon.png" alt="logo" className="h-8 w-8 object-contain shrink-0" />
        <div className="leading-none">
          <p className="text-sm font-bold text-[#115E54]">Sanchaalan Saathi</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Emergency Intelligence Platform</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Volunteer layer toggle */}
          <button
            onClick={() => setShowVolunteers(!showVolunteers)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              showVolunteers
                ? "bg-[#115E54]/10 border-[#115E54]/30 text-[#115E54]"
                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Users size={13} />
            Volunteers
          </button>

          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg border border-gray-200 p-0.5">
            <button
              onClick={() => setViewMode("map")}
              title="Map View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "map"
                  ? "bg-white text-[#115E54] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              title="Kanban View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-[#115E54] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </div>

          <NotificationBell />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[320px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden animate-[fade-in_0.4s_ease-out]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            <FileUpload onUploadSuccess={loadData} />
            <AnalyticsPanel needs={needs} vols={vols} />
            <VolunteerRegistration onSuccess={loadData} />
            <NeedList needs={needs} onNeedClick={(need) => setSelectedNeed(need)} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden animate-[fade-in_0.5s_ease-out]">
          <StatsBar needs={needs} vols={vols} />

          <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            {viewMode === "map" ? (
              <>
                <SaathiMap
                  needs={needs}
                  volunteers={vols}
                  hotspots={hotspots}
                  showVolunteers={showVolunteers}
                  onMarkerClick={(need: any) => setSelectedNeed(need)}
                />

                {/* Selected need detail panel */}
                {selectedNeed && (
                  <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-5 w-72 z-10 animate-[slice-in_0.3s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        selectedNeed.urgency_score >= 0.7 ? "bg-red-500" : "bg-amber-500"
                      }`} />
                      <h3 className="font-semibold text-gray-900 text-sm">{selectedNeed.type.toUpperCase()}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedNeed.description}</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-500 space-y-1.5 mb-4">
                      <div className="flex justify-between">
                        <span>Severity Index:</span>
                        <span className="font-semibold text-amber-600">{(selectedNeed.urgency_score * 10).toFixed(1)}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-semibold ${selectedNeed.status === "RESOLVED" ? "text-[#2A8256]" : "text-red-500"}`}>
                          {selectedNeed.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNeed(null)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-2 rounded-lg transition-all font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <SimulationPanel />
              </>
            ) : (
              <div className="w-full h-full p-4 animate-[fade-in_0.4s_ease-out] overflow-hidden">
                <TaskKanban />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
