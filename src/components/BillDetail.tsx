/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Landmark, Milestone, Sparkles, CheckCircle2, AlertCircle, Share2, ThumbsUp, ThumbsDown, Vote, MessageSquare, Send, Stars, Play, RefreshCw, Bookmark, ArrowUpRight, Printer, Mail, Check, Clock, ChevronRight } from "lucide-react";
import { Bill, Chamber, LegislativeStage, UserReview, Legislator } from "../types";

interface BillDetailProps {
  billId: string;
  bills: Bill[];
  legislators: Legislator[];
  onBack: () => void;
  onPostReview: (billId: string, userName: string, rating: number, comment: string) => Promise<UserReview>;
  onVoteBill: (billId: string, type: "for" | "against") => Promise<{ votesFor: number, votesAgainst: number }>;
  onUpdateStage: (billId: string, stage: LegislativeStage, note: string) => Promise<Bill>;
  onSelectLegislator: (legId: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (billId: string) => void;
}

export default function BillDetail({
  billId,
  bills,
  legislators,
  onBack,
  onPostReview,
  onVoteBill,
  onUpdateStage,
  onSelectLegislator,
  isBookmarked = false,
  onToggleBookmark,
}: BillDetailProps) {
  const bill = bills.find((b) => b.id === billId);
  const sponsor = legislators.find((l) => l.id === bill?.sponsorId);

  const [activeSubTab, setActiveSubTab] = useState<"progress" | "ai-brief" | "citizen-opinion">("progress");
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Form states for adding citizen reviews
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Poll state locally
  const [hasVoted, setHasVoted] = useState(false);
  const [voteSubmitting, setVoteSubmitting] = useState(false);

  // Stage simulator states
  const [simulatedStage, setSimulatedStage] = useState<LegislativeStage>(LegislativeStage.FIRST_READING);
  const [simulatedNote, setSimulatedNote] = useState("");
  const [simulating, setSimulating] = useState(false);

  const stagesList = Object.values(LegislativeStage);

  useEffect(() => {
    if (!bill) return;
    setSimulatedStage(bill.currentStage);
    
    // Fetch comments for this bill
    setReviewsLoading(true);
    fetch(`/api/bills/${bill.id}/reviews`)
      .then((res) => {
        if (!res.ok || !res.headers.get("Content-Type")?.includes("application/json")) {
          throw new Error("Invalid format/status");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => {
        console.warn("Reviews load fallback active:", err);
        try {
          const key = `nass_reviews_${bill.id}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            setReviews(JSON.parse(stored));
          } else {
            // Dynamically query initial database fallback reviews if available
            import("../initialData").then(({ INITIAL_REVIEWS }) => {
              const matched = INITIAL_REVIEWS.filter(r => r.billId === bill.id);
              setReviews(matched);
            });
          }
        } catch (e) {
          console.error(e);
        }
      })
      .finally(() => setReviewsLoading(false));
  }, [billId, bill]);

  if (!bill) {
    return (
      <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200">
        Bill not found. Click back to select a valid proposal.
        <button onClick={onBack} className="block mt-3 text-sm underline text-red-600">Go Back</button>
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  const lastUpdatedFormatted = (() => {
    try {
      if (!bill.lastUpdated) return "N/A";
      const parts = bill.lastUpdated.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const d = new Date(year, month, day, 10, 9, 6);
        
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const ww = weekdays[d.getDay()];
        const mm = months[d.getMonth()];
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        
        return `${ww} ${mm} ${dd} ${yyyy} at 10:09:06 AM`;
      }
    } catch (e) { }
    return bill.lastUpdated || "N/A";
  })();

  const shortCategory = bill.category
    ? bill.category.replace("Reform", "").replace("Services", "").split("&")[0].trim().split(" ")[0].trim()
    : "General";

  const sponsorPrefix = sponsor ? (sponsor.title === "Senator" ? "Sen." : "Hon.") : "";
  const cleanSponsorName = bill.sponsorName.startsWith("Sen.") || bill.sponsorName.startsWith("Hon.")
    ? bill.sponsorName
    : sponsorPrefix ? `${sponsorPrefix} ${bill.sponsorName}` : bill.sponsorName;

  const billUrl = `${window.location.origin}/?billId=${bill.id}`;
  
  const shareText = `I wanted to share with you information about a legislative bill that I found particularly interesting. \nBelow are the details of the bill:\n\n- Title: ${bill.billNumber}: ${bill.title}.\n- Chamber: ${bill.chamberOfOrigin === Chamber.SENATE ? "SENATE" : "HOUSE"}\n- Stage: ${bill.currentStage}\n- Sponsor: ${cleanSponsorName}\n- Category: ${shortCategory}\n- Last Updated: ${lastUpdatedFormatted}\n\nI thought you might find this bill relevant or informative. Feel free to follow the URL provided to learn more about it.\n\n${billUrl}`;

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Legislative Bill Info: ${bill.billNumber}`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out legislative bill ${bill.billNumber}: ${bill.title}`);
    const url = encodeURIComponent(billUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.getElementById(`share-summary-text-${bill.id}`) as HTMLTextAreaElement;
      if (textarea) {
        textarea.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Calculate vote percentages
  const votesFor = bill.votesFor || 0;
  const votesAgainst = bill.votesAgainst || 0;
  const totalVotes = votesFor + votesAgainst;
  const supportPercent = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 60; // default initial layout support
  const opposePercent = totalVotes > 0 ? Math.round((votesAgainst / totalVotes) * 100) : 40;

  // Handle support/oppose clicking
  const handleVoteLocal = async (type: "for" | "against") => {
    if (hasVoted || voteSubmitting) return;
    setVoteSubmitting(true);
    try {
      await onVoteBill(bill.id, type);
      setHasVoted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setVoteSubmitting(false);
    }
  };

  // Submit comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const addedReview = await onPostReview(bill.id, newCommentName, newCommentRating, newCommentText);
      setReviews([addedReview, ...reviews]);
      setNewCommentName("");
      setNewCommentText("");
      setNewCommentRating(5);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Simulate updating stage
  const handleStageSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    try {
      await onUpdateStage(bill.id, simulatedStage, simulatedNote);
      setSimulatedNote("");
    } catch (err) {
      console.log(err);
    } finally {
      setSimulating(false);
    }
  };

  const getStageDisplayIndex = (stage: LegislativeStage) => {
    return stagesList.indexOf(stage);
  };

  const currentStageIndex = getStageDisplayIndex(bill.currentStage);

  return (
    <div className="space-y-6" id={`bill-detail-page-${bill.id}`}>
      {/* Printable official document layout */}
      <div className="hidden print:block text-slate-900 bg-white p-8 max-w-4xl mx-auto space-y-8 animate-fade-in" id="bill-print-document">
        <div className="border-b-4 border-slate-900 pb-4 text-center">
          <h1 className="text-xl font-bold tracking-widest uppercase text-slate-900 font-display">
            National Assembly Bill Registry &amp; Tracking Index
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mt-1.5 font-bold">
            Democratic Transparency Initiative — Live Legislative Intelligence Brief
          </p>
        </div>

        {/* Bill Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs">
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Bill Number</span>
            <span className="text-base font-black font-mono text-slate-955">{bill.billNumber}</span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Chamber of Origin</span>
            <span className="text-sm font-bold text-slate-850">{bill.chamberOfOrigin}</span>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Category / Classification</span>
            <span className="text-xs font-bold text-slate-805 bg-slate-100 px-2 py-0.5 rounded inline-block mt-0.5">{bill.category}</span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Report Printed</span>
            <span className="font-mono text-xs text-slate-700">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded w-max block uppercase tracking-wider">Official Short Title</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
            {bill.title}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-sans mt-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/65">
            {bill.fullTitle}
          </p>
        </div>

        {/* Sponsor details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Sourced Chief Sponsor</span>
            <span className="font-bold text-slate-850">{sponsor?.title || "Dr."} {bill.sponsorName}</span>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Constituency Representation</span>
            <span className="font-semibold text-slate-700">{sponsor ? `${sponsor.party} — ${sponsor.constituency}, ${sponsor.state} State` : "N/A"}</span>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[9px]">Clerk Records Attendance</span>
            <span className="font-mono font-black text-slate-850">{sponsor ? `${sponsor.attendanceRate}% Attendance Rate` : "N/A"}</span>
          </div>
        </div>

        {/* AI Brief Executive Summary */}
        {bill.aiAnalysis && (
          <div className="space-y-4">
            <h3 className="text-[11px] uppercase font-black tracking-widest text-slate-900 border-b border-slate-350 pb-1.5 flex items-center gap-1.5">
              <span>Executive Impact Assessment &amp; Policy Intelligence</span>
            </h3>
            <div className="space-y-3.5 leading-relaxed text-xs">
              <div className="bg-slate-50/40 p-3.5 rounded-xl border border-slate-150-dot">
                <h4 className="font-bold text-slate-850 mb-1 text-[10px] uppercase tracking-wider text-slate-500">Executive Summary Output</h4>
                <p className="text-slate-800 font-medium text-xs leading-relaxed">
                  {bill.aiAnalysis.summary}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150">
                  <h4 className="font-bold text-slate-850 mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">Impact on Common Citizenry</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{bill.aiAnalysis.publicImpact}</p>
                </div>
                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-150">
                  <h4 className="font-bold text-slate-850 mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">Financial &amp; Budget Consequences</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">{bill.aiAnalysis.financialImplication}</p>
                </div>
              </div>

              {/* Pros & Cons detailed */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-black text-blue-900 mb-1.5 uppercase text-[9px] tracking-widest border-b border-blue-100 pb-0.5">Advantages (Pros)</h4>
                  <ul className="space-y-1.5">
                    {bill.aiAnalysis.pros.map((pro, i) => (
                      <li key={i} className="text-[11px] text-slate-650 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-blue-600 shrink-0 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-black text-rose-850 mb-1.5 uppercase text-[9px] tracking-widest border-b border-rose-100 pb-0.5">Risks (Cons)</h4>
                  <ul className="space-y-1.5">
                    {bill.aiAnalysis.cons.map((con, i) => (
                      <li key={i} className="text-[11px] text-slate-655 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-600 shrink-0 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legislative Progress timeline list */}
        <div className="space-y-4 pt-2">
          <h3 className="text-[11px] uppercase font-black tracking-widest text-slate-900 border-b border-slate-350 pb-1.5">
            Official Progression Timeline &amp; Reading Gazette Notes
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-305 text-[9px] uppercase font-black text-slate-400">
                <th className="py-2.5 w-1/3">Stage</th>
                <th className="py-2.5 w-1/6">Date</th>
                <th className="py-2.5">Clerks Gazette Summary Notes</th>
              </tr>
            </thead>
            <tbody>
              {bill.timeline.map((step) => (
                <tr key={step.stage} className={`border-b border-slate-100 py-3 ${step.completed ? "opacity-100 bg-blue-50/10" : "opacity-40"}`}>
                  <td className="py-2.5 font-bold text-slate-800">
                    {step.completed ? "✓ " : "○ "} {step.stage}
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-slate-600">{step.date || "Pending"}</td>
                  <td className="py-2.5 text-[11px] text-slate-600 leading-relaxed font-medium">{step.note || "No comments filed in official registry."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info disclosure */}
        <div className="border-t border-slate-200 pt-5 text-center text-[9px] text-slate-400 leading-relaxed font-sans">
          <p>This report was automatically synthesized and styles optimized for clean PDF output or A4 printing.</p>
          <p className="mt-0.5 font-semibold">National Assembly Bills Tracker — Supporting Public Transparency in Legislative Drafting.</p>
        </div>
      </div>

      <style>{`
        @media print {
          /* Hide standard elements completely */
          #app-header, 
          #platform-clerk-footer, 
          #network-pwa-toast, 
          #pwa-install-overlay,
          .print-hidden,
          .print\\:hidden,
          #plac-sync-banner {
            display: none !important;
          }
          
          /* Reset page backgrounds and root layout containers for print formatting */
          body, html, #root {
            background: white !important;
            color: #0f172a !important; /* slate-900 */
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Standard interactive web UI layout */}
      <div className="space-y-6 print:hidden">
        {/* Back button and Meta layout */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-755 font-semibold text-xs rounded-xl border border-slate-205 flex items-center gap-2 group transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
            <span>Back to Legislation</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Print Summary Button */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-205 flex items-center gap-1.5 transition cursor-pointer shadow-sm hover:border-slate-300"
              id="btn-print-bill"
              title="Print clean legislative summary"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Print Summary</span>
            </button>

            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(bill.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
                  isBookmarked
                    ? "bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-205"
                }`}
                id="btn-toggle-watchlist"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "text-amber-500 fill-amber-500" : ""}`} />
                <span>{isBookmarked ? "In Watchlist" : "Watchlist"}</span>
              </button>
            )}
            <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded font-bold">
              {bill.billNumber}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-semibold font-sans">
              {bill.category}
            </span>
          </div>
        </div>

      {/* Bill Core Summary Hero */}
      <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl md:text-2xl font-extrabold font-display tracking-tight text-slate-900 leading-tight mb-3">
          {bill.title}
        </h2>
        <p className="text-slate-600 text-sm md:text-base max-w-4xl leading-relaxed mb-6 font-sans">
          {bill.fullTitle}
        </p>

        {/* Sponsor line and Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 font-display font-extrabold rounded-full flex items-center justify-center text-sm">
              {sponsor?.name ? sponsor.name.split(" ").pop()?.substring(0, 2).toUpperCase() : "SP"}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chief Sponsor</div>
              <button
                onClick={() => sponsor && onSelectLegislator(sponsor.id)}
                className="text-slate-800 hover:text-blue-600 font-bold text-xs md:text-sm text-left hover:underline transition"
              >
                {bill.sponsorName}
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chamber of Origin</div>
            <div className="text-slate-700 font-semibold text-xs md:text-sm mt-0.5 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-600" />
              {bill.chamberOfOrigin}
            </div>
          </div>

          <div className="space-y-1.5 min-w-[150px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status Index</div>
            <div className="text-slate-705 font-semibold text-xs md:text-sm mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Progress: {bill.stageProgress}% ({bill.currentStage})
            </div>
            {/* Visual Legislative Progress Bar with dynamic first-render motion */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden" id={`bill-detail-progress-${bill.id}`}>
              <motion.div
                className={`h-full rounded-full ${
                  bill.currentStage === LegislativeStage.ASSENT
                    ? "bg-blue-500"
                    : bill.currentStage === LegislativeStage.VETOED
                    ? "bg-rose-500"
                    : "bg-blue-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${bill.stageProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs Selection Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2" id="detail-tab-navigation">
        <button
          onClick={() => setActiveSubTab("progress")}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "progress"
              ? "border-blue-600 text-slate-900 font-bold"
              : "border-transparent text-slate-450 hover:text-slate-600"
          }`}
        >
          <Milestone className="w-4.5 h-4.5" />
          <span>Legislative Stepper & History</span>
        </button>

        <button
          onClick={() => setActiveSubTab("ai-brief")}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "ai-brief"
              ? "border-blue-600 text-slate-900 font-bold"
              : "border-transparent text-slate-450 hover:text-slate-600"
          }`}
          id="tab-trigger-ai-brief"
        >
          <Sparkles className="w-4.5 h-4.5 text-yellow-500 animate-bounce" />
          <span className="flex items-center gap-1">
            <span>AI Impact Brief</span>
            <span className="text-[9px] px-1 bg-yellow-105 text-yellow-700 border border-yellow-200 rounded font-semibold">PRO</span>
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("citizen-opinion")}
          className={`pb-3 text-sm font-semibold border-b-2 px-4 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeSubTab === "citizen-opinion"
              ? "border-blue-600 text-slate-900 font-bold"
              : "border-transparent text-slate-450 hover:text-slate-600"
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5" />
          <span>Citizen Feedback & Polls ({reviews.length})</span>
        </button>
      </div>

      {/* Detail Content Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column Pane (SubTabs Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: PROGRESS TRACKER (STEPPER LIST) */}
          {activeSubTab === "progress" && (
            <motion.div 
              key={`progress-tab-${bill.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                    <span>National Assembly Legislative Path</span>
                    <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-sans font-semibold">
                      {bill.chamberOfOrigin}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Official 10th Assembly clerk timeline. Tracks progression from initial gazette to presidential assent.
                  </p>
                </div>

                {/* Live Dynamic Stage Meter Badge */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Advancement</div>
                    <motion.div 
                      key={bill.stageProgress}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="text-xs font-extrabold text-slate-800 font-mono"
                    >
                      {bill.stageProgress}% Complete
                    </motion.div>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                    {bill.timeline.filter(t => t.completed).length}/{bill.timeline.length}
                  </div>
                </div>
              </div>

              {/* Mini Segmented Progress Bar */}
              <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>Current Active Stage: <strong className="text-slate-900">{bill.currentStage}</strong></span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Step {Math.max(1, bill.timeline.findIndex(s => s.stage === bill.currentStage) + 1)} of {bill.timeline.length}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 pt-1">
                  {bill.timeline.map((step, idx) => {
                    const isDone = step.completed;
                    const isCur = bill.currentStage === step.stage;
                    return (
                      <div key={step.stage} className="space-y-1">
                        <div className="h-1.5 rounded-full overflow-hidden bg-slate-200">
                          <motion.div
                            className={`h-full rounded-full ${
                              isDone ? "bg-blue-600" : isCur ? "bg-amber-500" : "bg-transparent"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: isDone || isCur ? "100%" : "0%" }}
                            transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Stepper Timeline with Framer Motion */}
              <motion.div 
                className="space-y-6 relative pt-2"
                id="legislative-progress-stepper"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.04
                    }
                  }
                }}
              >
                {/* Background Connecting Line */}
                <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-slate-100 rounded-full" />

                {/* Animated Dynamic Progress Line */}
                <motion.div
                  className="absolute left-[17px] top-6 w-0.5 bg-gradient-to-b from-blue-600 via-blue-500 to-amber-500 rounded-full origin-top"
                  initial={{ height: 0 }}
                  animate={{
                    height: (() => {
                      const curIdx = bill.timeline.findIndex((s) => s.stage === bill.currentStage);
                      const compCount = bill.timeline.filter((s) => s.completed).length;
                      const activeIndex = curIdx >= 0 ? curIdx : Math.max(0, compCount - 1);
                      if (bill.timeline.length <= 1) return "0%";
                      return `${Math.min(100, Math.max(0, (activeIndex / (bill.timeline.length - 1)) * 100))}%`;
                    })()
                  }}
                  transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                />

                {bill.timeline.map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent = bill.currentStage === step.stage;
                  
                  return (
                    <motion.div
                      key={`${step.stage}-${bill.currentStage}`}
                      id={`stepper-step-${getStageDisplayIndex(step.stage)}`}
                      variants={{
                        hidden: { opacity: 0, x: -16, y: 8 },
                        visible: { 
                          opacity: 1, 
                          x: 0, 
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 24
                          }
                        }
                      }}
                      layout
                      className={`flex gap-4 relative transition-all ${
                        isCompleted ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-55 hover:opacity-85"
                      }`}
                    >
                      {/* Check dot icon with animated spring nodes */}
                      <div className="relative z-10 shrink-0 pt-0.5">
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.div
                              key="completed-icon"
                              initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 450, damping: 22 }}
                              className="w-9 h-9 rounded-full bg-blue-600 border-4 border-white text-white flex items-center justify-center shadow-sm shadow-blue-600/20"
                              title="Completed Stage"
                            >
                              <Check className="w-4 h-4 stroke-[3px]" />
                            </motion.div>
                          ) : isCurrent ? (
                            <motion.div
                              key="current-icon"
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              className="relative flex items-center justify-center"
                            >
                              {/* Pulsing Outer Halo */}
                              <motion.span
                                className="absolute w-12 h-12 rounded-full bg-amber-400/25 -z-10"
                                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                              <div className="w-9 h-9 rounded-full bg-amber-500 border-4 border-amber-100 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                                <AlertCircle className="w-4 h-4 font-bold" />
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="upcoming-icon"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-9 h-9 rounded-full bg-slate-100 border-4 border-white text-slate-400 flex items-center justify-center text-xs font-bold font-mono shadow-xs"
                            >
                              {index + 1}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Content step card with smooth layout animation */}
                      <motion.div 
                        layout
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                          isCurrent 
                            ? "bg-gradient-to-r from-amber-50/70 to-white border-amber-300 shadow-sm shadow-amber-500/5 ring-1 ring-amber-300/40" 
                            : isCompleted 
                            ? "bg-slate-50/70 hover:bg-slate-50 border-slate-200/70 shadow-2xs" 
                            : "bg-white border-slate-150 text-slate-400"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 leading-normal">
                          <h4 className={`text-sm font-bold flex items-center gap-2 ${
                            isCurrent ? "text-amber-950" : isCompleted ? "text-slate-900" : "text-slate-600"
                          }`}>
                            <span>{step.stage}</span>
                            <AnimatePresence>
                              {isCurrent && (
                                <motion.span 
                                  initial={{ scale: 0.7, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.7, opacity: 0 }}
                                  className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold uppercase tracking-wider shadow-2xs font-sans"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />
                                  <span>Active Stage</span>
                                </motion.span>
                              )}
                              {isCompleted && !isCurrent && (
                                <motion.span
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 font-sans"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  <span>Passed</span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </h4>
                          {step.date && (
                            <motion.span 
                              key={step.date}
                              initial={{ opacity: 0, y: -2 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`font-mono text-[10px] px-2 py-0.5 rounded border font-semibold self-start sm:self-auto flex items-center gap-1 ${
                                isCurrent 
                                  ? "bg-amber-100/60 text-amber-800 border-amber-200" 
                                  : "bg-slate-100 text-slate-550 border-slate-200"
                              }`}
                            >
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{step.date}</span>
                            </motion.span>
                          )}
                        </div>
                        {step.note && (
                          <motion.p 
                            key={step.note}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-xs mt-2 leading-relaxed font-sans ${
                              isCurrent ? "text-amber-900/80 font-medium" : "text-slate-500"
                            }`}
                          >
                            {step.note}
                          </motion.p>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* TAB 2: AI BRIEFS PANELS */}
          {activeSubTab === "ai-brief" && (
            <div className="bg-white rounded-2xl border border-slate-205 p-6 shadow-sm space-y-6" id="ai-impact-brief-panel">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>Gemini AI Pro Legislative Intelligence</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Strategic impact assessment, cost projections, and public impact rating.
                  </p>
                </div>
                {bill.aiAnalysis && (
                  <div className="flex flex-col items-center p-2.5 bg-blue-50 border border-blue-150 rounded-xl">
                    <span className="text-[10px] text-blue-700 uppercase tracking-wider font-bold">Policy Rating</span>
                    <span className="text-xl font-bold text-blue-600 font-display mt-0.5">{bill.aiAnalysis.overallRating}<span className="text-xs text-blue-400 font-sans font-normal">/100</span></span>
                  </div>
                )}
              </div>

              {bill.aiAnalysis ? (
                <div className="space-y-6">
                  {/* Executive summary block */}
                  <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl leading-relaxed">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Stars className="w-3.5 h-3.5 text-yellow-500" />
                      Executive Objective Analysis
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      {bill.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Impact split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="text-xs uppercase font-bold text-slate-705 mb-2">
                        Impact on Common Citizenry
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {bill.aiAnalysis.publicImpact}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="text-xs uppercase font-bold text-slate-705 mb-2">
                        Financial & Budget Consequences
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {bill.aiAnalysis.financialImplication}
                      </p>
                    </div>
                  </div>

                  {/* Pros and Cons lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-200">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1">
                        ✓ Legislative Advantages (Pros)
                      </h4>
                      <ul className="space-y-1.5">
                        {bill.aiAnalysis.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
                        ✗ Legislative Risks (Cons)
                      </h4>
                      <ul className="space-y-1.5">
                        {bill.aiAnalysis.cons.map((con, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sectors affected */}
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">Sectors Affected</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {bill.aiAnalysis.sectorsAffected.map((sec) => (
                        <span key={sec} className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider font-mono uppercase bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded transition cursor-default">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Stars className="w-8 h-8 text-yellow-500 mx-auto animate-bounce mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">AI Analysis Needs Initialization</h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                    This citizen-drafted bill has not been run through the policy analyzer yet. Advance its stage or query NASS AI to trigger.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FEEDBACK & OPINION (COMMENTS) */}
          {activeSubTab === "citizen-opinion" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Citizen Public Feedback
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Read and share civilian opinions on this proposal. Empowering direct participatory democracy.
                </p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleCommentSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Leave Your Citizen Feedback</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    id="comment-name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    placeholder="Your Full Name (e.g. Ibrahim Bello)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-blue-500 text-slate-800 font-medium"
                  />
                  
                  {/* Rating selection */}
                  <select
                    id="comment-rating"
                    value={newCommentRating}
                    onChange={(e) => setNewCommentRating(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-blue-500 text-slate-700 font-semibold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Highly Support)</option>
                    <option value={4}>⭐⭐⭐⭐ (Support)</option>
                    <option value={3}>⭐⭐⭐ (Neutral / Conditional)</option>
                    <option value={2}>⭐⭐ (Oppose)</option>
                    <option value={1}>⭐ (Highly Oppose)</option>
                  </select>
                </div>

                <textarea
                  required
                  rows={3}
                  id="comment-text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Review the bill, list suggestions, highlight concerns, or state legal arguments..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-blue-500 text-slate-800 font-medium"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    {isSubmittingComment ? "Submitting..." : "Post Citizen Comment"}
                  </button>
                </div>
              </form>

              {/* Feed items */}
              {reviewsLoading ? (
                <div className="text-center py-6 text-xs text-slate-500 font-medium">Loading comments...</div>
              ) : reviews.length === 0 ? (
                <div className="text-slate-400 text-xs text-center py-10 font-medium">
                  No public comments yet. Be the first to express your voice!
                </div>
              ) : (
                <div className="space-y-4" id="feedback-comments-feed">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800">{rev.userName}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[9px] text-slate-400">
                            {new Date(rev.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-amber-500 font-bold ml-1.5 text-xs">
                            {"⭐".repeat(rev.rating)}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-sans">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar Panel (Citizen Polls & Stage Simulator) */}
        <div className="space-y-6">
          
          {/* CITIZEN POLL / PUBLIC SURVEY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-1.5">
              <Vote className="w-5.5 h-5.5 text-blue-600 animate-bounce" />
              <span>Participatory Citizen Poll</span>
            </h3>
            <p className="text-sm text-slate-500 leading-normal font-medium">
              Is this legislative act beneficial for Nigeria? Cast your vote securely. Results are tabulated in real-time.
            </p>

            {/* Support percentages */}
            <div className="space-y-3 pt-2" id="citizen-sentiment-poll">
              {/* Support slider line */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-600 flex items-center gap-1">Support ({supportPercent}%)</span>
                  <span className="text-rose-600">Oppose ({opposePercent}%)</span>
                </div>
                
                <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${supportPercent}%` }} />
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${opposePercent}%` }} />
                </div>
              </div>

              {/* Vote buttons */}
              {!hasVoted ? (
                <div className="grid grid-cols-2 gap-2 pt-1.5">
                  <button
                    onClick={() => handleVoteLocal("for")}
                    id="btn-vote-support"
                    disabled={voteSubmitting}
                    className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Support Act</span>
                  </button>

                  <button
                    onClick={() => handleVoteLocal("against")}
                    id="btn-vote-oppose"
                    disabled={voteSubmitting}
                    className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Oppose Act</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-2 bg-blue-50 text-blue-800 text-xs rounded-lg font-bold border border-blue-200 flex items-center justify-center gap-1">
                  ✓ Citizen vote registered on server successfully!
                </div>
              )}
            </div>
          </div>

          {/* SHARE BILL MODULE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-1.5">
              <Share2 className="w-4.5 h-4.5 text-blue-600" />
              <span>Share Bill Information</span>
            </h3>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              Share a beautifully formatted summary of this legislative proposal with journalists, colleagues, or constituents.
            </p>

            {/* Quick Share Buttons Grid */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareEmail}
                className="py-2 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                title="Share via Email"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="py-2 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                title="Share on Twitter / X"
              >
                <span className="text-sky-500 font-extrabold text-sm font-sans">𝕏</span>
                <span>Twitter</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                title="Share on WhatsApp"
              >
                <span className="text-emerald-500 font-extrabold text-sm">💬</span>
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Structured Copy Area */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shareable Summary</span>
                <button
                  onClick={handleCopySummary}
                  className="text-[10px] text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  value={shareText}
                  className="w-full h-32 p-2.5 bg-slate-50 border border-slate-200 text-[10px] font-mono rounded-lg outline-none text-slate-600 leading-relaxed overflow-y-auto resize-none select-all focus:ring-1 focus:ring-blue-500"
                  id={`share-summary-text-${bill.id}`}
                />
              </div>
            </div>
          </div>

          {/* ACTIVE LEGISLATOR PROFILE */}
          {sponsor && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chief Sponsor Statistics</h3>
              
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-900 flex items-center justify-center font-display font-black border uppercase shadow-sm">
                  {sponsor.name.split(" ").pop()?.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{sponsor.title} {sponsor.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sponsor.party} — {sponsor.constituency}, {sponsor.state} State</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs font-medium">
                <div>
                  <span className="text-slate-400 font-medium text-[11px]">Attendance Meter</span>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono text-sm">{sponsor.attendanceRate}%</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium text-[11px]">Engagement Score</span>
                  <div className="font-bold text-blue-600 mt-0.5 font-mono text-sm">{sponsor.engagementScore}%</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium text-[11px]">Bills Sponsored</span>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono text-sm">{sponsor.billsSponsored.length}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium text-[11px]">Motions Authored</span>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono text-sm">{sponsor.motionsPresentedCount}</div>
                </div>
              </div>

              <button
                onClick={() => onSelectLegislator(sponsor.id)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Inspect Legislative Card
              </button>
            </div>
          )}

          {/* SIMULATE LEGISLATIVE PROGRESS */}
          <div className="bg-slate-50 text-slate-800 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-1.5">
              <Play className="w-4.5 h-4.5 text-blue-600 transform rotate-90" />
              <span>NASS Legislative Simulator</span>
            </h3>
            <p className="text-xs text-slate-500 leading-normal font-medium">
              Move this bill stage to test how the stepper, metrics, and timeline records auto-update seamlessly in state!
            </p>

            <form onSubmit={handleStageSimulateSubmit} className="space-y-3 pt-1.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Target Stage</label>
                <select
                  id="simulator-target-stage"
                  value={simulatedStage}
                  onChange={(e) => setSimulatedStage(e.target.value as LegislativeStage)}
                  className="w-full bg-white text-slate-800 rounded-lg border border-slate-200 p-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                >
                  {stagesList.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Timeline Clerk Note</label>
                <input
                  type="text"
                  id="simulator-clerk-note"
                  value={simulatedNote}
                  onChange={(e) => setSimulatedNote(e.target.value)}
                  placeholder="e.g. Debated general outlines, public opinion was positive..."
                  className="w-full bg-white text-slate-800 rounded-lg border border-slate-200 p-2 text-xs font-medium focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                id="btn-simulate-stage"
                disabled={simulating}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulating ? "animate-spin" : ""}`} />
                <span>Update Legislative Stage</span>
              </button>
            </form>
          </div>

        </div>
      </div>
      </div> {/* Closing standard interactive web UI - print:hidden layout */}
    </div>
  );
}
