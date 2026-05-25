/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Award, Landmark, Percent, BookOpen, Users, MessageSquare, Send, Calendar, ShieldCheck, Flag } from "lucide-react";
import { Legislator, Bill, Chamber, PoliticalParty } from "../types";

interface LegislatorDetailProps {
  id: string; // The UUID e.g. "385b1ff4-1a79-45fd-bd6b-65b4ccaaeb15"
  legislators: Legislator[];
  bills: Bill[];
  onBack: () => void;
  onSelectBill: (billId: string) => void;
}

interface ConstituentMessage {
  id: string;
  senderName: string;
  email: string;
  topic: string;
  message: string;
  timestamp: string;
}

export default function LegislatorDetail({ id, legislators, bills, onBack, onSelectBill }: LegislatorDetailProps) {
  // Map clean ID from legacy UUID or straight ID matching
  const targetId = id.startsWith("leg-") ? id : `leg-${id}`;
  const legislator = legislators.find((l) => l.id === targetId || l.id === id);

  const [messages, setMessages] = useState<ConstituentMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Form states for constituent petitional contact
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [messageTopic, setMessageTopic] = useState("Policy Feedback");
  const [messageBody, setMessageBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!legislator) return;

    // Fetch messages for this representative
    setMessagesLoading(true);
    fetch(`/api/legislators/${legislator.id}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setMessagesLoading(false));
  }, [id, legislator]);

  if (!legislator) {
    return (
      <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200" id="mp-not-found-screen">
        <h3 className="font-bold font-display text-sm">🚨 Representative Card Not Found</h3>
        <p className="text-xs text-red-700 mt-1">This 10th National Assembly member could not be loaded from active records.</p>
        <button onClick={onBack} className="mt-3 text-xs underline font-semibold text-red-600 block">Go Back to Roster</button>
      </div>
    );
  }

  const getPartyColorStyles = (party: PoliticalParty) => {
    switch (party) {
      case PoliticalParty.APC:
        return {
          bg: "bg-blue-50 border-blue-100 text-blue-700",
          text: "text-blue-700",
          accent: "from-blue-600 to-indigo-600",
          micro: "text-blue-500 bg-blue-100/50"
        };
      case PoliticalParty.PDP:
        return {
          bg: "bg-red-50 border-red-100 text-red-600",
          text: "text-red-600",
          accent: "from-red-600 to-rose-600",
          micro: "text-red-500 bg-red-100/50"
        };
      case PoliticalParty.LP:
        return {
          bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
          text: "text-emerald-700",
          accent: "from-emerald-600 to-teal-600",
          micro: "text-emerald-500 bg-emerald-100/50"
        };
      case PoliticalParty.APGA:
        return {
          bg: "bg-amber-50 border-amber-100 text-amber-700",
          text: "text-amber-700",
          accent: "from-amber-500 to-orange-500",
          micro: "text-amber-500 bg-amber-100/50"
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-600",
          text: "text-slate-600",
          accent: "from-slate-605 to-slate-800",
          micro: "text-slate-500 bg-slate-100"
        };
    }
  };

  const getEngagementRating = (score: number) => {
    if (score >= 90) return { label: "Excellent Leader", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 80) return { label: "Highly Engaged", color: "text-sky-700 bg-sky-50 border-sky-100" };
    return { label: "Representative Participant", color: "text-amber-700 bg-amber-50 border-amber-100" };
  };

  const styles = getPartyColorStyles(legislator.party);
  const rating = getEngagementRating(legislator.engagementScore);
  const sponsoredBills = bills.filter((b) => legislator.billsSponsored.includes(b.id) || b.sponsorId === legislator.id);

  // Submit letter to representative
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !messageBody.trim()) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const res = await fetch(`/api/legislators/${legislator.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName, email: senderEmail, topic: messageTopic, message: messageBody }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([data.message, ...messages]);
        setSenderName("");
        setSenderEmail("");
        setMessageBody("");
        setSubmitFeedback("Success! Your constituent letter has been authorized and dispatched to the representative's local email. A public entry has also been recorded in our civil archive.");
      } else {
        throw new Error(data.error || "Could not publish message.");
      }
    } catch (err: any) {
      setSubmitFeedback(`Error: ${err.message || "Failed to submit constituent correspondence."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id={`member-details-page-${legislator.id}`}>
      
      {/* Dynamic Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-750 font-semibold text-xs rounded-xl border border-slate-205 flex items-center gap-2 group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          <span>Back to Chamber Roster</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wide shadow-sm ${styles.bg}`}>
            {legislator.party} Party
          </span>
          <span className="text-xs font-sans font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            {legislator.chamber}
          </span>
        </div>
      </div>

      {/* Member Hero Banner card */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${styles.accent} text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6`}>
        
        {/* Decorative backdrop map layout logo */}
        <div className="absolute right-0 bottom-0 opacity-10 select-none pointer-events-none transform translate-y-6 translate-x-6">
          <Landmark className="w-64 h-64" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
          {/* Avatar initials badge */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md text-white font-display font-black rounded-full flex items-center justify-center text-3xl border border-white/20 shadow-inner select-none uppercase">
            {legislator.name.split(" ").pop()?.substring(0, 2)}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/15 text-white/90 rounded-full border border-white/10 uppercase tracking-widest leading-none">
                10th Assembly Active
              </span>
              <span className="text-[10px] bg-emerald-500/85 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {legislator.status}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight leading-tight">
              {legislator.title} {legislator.name}
            </h2>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium">
              Representing <span className="font-bold underline text-white">{legislator.constituency}</span>, State of {legislator.state}
            </p>
          </div>
        </div>

        {/* NASS engagement rating score overall badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl relative z-10 w-full md:w-auto text-center md:text-right flex flex-col items-center justify-center gap-0.5 self-center min-w-[140px]">
          <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Overall Index</span>
          <span className="text-3xl font-black font-mono leading-none text-white mt-1">
            {legislator.engagementScore}<span className="text-sm font-sans font-medium text-white/70">/100</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 rounded border border-white/10 text-white/80 mt-2 uppercase tracking-wide">
            {rating.label}
          </span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 block: statistics & Sponsored bills detail index */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General engagement indicators audit ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Legislator Performance Matrix</h3>
              <p className="text-sm text-slate-500 mt-1">Calculated and verified from official 10th National Assembly Hansards and Clerks Registry.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-20">
                <span className="text-slate-400 font-medium text-[10px] flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-600" /> Attendance Ledger
                </span>
                <span className="text-lg font-bold text-slate-800 font-mono mt-1">{legislator.attendanceRate}%</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-20">
                <span className="text-slate-400 font-medium text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-sky-550" /> NASS index Index
                </span>
                <span className="text-lg font-bold text-slate-800 font-mono mt-1">{legislator.engagementScore}%</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-20">
                <span className="text-slate-400 font-medium text-[10px] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-505" /> Sponsored Bills
                </span>
                <span className="text-lg font-bold text-slate-800 font-mono mt-1">{sponsoredBills.length}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between h-20">
                <span className="text-slate-400 font-medium text-[10px] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Plenary Motions
                </span>
                <span className="text-lg font-bold text-slate-800 font-mono mt-1">{legislator.motionsPresentedCount}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-705">Credential Assurance:</span> This profile page displays direct digital mapping records compiled to bridge accountability gaps dynamically. You can review the citizen engagement brief or submit an email petition instantly via the links.
              </div>
            </div>
          </div>

          {/* Sponsored Legislation index list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Sponsored Bills & Reforms</h3>
                <p className="text-sm text-slate-500 mt-0.5">Primary policy reforms proposed or co-signed by this legislator.</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 border border-slate-250 font-bold rounded">
                Total: {sponsoredBills.length}
              </span>
            </div>

            {sponsoredBills.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Flag className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span>No sponsored bills of this legislative representative are currently synchronized in our database.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sponsoredBills.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelectBill(b.id)}
                    className="p-4 bg-slate-50/40 border border-slate-200 hover:border-emerald-500 rounded-2xl hover:shadow-sm cursor-pointer transition flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold font-mono text-slate-450 bg-white border px-1.5 py-0.5 rounded">
                          {b.billNumber}
                        </span>
                        <span className="font-semibold text-slate-450 uppercase">{b.category}</span>
                      </div>
                      <h4 className="text-xs font-bold leading-snug text-slate-800 group-hover:text-emerald-650 transition">
                        {b.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 font-medium">Stage Status</span>
                      <span className="px-2 py-0.5 bg-white border font-bold text-slate-700 rounded-full text-[10px]">
                        {b.currentStage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 block: Contact & write new correspondence */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact coordinates panel info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Channels</h3>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">District Office Email</div>
                  <div className="font-mono text-slate-700 font-semibold mt-0.5 break-all">{legislator.districtOfficeEmail || "contact@nass.gov.ng"}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <Landmark className="w-4 h-4 text-emerald-650 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Consular Capital Office</div>
                  <div className="text-slate-700 font-semibold mt-0.5">10th Assembly Complex, Three Arms Zone, Abuja</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mail / Correspondence Portal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-905 flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Direct Representative Mailer</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-sans font-medium">
              Write a professional, verified constituent message to {legislator.title} {legislator.name.split(" ").pop()}. Your entry generates an email notification and is archived on the platform registry.
            </p>

            {submitFeedback && (
              <div className={`p-3 text-[11px] font-medium rounded-xl leading-relaxed border ${
                submitFeedback.startsWith("Error") 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : "bg-emerald-50 text-emerald-805 border-emerald-200"
              }`} id="correspondence-response-alert">
                {submitFeedback}
              </div>
            )}

            <form onSubmit={handleMessageSubmit} className="space-y-3 text-xs leading-normal">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Your Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Basit Ajibade"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. constituent@domain.ng"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-emerald-500 font-medium text-slate-805"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Message Subject</label>
                <select
                  value={messageTopic}
                  onChange={(e) => setMessageTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-emerald-500 font-semibold text-slate-700"
                >
                  <option value="Policy Feedback">Policy & Bill Feedback</option>
                  <option value="Constituency Infrastructure">Constituency Development & Power</option>
                  <option value="Citizen Petition">Citizen Petition or Appeal</option>
                  <option value="Schedule Consult">Request Consult Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Letter / Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Review the constituency performance, list policy suggestions, highlight development concerns..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-emerald-500 font-medium text-slate-850"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Dispatching Message..." : "Send Authorized Letter"}</span>
              </button>
            </form>
          </div>

          {/* Archived correspondence ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-705 flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span>Constituent Archive Feed ({messages.length})</span>
            </h4>

            {messagesLoading ? (
              <div className="text-center text-slate-400 py-3">Loading letters...</div>
            ) : messages.length === 0 ? (
              <div className="text-slate-400 py-4 text-center border border-dashed border-slate-150 rounded-xl bg-slate-50/20 leading-relaxed max-w-sm mx-auto">
                No archived messages for this member. Send a message to seed the archive!
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1" id="messages-scroller animate-fade">
                {messages.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1 leading-relaxed">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-extrabold text-slate-800">{m.senderName}</span>
                      <span className="font-mono text-slate-400">{new Date(m.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400">{m.topic}</div>
                    <p className="text-slate-600 text-sm leading-normal mt-1 font-sans">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
