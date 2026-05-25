/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Filter, ShieldCheck, Milestone, Calendar, ArrowUpRight, HelpCircle, Bookmark } from "lucide-react";
import { Bill, Chamber, BillCategory, LegislativeStage } from "../types";

interface BillsListProps {
  bills: Bill[];
  onSelectBill: (billId: string) => void;
  onNavigateToPropose: () => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (billId: string) => void;
  emptyStateText?: string;
}

export default function BillsList({
  bills,
  onSelectBill,
  onNavigateToPropose,
  bookmarkedIds = [],
  onToggleBookmark,
  emptyStateText,
}: BillsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChamber, setSelectedChamber] = useState<"All" | Chamber>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | BillCategory>("All");
  const [selectedStage, setSelectedStage] = useState<"All" | "Active" | "Signed" | "Draft">("All");

  const getStageColorClass = (stage: LegislativeStage) => {
    switch (stage) {
      case LegislativeStage.ASSENTED:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case LegislativeStage.VETOED:
        return "bg-rose-100 text-rose-800 border-rose-200";
      case LegislativeStage.FIRST_READING:
      case LegislativeStage.SECOND_READING:
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getChamberStyleClass = (chamber: Chamber) => {
    return chamber === Chamber.SENATE
      ? "text-rose-500 bg-rose-50 border-rose-100"
      : "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.sponsorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChamber = selectedChamber === "All" || bill.chamberOfOrigin === selectedChamber;

    const matchesCategory = selectedCategory === "All" || bill.category === selectedCategory;

    let matchesStage = true;
    if (selectedStage === "Active") {
      matchesStage = bill.currentStage !== LegislativeStage.ASSENTED && bill.currentStage !== LegislativeStage.VETOED;
    } else if (selectedStage === "Signed") {
      matchesStage = bill.currentStage === LegislativeStage.ASSENTED;
    } else if (selectedStage === "Draft") {
      // Proposer bills
      matchesStage = bill.tags.includes("Citizen Proposal") || bill.id.startsWith("bill-17");
    }

    return matchesSearch && matchesChamber && matchesCategory && matchesStage;
  });

  return (
    <div className="space-y-6" id="bills-dashboard">
      {/* Search and Filters Hub */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              id="search-bills"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bill Title, Number (e.g. SB 421), Sponsor, or keywords..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-900 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>
          
          <button 
            onClick={onNavigateToPropose}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            id="btn-trigger-propose"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Propose Citizen Bill</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter By:</span>
          </div>

          {/* Chamber Filter */}
          <select
            id="filter-chamber"
            value={selectedChamber}
            onChange={(e) => setSelectedChamber(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Chambers</option>
            <option value={Chamber.SENATE}>Senate</option>
            <option value={Chamber.HOUSE_OF_REPS}>House of Representatives</option>
          </select>

          {/* Category Filter */}
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {Object.values(BillCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="filter-stage"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Under Debate (Active)</option>
            <option value="Signed">Passed Into Law (Signed)</option>
            <option value="Draft">Citizen Drafts</option>
          </select>

          {sortedResultsCount(filteredBills.length)}
        </div>
      </div>

      {/* Grid of Bills */}
      {filteredBills.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center" id="empty-search-results">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 font-display">No Bills Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            {emptyStateText || "Try adjusting your words or selections, or click below to draft a brand new legislative concept!"}
          </p>
          <button
            onClick={onNavigateToPropose}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition"
          >
            Propose Custom Citizen Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="bills-grid-container">
          {filteredBills.map((bill) => {
            const isCitizen = bill.tags.includes("Citizen Proposal") || bill.id.startsWith("bill-17");
            const isBookmarked = bookmarkedIds.includes(bill.id);
            return (
              <div
                key={bill.id}
                id={`bill-card-${bill.id}`}
                onClick={() => onSelectBill(bill.id)}
                className="group relative cursor-pointer bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top line badging */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded">
                        {bill.billNumber}
                      </span>
                      {isCitizen && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-650 border border-amber-500/20">
                          Citizen Draft
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 border rounded-full ${getStageColorClass(bill.currentStage)}`}>
                        {bill.currentStage}
                      </span>
                      {onToggleBookmark && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(bill.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-all duration-150 ${
                            isBookmarked
                              ? "bg-amber-500/10 border-amber-300 text-amber-650 hover:bg-amber-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                          title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & summary */}
                  <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-emerald-600 transition line-clamp-2 leading-tight">
                    {bill.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {bill.summary}
                  </p>

                  {/* Sponsor attribution */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">Sponsor:</span>
                    <span className="font-semibold text-slate-700">
                      {bill.sponsorName}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[10px] rounded border ${getChamberStyleClass(bill.sponsorChamber)}`}>
                      {bill.sponsorChamber === Chamber.SENATE ? "Senate" : "House"}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual for legislative stages */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Milestone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Legislative Stage Progress</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600">
                      {bill.stageProgress}%
                    </span>
                  </div>

                  {/* Track Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden" id={`progress-bar-${bill.id}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        bill.currentStage === LegislativeStage.ASSENTED
                          ? "bg-emerald-500"
                          : bill.currentStage === LegislativeStage.VETOED
                          ? "bg-rose-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${bill.stageProgress}%` }}
                    />
                  </div>

                  {/* Bottom Footer block */}
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Proposed: {bill.dateProposed}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold group-hover:underline flex items-center gap-0.5">
                      Track Progress
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  function sortedResultsCount(count: number) {
    return (
      <span className="ml-auto text-xs text-slate-405 font-medium">
        Showing <strong className="text-slate-700 font-bold">{count}</strong> bills
      </span>
    );
  }
}
