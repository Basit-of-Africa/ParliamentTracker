/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, Landmark, Milestone, Sparkles, CheckCircle2, AlertCircle, Share2, ThumbsUp, ThumbsDown, Vote, MessageSquare, Send, Stars, Play, RefreshCw } from "lucide-react";
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
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.log(err))
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
      {/* Back button and Meta layout */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-750 font-semibold text-xs rounded-xl border border-slate-205 flex items-center gap-2 group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          <span>Back to Legislation</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded font-bold">
            {bill.billNumber}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold font-sans">
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
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-600 font-display font-extrabold rounded-full flex items-center justify-center text-sm">
              {sponsor?.name ? sponsor.name.split(" ").pop()?.substring(0, 2).toUpperCase() : "SP"}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chief Sponsor</div>
              <button
                onClick={() => sponsor && onSelectLegislator(sponsor.id)}
                className="text-slate-800 hover:text-emerald-650 font-bold text-xs md:text-sm text-left hover:underline transition"
              >
                {bill.sponsorName}
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Chamber of Origin</div>
            <div className="text-slate-700 font-semibold text-xs md:text-sm mt-0.5 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-600" />
              {bill.chamberOfOrigin}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status Index</div>
            <div className="text-slate-700 font-semibold text-xs md:text-sm mt-0.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Progress: {bill.stageProgress}% ({bill.currentStage})
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
              ? "border-emerald-600 text-slate-900 font-bold"
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
              ? "border-emerald-600 text-slate-900 font-bold"
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
              ? "border-emerald-600 text-slate-900 font-bold"
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
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  National Assembly Legislative Path
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  How a draft becomes statute. View official clerks timeline records for the 10th Assembly.
                </p>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100" id="legislative-progress-stepper">
                {bill.timeline.map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent = bill.currentStage === step.stage;
                  
                  return (
                    <div
                      key={step.stage}
                      id={`stepper-step-${getStageDisplayIndex(step.stage)}`}
                      className={`flex gap-4 relative transition-all ${
                        isCompleted ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {/* Check dot icon */}
                      <div className="relative z-10">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 border-4 border-white text-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-4 h-4 font-bold" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-100 text-white flex items-center justify-center animate-pulse shadow-sm">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 border-4 border-white text-slate-400 flex items-center justify-center text-xs font-bold font-mono">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Content step card */}
                      <div className={`flex-1 p-4 rounded-xl border transition ${
                        isCurrent 
                          ? "bg-amber-50/50 border-amber-200" 
                          : isCompleted 
                          ? "bg-slate-50/60 border-slate-200/50" 
                          : "bg-white border-slate-100"
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 leading-normal">
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>{step.stage}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold animate-pulse font-sans">
                                ACTIVE STAGE
                              </span>
                            )}
                          </h4>
                          {step.date && (
                             <span className="font-mono text-[10px] text-slate-550 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-250 font-semibold self-start sm:self-auto">
                              {step.date}
                            </span>
                          )}
                        </div>
                        {step.note && (
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
                  <div className="flex flex-col items-center p-2.5 bg-emerald-50 border border-emerald-150 rounded-xl">
                    <span className="text-[10px] text-emerald-650 uppercase tracking-wider font-bold">Policy Rating</span>
                    <span className="text-xl font-bold text-emerald-600 font-display mt-0.5">{bill.aiAnalysis.overallRating}<span className="text-xs text-emerald-400 font-sans font-normal">/100</span></span>
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
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                        ✓ Legislative Advantages (Pros)
                      </h4>
                      <ul className="space-y-1.5">
                        {bill.aiAnalysis.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed font-medium">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
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
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
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
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-emerald-500 text-slate-800 font-medium"
                  />
                  
                  {/* Rating selection */}
                  <select
                    id="comment-rating"
                    value={newCommentRating}
                    onChange={(e) => setNewCommentRating(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-emerald-500 text-slate-700 font-semibold"
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
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs focus:outline-emerald-500 text-slate-800 font-medium"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
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
              <Vote className="w-5.5 h-5.5 text-emerald-600 animate-bounce" />
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
                  <span className="text-emerald-600 flex items-center gap-1">Support ({supportPercent}%)</span>
                  <span className="text-rose-600">Oppose ({opposePercent}%)</span>
                </div>
                
                <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${supportPercent}%` }} />
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
                    className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
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
                <div className="text-center py-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-bold border border-emerald-200 flex items-center justify-center gap-1">
                  ✓ Citizen vote registered on server successfully!
                </div>
              )}
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
                  <div className="font-bold text-emerald-600 mt-0.5 font-mono text-sm">{sponsor.engagementScore}%</div>
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
              <Play className="w-4.5 h-4.5 text-emerald-600 transform rotate-90" />
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
                  className="w-full bg-white text-slate-800 rounded-lg border border-slate-200 p-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
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
                  className="w-full bg-white text-slate-800 rounded-lg border border-slate-200 p-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500"
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
    </div>
  );
}
