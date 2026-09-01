/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Landmark, FileText, Users, Vote, Percent } from "lucide-react";
import { Chamber } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: {
    totalBills: number;
    totalPassed: number;
    totalMPs: number;
    totalVotes: number;
    avgAttendance: number;
  };
}

export default function Header({ activeTab, setActiveTab, stats }: HeaderProps) {
  const tabs = [
    { id: "home", label: "Overview" },
    { id: "bills", label: "Bills" },
    { id: "watchlist", label: "My Watchlist" },
    { id: "mps", label: "Members" },
    { id: "ai-copilot", label: "NASS Advisor AI" },
    { id: "propose", label: "Propose Citizen Bill" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200/80 font-sans shadow-sm" id="app-header">
      {/* Top bar with Nigerian legislative colors */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-neutral-100 to-emerald-600 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 select-none transition"
          >
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/80">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 mt-1">
                Parliament<span className="text-emerald-600">Tracker</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="flex overflow-x-auto flex-nowrap md:flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 scrollbar-none max-w-full snap-x" id="main-navigation">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 snap-start transition-all whitespace-nowrap ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
