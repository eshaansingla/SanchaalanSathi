"use client";

import React from "react";
import { useTasks } from "../../hooks/useFirestore";
import { FirestoreTask } from "../../lib/types";
import { Clock, MapPin, Zap } from "lucide-react";

const COLUMNS = [
  { id: "OPEN",      label: "Open",      headerColor: "border-[#115E54]/40 text-[#115E54]",  dot: "bg-[#115E54]"  },
  { id: "CLAIMED",   label: "Claimed",   headerColor: "border-amber-400/60 text-amber-700",   dot: "bg-amber-500"  },
  { id: "SUBMITTED", label: "Submitted", headerColor: "border-blue-400/50 text-blue-600",      dot: "bg-blue-500"   },
  { id: "VERIFIED",  label: "Verified",  headerColor: "border-[#48A15E]/50 text-[#2A8256]",   dot: "bg-[#48A15E]"  },
];

function getUrgencyStyle(score: number) {
  if (score >= 0.8) return "text-red-600 bg-red-50 border-red-200";
  if (score >= 0.5) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-[#2A8256] bg-[#48A15E]/10 border-[#48A15E]/30";
}

export default function TaskKanban() {
  const { tasks, loading } = useTasks();

  if (loading) {
    return (
      <div className="flex h-full gap-4 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 min-w-[240px] flex flex-col gap-2">
            <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
            {[1, 2].map((j) => (
              <div key={j} className="h-28 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div key={col.id} className="flex-1 min-w-[240px] flex flex-col">
            <div className={`mb-3 px-3 py-2 bg-white border border-gray-200 rounded-lg border-b-2 ${col.headerColor.split(" ")[0]} flex justify-between items-center shadow-sm`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className={`text-xs font-semibold ${col.headerColor.split(" ")[1]}`}>{col.label}</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">{columnTasks.length}</span>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
              {columnTasks.length === 0 ? (
                <div className="p-5 bg-white border border-dashed border-gray-200 rounded-xl text-center">
                  <p className="text-xs text-gray-400">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#115E54]/30 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${getUrgencyStyle(task.urgency || 0.5)}`}>
                        {((task.urgency || 0.5) * 10).toFixed(1)} crit
                      </span>
                      <span className="text-[10px] text-gray-400">#{task.id.slice(-4).toUpperCase()}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-1">{task.title}</h4>
                    <p className="text-[11px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>

                    <div className="pt-2.5 border-t border-gray-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <MapPin className="w-3 h-3 text-[#115E54]/60 shrink-0" />
                        <span className="truncate">{task.location?.name || "Unknown area"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                          <Zap className="w-3 h-3" />
                          <span>{task.xpReward} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {task.createdAt?.toDate
                              ? Math.floor((Date.now() - task.createdAt.toDate().getTime()) / 60000)
                              : task.createdAt?.getTime
                              ? Math.floor((Date.now() - task.createdAt.getTime()) / 60000)
                              : 0}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
