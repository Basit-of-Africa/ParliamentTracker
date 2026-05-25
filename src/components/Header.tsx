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
    { id: "bills", label: "Bills & Legislation" },
    { id: "watchlist", label: "My Watchlist" },
    { id: "mps", label: "Honourables & Senators" },
    { id: "ai-copilot", label: "NASS Advisor AI" },
    { id: "propose", label: "Propose Citizen Bill" },
  ];

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 font-sans" id="app-header">
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
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full tracking-wider uppercase font-bold">
                  10th National Assembly
                </span>
              </div>
              <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 mt-1">
                Parliament<span className="text-emerald-600">Tracker</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200" id="main-navigation">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
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

        {/* Statistics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-200">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition" id="stat-bills">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Monitored Bills</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {stats.totalBills} <span className="text-xs text-slate-500 font-sans font-normal">Registered</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition" id="stat-passed">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Percent className="w-4 h-4 text-emerald-650 animate-pulse" />
              <span>Assented Bills</span>
            </div>
            <div className="text-xl font-bold text-emerald-600 font-display">
              {stats.totalPassed} <span className="text-xs text-slate-500 font-sans font-normal font-medium">Passed</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition" id="stat-mps">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Legislators</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {stats.totalMPs} <span className="text-xs text-slate-500 font-sans font-normal">Active</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition" id="stat-attendance">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Percent className="w-4 h-4 text-amber-500" />
              <span>Avg. Attendance</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {stats.avgAttendance}% <span className="text-xs text-slate-500 font-sans font-normal font-normal">Clerk Records</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition col-span-2 md:col-span-1" id="stat-votes">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Vote className="w-4 h-4 text-rose-500" />
              <span>Citizen Sentiment</span>
            </div>
            <div className="text-xl font-bold text-slate-900 font-display">
              {stats.totalVotes.toLocaleString()} <span className="text-xs text-slate-500 font-sans font-normal">Votes Cast</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
