/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Filter, Mail, Users, Percent, Award, Landmark, BookOpen, AlertCircle } from "lucide-react";
import { Legislator, Chamber, PoliticalParty, Bill } from "../types";

interface LegislatorDirectoryProps {
  legislators: Legislator[];
  bills: Bill[];
  onSelectBill: (billId: string) => void;
  onRefreshLegislators: (updated: Legislator[]) => void;
}

export default function LegislatorDirectory({ legislators, bills, onSelectBill, onRefreshLegislators }: LegislatorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChamber, setSelectedChamber] = useState<"All" | Chamber>("All");
  const [selectedParty, setSelectedParty] = useState<"All" | PoliticalParty>("All");
  const [inspectedLegislatorId, setInspectedLegislatorId] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncAssembly = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage(null);
      const res = await fetch("/api/legislators/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        onRefreshLegislators(data.legislators);
        setSyncMessage(`Import Success: Dynamic sync acquired ${data.addedCount} additional representatives from live NASS journals!`);
        setTimeout(() => setSyncMessage(null), 6000);
      } else {
        throw new Error(data.error || "Failed to synchronize roster.");
      }
    } catch (err: any) {
      console.error(err);
      setSyncMessage(`Sync Alert: ${err.message || "Failed to establish sync pipeline."}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filters
  const filteredLegislators = legislators.filter((leg) => {
    const matchesSearch =
      leg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.constituency.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChamber = selectedChamber === "All" || leg.chamber === selectedChamber;

    const matchesParty = selectedParty === "All" || leg.party === selectedParty;

    return matchesSearch && matchesChamber && matchesParty;
  });

  const getPartyColorStyles = (party: PoliticalParty) => {
    switch (party) {
      case PoliticalParty.APC:
        return {
          bar: "bg-blue-600",
          text: "text-blue-605 bg-blue-50 border-blue-100",
          gradient: "from-blue-600/10 to-transparent"
        };
      case PoliticalParty.PDP:
        return {
          bar: "bg-red-650",
          text: "text-red-650 bg-red-50 border-red-100",
          gradient: "from-red-650/10 to-transparent"
        };
      case PoliticalParty.LP:
        return {
          bar: "bg-emerald-600",
          text: "text-emerald-705 bg-emerald-50 border-emerald-100",
          gradient: "from-emerald-600/10 to-transparent"
        };
      case PoliticalParty.APGA:
        return {
          bar: "bg-amber-500",
          text: "text-amber-705 bg-amber-50 border-amber-100",
          gradient: "from-amber-500/10 to-transparent"
        };
      default:
        return {
          bar: "bg-slate-550",
          text: "text-slate-600 bg-slate-50 border-slate-200",
          gradient: "from-slate-550/10 to-transparent"
        };
    }
  };

  const getEngagementRating = (score: number) => {
    if (score >= 90) return { label: "Excellent Leader", color: "text-emerald-700 bg-emerald-50" };
    if (score >= 80) return { label: "Highly Engaged", color: "text-sky-700 bg-sky-50" };
    return { label: "Representative Participant", color: "text-amber-700 bg-amber-50" };
  };

  const activeInspectedLeg = legislators.find(l => l.id === inspectedLegislatorId);
  const activeInspectedBills = bills.filter(b => activeInspectedLeg?.billsSponsored.includes(b.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="mps-directory-dashboard">
      
      {/* 2-Column Left roster listing */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Sync Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Synchronized 10th Assembly Database</h4>
              <p className="text-[11px] text-slate-500 font-medium">Currently Tracking <strong className="text-slate-750 font-bold">{legislators.length}</strong> active members covering all 36 States + FCT.</p>
            </div>
          </div>
          
          <button
            onClick={handleSyncAssembly}
            disabled={isSyncing}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-250 disabled:text-slate-400 text-white font-extrabold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition text-xs shrink-0 shadow-sm"
          >
            {isSyncing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                <span>Syncing live NASS records...</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                <span>Sync Additional Members</span>
              </>
            )}
          </button>
        </div>

        {syncMessage && (
          <div className="p-3 bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl animate-fade flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-emerald-600 animate-bounce shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
        
        {/* Search and filter tools */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              id="search-legislators"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Legislator Name, State (e.g. Lagos), Constituency..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 text-slate-400 mr-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Roster Filter:</span>
            </div>

            {/* Chamber */}
            <select
              id="leg-chamber-filter"
              value={selectedChamber}
              onChange={(e) => setSelectedChamber(e.target.value as any)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium"
            >
              <option value="All">All Chambers</option>
              <option value={Chamber.SENATE}>Senate</option>
              <option value={Chamber.HOUSE_OF_REPS}>House of Representatives</option>
            </select>

            {/* Party */}
            <select
              id="leg-party-filter"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value as any)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium"
            >
              <option value="All">All Parties</option>
              {Object.values(PoliticalParty).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <span className="ml-auto text-[10px] text-slate-400">
              Found <strong className="text-slate-600 font-medium">{filteredLegislators.length}</strong> representatives
            </span>
          </div>
        </div>

        {/* Legislators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="legislators-cards-grid">
          {filteredLegislators.map((leg) => {
            const styles = getPartyColorStyles(leg.party);
            const isInspected = inspectedLegislatorId === leg.id;
            return (
              <div
                key={leg.id}
                id={`leg-card-${leg.id}`}
                onClick={() => setInspectedLegislatorId(leg.id)}
                className={`cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:shadow-sm flex flex-col justify-between ${
                  isInspected 
                    ? "border-emerald-500 ring-1 ring-emerald-500/30" 
                    : "border-slate-200"
                }`}
              >
                <div>
                  {/* Portrait placeholders and party colors badges */}
                  <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-display font-semibold text-slate-800 border select-none uppercase">
                        {leg.name.split(" ").pop()?.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-[10px] opacity-60 text-slate-500">{leg.chamber === Chamber.SENATE ? "Senator" : "Representative"}</div>
                        <h4 className="text-xs font-bold font-display text-slate-900 leading-tight">
                          {leg.name}
                        </h4>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${styles.text}`}>
                      {leg.party}
                    </span>
                  </div>

                  {/* Electoral details */}
                  <div className="space-y-1.5 text-xs text-slate-500 leading-snug">
                    <div>
                      <span className="font-medium text-slate-400">State:</span>{" "}
                      <span className="text-slate-705 font-semibold">{leg.state}</span>
                    </div>
                    <div className="line-clamp-1">
                      <span className="font-medium text-slate-400">District:</span>{" "}
                      <span className="text-slate-705 font-semibold">{leg.constituency}</span>
                    </div>
                  </div>
                </div>

                {/* Micro metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Percent className="w-3.5 h-3.5 text-slate-400" />
                    <span>Attendance Rate</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {leg.attendanceRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1-Column Right Side Details Inspection Panel */}
      <div className="lg:col-span-1" id="mp-inspection-panel">
        {activeInspectedLeg ? (
          <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 sticky top-5" id="legislator-card-inspect-target">
            
            {/* Header info card */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-800 font-display font-extrabold rounded-full flex items-center justify-center text-xl mx-auto shadow-sm uppercase">
                {activeInspectedLeg.name.split(" ").pop()?.substring(0, 2)}
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${getPartyColorStyles(activeInspectedLeg.party).text}`}>
                  {activeInspectedLeg.party} Party
                </span>
                <h3 className="text-base font-extrabold font-display mt-2 text-slate-900">{activeInspectedLeg.title} {activeInspectedLeg.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{activeInspectedLeg.constituency}, {activeInspectedLeg.state} State</p>
              </div>
            </div>

            {/* Performance Indicators Grid */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Engagement Audit Log</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium text-slate-500">NASS Index Score</span>
                  </div>
                  <div className="text-base font-extrabold text-emerald-605 font-mono">{activeInspectedLeg.engagementScore}%</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                    <Percent className="w-3.5 h-3.5 text-sky-650" />
                    <span className="font-medium text-slate-500">Attendance Rate</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-800 font-mono">{activeInspectedLeg.attendanceRate}%</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-medium text-slate-500">Bills Sponsored</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-800 font-mono">{activeInspectedLeg.billsSponsored.length}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-medium text-slate-500">Plenary Motions</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-800 font-mono">{activeInspectedLeg.motionsPresentedCount}</div>
                </div>
              </div>

              {/* Engagement badge categorization */}
              <div className={`p-3 rounded-xl border border-dashed flex items-center gap-2 text-xs leading-snug ${getEngagementRating(activeInspectedLeg.engagementScore).color} border-slate-200`}>
                <Award className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold">Score Audit Rating:</span>{" "}
                  <span>{getEngagementRating(activeInspectedLeg.engagementScore).label}</span>
                </div>
              </div>
            </div>

            {/* Sponsored legislative list with clickable navigations */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center justify-between">
                <span>Sponsored Bills</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">{activeInspectedBills.length}</span>
              </h4>

              {activeInspectedBills.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  No registered Bills sponsored by this member in our database.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1" id="mp-sponsored-bills-scroller animate-fade">
                  {activeInspectedBills.map(b => (
                    <div
                      key={b.id}
                      onClick={() => onSelectBill(b.id)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl cursor-pointer transition text-xs flex justify-between items-center gap-2 group"
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="font-mono text-[9px] font-bold text-slate-500 bg-white px-1 py-0.2 border rounded w-max inline">
                          {b.billNumber}
                        </div>
                        <h5 className="font-semibold text-slate-800 mt-1 line-clamp-1 group-hover:text-emerald-600 group-hover:underline transition leading-tight">
                          {b.title}
                        </h5>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-550 shrink-0 bg-white px-1.5 py-0.5 border border-slate-200 rounded-full">
                        {b.currentStage}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contacts */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constituent Contact Channels</h4>
              <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-mono tracking-wide">{activeInspectedLeg.districtOfficeEmail || "contact@nass.gov.ng"}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-200/85 p-6 text-center text-slate-400" id="legislator-inspect-fallback">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="font-bold font-display text-xs text-slate-700">Select a Representative Card</span>
            <p className="text-[11px] text-slate-500 mt-1">
              Click any Senator or Honourable on the left grid to execute a deeper performance audit and sponsored bills index scan.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
