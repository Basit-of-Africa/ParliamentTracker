/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import Header from "./components/Header";
import BillsList from "./components/BillsList";
import BillDetail from "./components/BillDetail";
import LegislatorDirectory from "./components/LegislatorDirectory";
import AICopilot from "./components/AICopilot";
import CitizenProposal from "./components/CitizenProposal";

import { Bill, Legislator, Chamber, LegislativeStage, UserReview } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("bills");
  const [bills, setBills] = useState<Bill[]>([]);
  const [legislators, setLegislators] = useState<Legislator[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Statistics ribbon values
  const [stats, setStats] = useState({
    totalBills: 0,
    totalPassed: 0,
    totalMPs: 0,
    totalVotes: 0,
    avgAttendance: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch legislators which handles scraping optionally
      const legRes = await fetch("/api/scrape/members");
      const legData = await legRes.json();
      let legislatorsList: Legislator[] = [];
      if (legData.success) {
        setLegislators(legData.legislators);
        legislatorsList = legData.legislators;
      } else {
        throw new Error("Could not load legislators.");
      }

      // Fetch Bills
      const billRes = await fetch("/api/bills");
      const billData = await billRes.json();
      let billsList: Bill[] = [];
      if (billData.success) {
        setBills(billData.bills);
        billsList = billData.bills;
      } else {
        throw new Error("Could not load bills.");
      }

      calculateStats(billsList, legislatorsList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish synchronization with Tenth Assembly API server.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (billsList: Bill[], legislatorsList: Legislator[]) => {
    const totalBills = billsList.length;
    const totalPassed = billsList.filter(b => b.currentStage === LegislativeStage.ASSENTED).length;
    const totalMPs = legislatorsList.length;
    const totalVotes = billsList.reduce((sum, b) => sum + (b.votesFor || 0) + (b.votesAgainst || 0), 0);
    const avgAttendance = legislatorsList.length > 0 
      ? Math.round(legislatorsList.reduce((sum, l) => sum + l.attendanceRate, 0) / legislatorsList.length)
      : 92;

    setStats({
      totalBills,
      totalPassed,
      totalMPs,
      totalVotes,
      avgAttendance
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Post citizen comment review to backend rest
  const handlePostReview = async (billId: string, userName: string, rating: number, comment: string): Promise<UserReview> => {
    const res = await fetch(`/api/bills/${billId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, rating, comment })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to publish review comment.");
    }
    
    // Refresh bills in state to reflect incremented stats if needed
    return data.review;
  };

  // Cast vote on bill
  const handleVoteBill = async (billId: string, type: "for" | "against"): Promise<{ votesFor: number, votesAgainst: number }> => {
    const res = await fetch(`/api/bills/${billId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote: type })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to cast vote.");
    }

    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            votesFor: data.votesFor,
            votesAgainst: data.votesAgainst
          };
        }
        return b;
      })
    );

    // Recompute global stats
    setStats(prev => ({
      ...prev,
      totalVotes: prev.totalVotes + 1
    }));

    return { votesFor: data.votesFor, votesAgainst: data.votesAgainst };
  };

  // Update Bill Stage (Stepper progression simulation)
  const handleUpdateStage = async (billId: string, stage: LegislativeStage, note: string): Promise<Bill> => {
    const res = await fetch(`/api/bills/${billId}/stage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage, note })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to update bill stage.");
    }

    const updatedBill: Bill = data.bill;
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? updatedBill : b))
    );

    // Recompute passed bills stats count
    setBills(currentBillsList => {
      calculateStats(currentBillsList, legislators);
      return currentBillsList;
    });

    return updatedBill;
  };

  const handleSelectBillAndRedirect = (billId: string) => {
    setSelectedBillId(billId);
    setActiveTab("bills"); // force bills view tab
  };

  const handleSelectLegislatorAndRedirect = (legId: string) => {
    setSelectedBillId(""); // close bill inspections
    setActiveTab("mps"); // force legislators view tab
  };

  const refreshBillsFromServer = async () => {
    const billRes = await fetch("/api/bills");
    const billData = await billRes.json();
    if (billData.success) {
      setBills(billData.bills);
      calculateStats(billData.bills, legislators);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-500">
      
      {/* Platform Header */}
      <Header activeTab={activeTab} setActiveTab={(tab) => {
        setSelectedBillId(""); // clear bill inspect scope on separate tabs switching
        setActiveTab(tab);
      }} stats={stats} />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4" id="starting-loader-screen">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
            <span className="text-xs text-slate-500 animate-pulse font-medium">
              Synchronizing with Nigerian National Assembly legislative nodes...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 rounded-2xl p-5 mb-8 flex flex-col items-start gap-3" id="error-sync-banner">
            <h4 className="font-bold flex items-center gap-1.5 font-display text-sm">
              🚨 Assembly Synchronization Failure
            </h4>
            <p className="text-xs leading-relaxed text-red-700">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-lg text-xs font-semibold transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && (
          <div id="application-content-workspace">
            <AnimatePresence mode="wait">
              {selectedBillId ? (
                <motion.div
                  key={`bill-details-${selectedBillId}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <BillDetail
                    billId={selectedBillId}
                    bills={bills}
                    legislators={legislators}
                    onBack={() => setSelectedBillId("")}
                    onPostReview={handlePostReview}
                    onVoteBill={handleVoteBill}
                    onUpdateStage={handleUpdateStage}
                    onSelectLegislator={handleSelectLegislatorAndRedirect}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "bills" && (
                    <BillsList
                      bills={bills}
                      onSelectBill={handleSelectBillAndRedirect}
                      onNavigateToPropose={() => setActiveTab("propose")}
                    />
                  )}

                  {activeTab === "mps" && (
                    <LegislatorDirectory
                      legislators={legislators}
                      bills={bills}
                      onSelectBill={handleSelectBillAndRedirect}
                    />
                  )}

                  {activeTab === "ai-copilot" && (
                    <AICopilot
                      bills={bills}
                      selectedBillId={selectedBillId}
                      onSetSelectedBillId={setSelectedBillId}
                    />
                  )}

                  {activeTab === "propose" && (
                    <CitizenProposal
                      legislators={legislators}
                      onNavigateToBill={handleSelectBillAndRedirect}
                      onRefreshBills={refreshBillsFromServer}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Humble, clean, professional page footer */}
      <footer className="bg-white border-t border-slate-250/50 py-6 mt-12 text-center" id="platform-clerk-footer">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-450 space-y-2">
          <p className="font-semibold">
            ParliamentTracker — Bridging the gap between the Nigerian National Assembly and the citizenry.
          </p>
          <p className="text-[11px] text-slate-400">
            Providing citizen tracking and engagement index scores for the 10th National Assembly.
          </p>
        </div>
      </footer>

    </div>
  );
}
