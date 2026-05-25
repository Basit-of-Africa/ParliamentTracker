/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldAlert, BookOpen, Send, Sparkles, Landmark, Users, Stars, ArrowRight, HelpCircle } from "lucide-react";
import { Legislator, Chamber, BillCategory, Bill } from "../types";

interface CitizenProposalProps {
  legislators: Legislator[];
  onNavigateToBill: (billId: string) => void;
  onRefreshBills: () => Promise<void>;
}

export default function CitizenProposal({ legislators, onNavigateToBill, onRefreshBills }: CitizenProposalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BillCategory>(BillCategory.SECURITY);
  const [chamber, setChamber] = useState<Chamber>(Chamber.SENATE);
  const [sponsorId, setSponsorId] = useState("");
  const [summary, setSummary] = useState("");
  const [fullTitle, setFullTitle] = useState("");

  const [drafting, setDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<any | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  // Filter legislators matching the selected chamber limiters
  const matchingSponsors = legislators.filter((l) => l.chamber === chamber);

  const handleAISubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !sponsorId) {
      setDraftError("Please specify a draft Title, Summary, and select an active Chamber Sponsor.");
      return;
    }

    setDrafting(true);
    setDraftError(null);
    setDraftResult(null);

    try {
      // Step 1: Draft the bill details & analyses via Gemini
      console.log("Drafting bill analyses using Gemini...");
      const genRes = await fetch("/api/gemini/generate-bill-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, summary })
      });

      const genData = await genRes.json();
      if (!genData.success) {
        throw new Error(genData.error || "Failed generating AI drafts details.");
      }

      const refined = genData.data;

      // Step 2: Post the actual bill to our rest store on server
      console.log("Saving citizen bill to server store...");
      const publishRes = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billNumber: refined.billNumber || `HB ${Math.floor(100 + Math.random() * 900)}`,
          title: title,
          fullTitle: refined.refinedFullTitle || refined.fullTitle || fullTitle || title,
          sponsorId: sponsorId,
          chamberOfOrigin: chamber,
          category: category,
          summary: refined.refinedSummary || summary,
          tags: ["Citizen Proposal", ...(refined.tags || [])]
        })
      });

      const publishData = await publishRes.json();
      if (!publishData.success) {
        throw new Error(publishData.error || "Could not publish draft.");
      }

      // Step 3: Insert the generated AI analysis directly into the newly created bill structure via stage updates 
      // or we can allow the backend to hook it up. To do this beautifully in memory, we can update the bill,
      // as our server code does on save, linking results. Let's send a simulated stage update or we can directly refresh
      const createdBill: Bill = publishData.bill;
      createdBill.aiAnalysis = refined.aiAnalysis; // Inject AI analyses block generated from step 1
      createdBill.tags = ["Citizen Proposal", ...(refined.tags || [])];

      // Refresh parent dataset
      await onRefreshBills();
      
      setDraftResult(createdBill);
    } catch (e: any) {
      console.error(e);
      setDraftError(e.message || "An unexpected error occurred during AI analysis.");
    } finally {
      setDrafting(false);
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setSummary("");
    setFullTitle("");
    setSponsorId("");
    setDraftResult(null);
    setDraftError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans" id="proposal-dashboard">
      
      {/* 2-Columns Proposal Input Form Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-slate-205 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-650 rounded-lg">
              <BookOpen className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display text-slate-900">Propose Citizen Legislation</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Empowering people-led governance. Pitch a bill draft, align with an active Sponsor, and run AI Impact analysis.</p>
            </div>
          </div>
        </div>

        {/* Input Form itself (if not successfully drafted yet) */}
        {!draftResult ? (
          <form onSubmit={handleAISubmitProposal} className="bg-white rounded-2xl border border-slate-205 p-5 shadow-sm space-y-4" id="proposal-inputs-form">
            
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Draft Bill Title</label>
              <input
                type="text"
                required
                id="proposal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Healthcare Workers Hazard Allowance and Welfare Trust Act"
                className="w-full px-3 py-2.5 bg-slate-50 text-slate-900 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Split selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sector Category</label>
                <select
                  id="proposal-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BillCategory)}
                  className="w-full bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.values(BillCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chamber of Origin</label>
                <select
                  id="proposal-chamber"
                  value={chamber}
                  onChange={(e) => {
                    setChamber(e.target.value as Chamber);
                    setSponsorId(""); // reset selected sponsor when chamber switches
                  }}
                  className="w-full bg-slate-50 p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value={Chamber.SENATE}>Senate</option>
                  <option value={Chamber.HOUSE_OF_REPS}>House of Representatives</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">National Assembly Sponsor</label>
                <select
                  required
                  id="proposal-sponsor"
                  value={sponsorId}
                  onChange={(e) => setSponsorId(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 border border-slate-200 text-slate-805 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">-- Choose active member --</option>
                  {matchingSponsors.map(leg => (
                    <option key={leg.id} value={leg.id}>
                      {leg.title} {leg.name.split(" ").slice(-1)[0]} ({leg.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* General Description / Purpose Summary */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Proposer's Summary & Purpose</label>
              <textarea
                required
                rows={5}
                id="proposal-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="State your legislative ideas clearly. E.g. To mandate robust hazard allowances of ₦50,000 monthly for federal doctors, tax private health premiums 1.5% to finance safety insurance, and audit county clinical tools across geographic zones every six months..."
                className="w-full p-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submit banner buttons */}
            <div className="pt-2">
              {draftError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-xs mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                  <span>{draftError}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-draft-proposal"
                disabled={drafting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className={`w-4.5 h-4.5 text-yellow-300 ${drafting ? "animate-spin" : ""}`} />
                <span>{drafting ? "Gemini AI is Refining Draft & Compiling Projections..." : "Draft & Submit Citizen Bill"}</span>
              </button>
            </div>

          </form>
        ) : (
          /* Successful creation display screen */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-center animate-fade" id="proposal-success-panel">
            <Stars className="w-12 h-12 text-yellow-500 mx-auto animate-bounce" />
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-display">Legislation Successfully Drafted & Registered!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 font-medium">
                Your proposal has been refined into a formal legislative bill on the server side and mapped directly to your Sponsor's tracking log!
              </p>
            </div>

            {/* Bill Details summary info block */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 max-w-xl mx-auto text-xs font-semibold">
              <div className="flex items-center justify-between font-bold">
                <span className="font-mono text-emerald-600 px-2 py-0.5 bg-emerald-5 border border-emerald-150 rounded">
                  {draftResult.billNumber}
                </span>
                <span className="text-slate-500">{draftResult.category}</span>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-1">{draftResult.title}</h4>
              <p className="text-[11px] text-slate-550 font-medium leading-relaxed line-clamp-3">{draftResult.summary}</p>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto font-bold">
              <button
                onClick={() => onNavigateToBill(draftResult.id)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
              >
                <span>Track Dynamic Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl cursor-pointer transition"
              >
                Draft Another Idea
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 1-Column Right Side guidance and education panel */}
      <div className="lg:col-span-1" id="proposal-guidelines-sidebar">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 sticky top-5 shadow-sm">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 font-mono">
              <Landmark className="w-4 h-4 text-emerald-600" />
              <span>Nigerian Legislative Help</span>
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal font-medium">
              How does a proposed citizen idea flow through the Tenth National Assembly?
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-[10px]">1</span>
                <span>Draft Submission & Sponsor Matching</span>
              </h4>
              <p className="text-[11px] text-slate-550 pl-6 text-justify font-medium">
                A draft outlines legal principles. It is matched to an active Senator/Honourable.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-[10px]">2</span>
                <span>First and Second Readings</span>
              </h4>
              <p className="text-[11px] text-slate-550 pl-6 text-justify font-medium">
                Chamber clerks publish the bill text in general gazettes and legislative leaders debate general principles.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-[10px]">3</span>
                <span>Committee Stage</span>
              </h4>
              <p className="text-[11px] text-slate-550 pl-6 text-justify font-medium">
                Referred to dynamic specialized committees (like ICT, Finance, Health) for public consultation, hearing citizen audits, and refining sections clause-by-clause.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-mono font-bold text-[10px]">4</span>
                <span>Third Reading & Presidential Assent</span>
              </h4>
              <p className="text-[11px] text-slate-550 pl-6 text-justify font-medium">
                The full house votes. If passed, it is transmitted in concurrence to the sister chamber, and then to the President's desk for signature into law.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-normal text-justify flex gap-2 font-medium">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note on AI:</strong> ParliamentTracker uses server-side Gemini intelligence models to structure and audit citizen pitches, providing public impact ratings and draft compliance tags automatically. Perfecting transparent democracy.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
