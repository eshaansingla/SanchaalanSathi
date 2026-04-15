"use client";

import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { NeedNode } from "../../lib/types";
import { BarChart2 } from "lucide-react";

interface AnalyticsPanelProps {
  needs: NeedNode[];
  vols: any[];
}

const BRAND_COLORS = ["#115E54", "#2A8256", "#48A15E", "#95C78F", "#d97706", "#3b82f6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-md">
      {label && <p className="text-gray-500 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPanel({ needs, vols }: AnalyticsPanelProps) {
  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    needs.forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [needs]);

  const statusDist = useMemo(() => {
    const pending  = needs.filter((n) => n.status === "PENDING").length;
    const resolved = needs.filter((n) => n.status === "RESOLVED").length;
    const other    = needs.length - pending - resolved;
    return [
      { name: "Pending",  value: pending,  color: "#d97706" },
      { name: "Resolved", value: resolved, color: "#48A15E" },
      { name: "Other",    value: other,    color: "#3b82f6"  },
    ].filter((d) => d.value > 0);
  }, [needs]);

  const urgencyDist = useMemo(() => {
    const buckets = [
      { name: "Low",      min: 0,    max: 0.3,  count: 0, color: "#48A15E" },
      { name: "Medium",   min: 0.3,  max: 0.6,  count: 0, color: "#d97706" },
      { name: "High",     min: 0.6,  max: 0.8,  count: 0, color: "#f97316" },
      { name: "Critical", min: 0.8,  max: 1.01, count: 0, color: "#ef4444" },
    ];
    needs.forEach((n) => {
      const b = buckets.find((b) => n.urgency_score >= b.min && n.urgency_score < b.max);
      if (b) b.count++;
    });
    return buckets.map((b) => ({ name: b.name, count: b.count, color: b.color }));
  }, [needs]);

  const volStatus = useMemo(() => {
    const active  = vols.filter((v) => v.availabilityStatus === "ACTIVE").length;
    const busy    = vols.filter((v) => v.availabilityStatus === "BUSY").length;
    const offline = vols.filter((v) => v.availabilityStatus === "OFFLINE").length;
    return [
      { name: "Active",  value: active,  color: "#48A15E" },
      { name: "Busy",    value: busy,    color: "#d97706" },
      { name: "Offline", value: offline, color: "#9ca3af" },
    ].filter((d) => d.value > 0);
  }, [vols]);

  const isEmpty = needs.length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={15} className="text-[#115E54]" />
        <h3 className="text-sm font-semibold text-gray-800">Analytics</h3>
        <span className="text-xs text-gray-400 ml-auto">{needs.length} total needs</span>
      </div>

      {isEmpty ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          No data yet — seed the database or ingest a report
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {/* Needs by Type */}
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Needs by Type</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={byType} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[3, 3, 0, 0]}>
                  {byType.map((_, i) => (
                    <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Split */}
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Status Split</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {statusDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Pie>
                <Legend
                  iconSize={8}
                  formatter={(val) => <span style={{ fontSize: 10, color: "#6b7280" }}>{val}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Urgency Levels */}
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Urgency Levels</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={urgencyDist} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count" radius={[3, 3, 0, 0]}>
                  {urgencyDist.map((d, i) => (
                    <Cell key={i} fill={d.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Volunteer Status */}
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">Volunteer Status</p>
            {vols.length === 0 ? (
              <div className="h-[120px] flex items-center justify-center text-gray-400 text-sm">
                No volunteer data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={volStatus} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" paddingAngle={3}>
                    {volStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} fillOpacity={0.9} />
                    ))}
                  </Pie>
                  <Legend
                    iconSize={8}
                    formatter={(val) => <span style={{ fontSize: 10, color: "#6b7280" }}>{val}</span>}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
