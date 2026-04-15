"use client";

import React, { useState } from "react";
import { askGraphIntelligence, runComparisonSim } from "@/lib/api";
import { SimulationComparison } from "@/lib/types";
import { useToast } from "../../hooks/useToast";

export default function SimulationPanel() {
  const [query, setQuery] = useState("");
  const [comparison, setComparison] = useState<SimulationComparison | null>(null);
  const [askResult, setAskResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [simSteps, setSimSteps] = useState(100);
  const { toast } = useToast();

  const handleSimCompare = async () => {
    setLoading(true);
    const steps = Math.min(Math.max(simSteps, 10), 500);
    try {
      const result = await runComparisonSim(steps);
      if (result) {
        setComparison(result);
        toast("Parallel simulation completed.", "success");
      }
    } catch (e) {
      toast("Simulation interface error.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAskGraph = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const result = await askGraphIntelligence(query.slice(0, 200));
      setAskResult(result);
      toast("Query executed successfully.", "success");
    } catch (e) {
      toast("Query failed. Try again.", "error");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-6 right-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-lg flex gap-6 z-20 max-h-72">

      {/* NLP Search */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#115E54] rounded-full" />
          Graph Intelligence
        </h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Query community intelligence..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-3 pr-16 text-sm text-gray-700 focus:outline-none focus:border-[#115E54]/40 placeholder-gray-400"
              value={query}
              maxLength={200}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskGraph()}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              {query.length}/200
            </div>
          </div>
          <button
            onClick={handleAskGraph}
            disabled={loading}
            className="bg-[#115E54] hover:bg-[#0d4a42] text-white px-5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Run
          </button>
        </div>
        <div className="mt-3 flex-1 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 font-mono">
          {askResult ? (
            <pre className="whitespace-pre-wrap">{JSON.stringify(askResult.results, null, 2)}</pre>
          ) : (
            <span className="text-gray-400">NLP-to-Cypher terminal standing by...</span>
          )}
        </div>
      </div>

      <div className="w-px bg-gray-100" />

      {/* Strategy Comparison */}
      <div className="w-[380px] flex flex-col min-w-[340px]">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#2A8256] rounded-full" />
          Strategy Comparison
        </h3>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="number"
              min={10}
              max={500}
              value={simSteps}
              onChange={(e) => setSimSteps(parseInt(e.target.value) || 10)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:border-[#115E54]/40 outline-none"
            />
            <div className="absolute -top-2 left-2.5 px-1 bg-white text-[9px] text-gray-400 uppercase tracking-tight">Steps</div>
          </div>
          <button
            onClick={handleSimCompare}
            disabled={loading}
            className="flex-[2] bg-[#2A8256] hover:bg-[#115E54] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? "Simulating..." : "Run Parallel Match"}
          </button>
        </div>

        <div className="flex-1 flex gap-3">
          {comparison ? (
            <>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-medium mb-2">A: Baseline</span>
                <div className="text-xl font-bold text-gray-800">{comparison.comparison.baseline.completion_rate}%</div>
                <div className="text-[10px] text-gray-500 mt-auto">{comparison.comparison.baseline.estimated_hours}h est.</div>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="flex-1 bg-[#48A15E]/8 border border-[#48A15E]/30 rounded-lg p-3 flex flex-col">
                <span className="text-[10px] text-[#2A8256] uppercase font-semibold mb-2">B: Optimized</span>
                <div className="text-xl font-bold text-gray-800">{comparison.comparison.optimized.completion_rate}%</div>
                <div className="text-[10px] text-[#2A8256] font-semibold mt-auto">+{comparison.comparison.delta_completion_rate}% lift</div>
              </div>
            </>
          ) : (
            <div className="flex-1 border border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-xs text-gray-400">Awaiting scenario initiation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
