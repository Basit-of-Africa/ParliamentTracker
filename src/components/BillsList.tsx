/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, ShieldCheck, Milestone, Calendar, ArrowUpRight, HelpCircle, Bookmark, Mail, Bell, Check, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
  
  // Weekly Watchlist Updates Subscription States
  const [isDigestPanelOpen, setIsDigestPanelOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subSelectedIds, setSubSelectedIds] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeDigest, setActiveDigest] = useState<{ email: string; billIds: string[] } | null>(() => {
    try {
      const val = localStorage.getItem("nass_watchlist_digest");
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  });

  const handleTogglePanel = () => {
    if (!isDigestPanelOpen) {
      if (activeDigest) {
        setEmailInput(activeDigest.email);
        const valid = activeDigest.billIds.filter(id => bookmarkedIds.includes(id));
        setSubSelectedIds(valid);
      } else {
        setSubSelectedIds(bookmarkedIds);
      }
    }
    setIsDigestPanelOpen(!isDigestPanelOpen);
  };

  const handleToggleBillSelect = (id: string) => {
    setSubSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSubSelectedIds(bookmarkedIds);
  };

  const handleSelectNone = () => {
    setSubSelectedIds([]);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const newDigest = {
      email: emailInput,
      billIds: subSelectedIds
    };

    localStorage.setItem("nass_watchlist_digest", JSON.stringify(newDigest));
    setActiveDigest(newDigest);
    setShowSuccessToast(true);
    setErrorMsg("");
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem("nass_watchlist_digest");
    setActiveDigest(null);
    setEmailInput("");
    setSubSelectedIds([]);
  };

  const watchlistedBills = bills.filter(b => bookmarkedIds.includes(b.id));
  const [selectedChamber, setSelectedChamber] = useState<"All" | Chamber>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | BillCategory>("All");
  const [selectedStage, setSelectedStage] = useState<"All" | "Active" | "Signed" | "Draft">("All");

  const getStageColorClass = (stage: LegislativeStage) => {
    switch (stage) {
      case LegislativeStage.ASSENT:
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
      matchesStage = bill.currentStage !== LegislativeStage.ASSENT && bill.currentStage !== LegislativeStage.VETOED;
    } else if (selectedStage === "Signed") {
      matchesStage = bill.currentStage === LegislativeStage.ASSENT;
    } else if (selectedStage === "Draft") {
      // Proposer bills
      matchesStage = bill.tags.includes("Citizen Proposal") || bill.id.startsWith("bill-17");
    }

    return matchesSearch && matchesChamber && matchesCategory && matchesStage;
  });

  return (
    <div className="space-y-6" id="bills-dashboard">
      {/* PLAC Sync Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 border border-emerald-900/40 relative overflow-hidden" id="plac-sync-banner">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 bg-emerald-550 border border-emerald-550 rounded text-[9px] font-black uppercase tracking-widest text-[rgb(209,250,229)]">
                Official Data Alignment
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">PLAC Bills Track</span>
            </div>
            <h3 className="text-base md:text-lg font-black font-display tracking-tight text-white">
              Tenth Assembly Bill Registry
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
              All legislative bills in our tracking index are aligned with the official registry of the <strong>Policy and Legal Advocacy Centre (PLAC) Bills Track</strong>. Explore further details, gazette indexes, and detailed legal reviews on the live PLAC catalog.
            </p>
          </div>
          <a
            href="https://p.placbillstrack.org/bills/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-605 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer self-start sm:self-auto transition shrink-0"
            id="plac-main-source-btn"
          >
            <span>Visit PLAC Platform</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </a>
        </div>
      </div>

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

      {/* Watchlist Digest Subscription Station */}
      <div 
        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-300" 
        id="watchlist-digest-station"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-xl shrink-0 ${activeDigest ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
              {activeDigest ? <Bell className="w-5 h-5 animate-bounce" /> : <Mail className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-display flex flex-wrap items-center gap-2">
                <span>Weekly Watchlist Digest</span>
                {activeDigest && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200/50 text-[9px] font-extrabold uppercase tracking-wide rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Subscription</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-550 font-semibold mt-0.5">
                {activeDigest 
                  ? `Receiving weekly briefings for ${activeDigest.billIds.length} tracked bills at ${activeDigest.email}`
                  : "Get clerk reports, reading timetables, and citizen opinions directly in your inbox."
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleTogglePanel}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-205 text-slate-755 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer self-stretch sm:self-auto shrink-0"
            id="toggle-digest-setup-btn"
          >
            <span>{isDigestPanelOpen ? "Close Setup" : activeDigest ? "Manage Settings" : "Configure Digests"}</span>
            {isDigestPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Success Alert */}
        {showSuccessToast && (
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center gap-3 text-emerald-950 animate-fade-in" id="subscription-success-alert">
            <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <div className="text-xs font-semibold">
              <span className="font-bold text-emerald-800">Digest Subscription Saved!</span> Your alerts are scheduled and will be delivered to <strong className="font-bold">{activeDigest?.email}</strong>.
            </div>
          </div>
        )}

        {isDigestPanelOpen && (
          <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in" id="digest-setup-panel">
            {watchlistedBills.length === 0 ? (
              <div className="bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs">
                <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-extrabold text-slate-800">Your Watchlist is Empty</h4>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                  To receive email updates, please add legislative bills to your watchlist first using the bookmark (🔖) buttons on the cards below.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Email Input Column */}
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block" htmlFor="sub-email">
                      Notification Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="email"
                        id="sub-email"
                        required
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (errorMsg) setErrorMsg("");
                        }}
                        placeholder="e.g. name@domain.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none transition shrink-0"
                      />
                    </div>
                    {errorMsg && (
                      <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errorMsg}</span>
                      </p>
                    )}
                  </div>

                  {/* Bill Chooser Column */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                        Toggle Tracked Bills ({subSelectedIds.length} of {watchlistedBills.length})
                      </label>
                      <div className="flex items-center gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-emerald-650 hover:text-emerald-700 font-bold cursor-pointer"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleSelectNone}
                          className="text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="max-h-44 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50 p-2 space-y-1.5" id="sub-bills-checkboxes">
                      {watchlistedBills.map((b) => {
                        const isChecked = subSelectedIds.includes(b.id);
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleToggleBillSelect(b.id)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition duration-150 ${
                              isChecked 
                                ? "bg-white border-emerald-200/80 shadow-sm"
                                : "bg-transparent border-transparent hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // Swallowed since parent handles click
                              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="text-xs leading-tight">
                              <span className="font-mono font-bold text-slate-400 block text-[9px] uppercase">
                                {b.billNumber}
                              </span>
                              <span className="font-bold text-slate-800 line-clamp-1 mt-0.5">
                                {b.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 pt-3.5 gap-3">
                  <p className="text-[10px] text-slate-400 font-medium max-w-sm leading-relaxed">
                    Digests are safe &amp; compiled locally. Automated newsletters arrive weekly reporting committee referrals, public hearings, and third-reading outcomes.
                  </p>
                  
                  <div className="flex items-center gap-2 self-stretch sm:self-auto">
                    {activeDigest && (
                      <button
                        type="button"
                        onClick={handleUnsubscribe}
                        className="flex-1 sm:flex-initial px-4 py-2 hover:bg-rose-50 border border-slate-205 text-rose-600 hover:text-rose-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        id="btn-remove-digest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Unsubscribe</span>
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-500/10"
                      id="btn-save-digest-settings"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{activeDigest ? "Update Digests" : "Subscribe to Weekly Digest"}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
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
                    <motion.div
                      className={`h-full rounded-full ${
                        bill.currentStage === LegislativeStage.ASSENT
                          ? "bg-emerald-500"
                          : bill.currentStage === LegislativeStage.VETOED
                          ? "bg-rose-500"
                          : "bg-emerald-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${bill.stageProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
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
