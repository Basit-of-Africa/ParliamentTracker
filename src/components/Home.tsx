/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Landmark, 
  FileText, 
  Users, 
  Sparkles, 
  BookOpen, 
  Vote, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Mail, 
  PieChart, 
  Star,
  Award,
  Calendar,
  MapPin,
  Clock,
  Search
} from "lucide-react";
import { Bill, Legislator, PoliticalParty } from "../types";

interface HomeProps {
  bills: Bill[];
  legislators: Legislator[];
  onNavigateTab: (tab: string) => void;
  onSelectBill: (billId: string) => void;
  onSelectLegislator: (legId: string) => void;
  onRefresh: () => void;
  stats: {
    totalBills: number;
    totalPassed: number;
    totalMPs: number;
    totalVotes: number;
    avgAttendance: number;
  };
}

export default function Home({ 
  bills, 
  legislators, 
  onNavigateTab, 
  onSelectBill, 
  onSelectLegislator,
  onRefresh,
  stats 
}: HomeProps) {

  // Legislative Calendar Mock State Data
  const MOCK_CALENDAR_EVENTS = [
    {
      id: "evt-1",
      title: "Plenary Session: Debate on Constitutional Reform Bills",
      type: "plenary",
      date: "June 09, 2026",
      rawDate: "2026-06-09",
      time: "10:00 AM",
      chamber: "Senate",
      location: "Main Senate Chamber, National Assembly Dome",
      description: "Second reading and primary debate on the proposed amendments regarding judicial independence, federal budget timeliness, and state police creation frameworks.",
      facilitator: "Senator Godswill Akpabio (President of the Senate)"
    },
    {
      id: "evt-2",
      title: "Committee on Finance: Public Hearing on Tax Reform & Harmonization Bill",
      type: "committee",
      date: "June 11, 2026",
      rawDate: "2026-06-11",
      time: "11:30 AM",
      chamber: "Joint",
      location: "Committee Room 102, Senate Building",
      description: "High-level interactive session gathering civic organization representatives, business coalitions, and finance stakeholders to submit memoranda on digital service tax thresholds.",
      facilitator: "Hon. James Faleke (Chairman, Joint Finance Committee)"
    },
    {
      id: "evt-3",
      title: "Plenary Session: Healthcare Workers Protection & Safety Trust Bill",
      type: "plenary",
      date: "June 16, 2026",
      rawDate: "2026-06-16",
      time: "10:00 AM",
      chamber: "House",
      location: "House of Representatives Meeting Hall",
      description: "Final reading, technical review of clause amendments, and general vote to establish the administrative safety trust fund for federal medical professionals.",
      facilitator: "Hon. Tajudeen Abbas (Speaker of the House)"
    },
    {
      id: "evt-4",
      title: "Committee on Security & Intelligence: Closed-Door Security Operations Briefing",
      type: "committee",
      date: "June 18, 2026",
      rawDate: "2026-06-18",
      time: "1:00 PM",
      chamber: "Joint",
      location: "Chamber Briefing Hall C",
      description: "Review of technology deployment budgets for national defense coordination and inter-agency border automation platforms.",
      facilitator: "Senator Aliyu Wamakko (Chairman, Committee on Security)"
    },
    {
      id: "evt-5",
      title: "Summer Legislative Recess: Constituency Working Period",
      type: "recess",
      date: "July 23, 2026",
      rawDate: "2026-07-23",
      time: "All Day",
      chamber: "Joint",
      location: "All Constituency Off-sites",
      description: "Official Third Quarter parliamentary recess. During this cycle, lawmakers depart the capital to host localized constituent assemblies and review regional community petitions.",
      facilitator: "NASS Secretariat of Administration"
    }
  ];

  const [calendarEvents] = useState(MOCK_CALENDAR_EVENTS);
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [calendarSearch, setCalendarSearch] = useState("");

  const filteredEvents = calendarEvents.filter(event => {
    const matchesType = selectedEventType === "all" || event.type === selectedEventType;
    const matchesSearch = event.title.toLowerCase().includes(calendarSearch.toLowerCase()) || 
                          event.description.toLowerCase().includes(calendarSearch.toLowerCase()) ||
                          event.location.toLowerCase().includes(calendarSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Get top 3 trending bills based on votes counts
  const trendingBills = [...bills]
    .sort((a, b) => {
      const votesA = (a.votesFor || 0) + (a.votesAgainst || 0);
      const votesB = (b.votesFor || 0) + (b.votesAgainst || 0);
      return votesB - votesA;
    })
    .slice(0, 3);

  // Get top 3 highly engaged legislators
  const topLegislators = [...legislators]
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 3);

  const getPartyBadgeStyle = (party: PoliticalParty) => {
    switch (party) {
      case PoliticalParty.APC:
        return "bg-blue-50 border-blue-200 text-blue-700";
      case PoliticalParty.PDP:
        return "bg-red-50 border-red-200 text-red-600";
      case PoliticalParty.LP:
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case PoliticalParty.APGA:
        return "bg-amber-50 border-amber-200 text-amber-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-600";
    }
  };

  return (
    <div className="space-y-12 animate-fade" id="platform-homepage-landing">
      
      {/* 1. Hero Spotlight Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-14 border border-slate-800 shadow-xl" id="hero-welcome-banner">
        {/* Dynamic backdrop map/geometric abstract accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 select-none pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-y-24 -translate-x-12 select-none pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Tenth National Assembly Accountability Portal</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight">
              Democratizing access to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">Nigerian Legislation</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-xl font-medium">
              Monitor active bills, inspect lawmaker scorecards, chat with our legislative AI advisor, and publish direct correspondence with Senators and House Representatives. Together, we build a transparent democracy.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigateTab("bills")}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-900/40 flex items-center gap-2 group cursor-pointer"
              >
                <span>Track Active Bills</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => onNavigateTab("ai-copilot")}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-extrabold text-sm rounded-xl border border-slate-750 hover:border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            {/* National Assembly dome vector/stylized mock illustration card */}
            <div className="p-6 bg-slate-800/40 border border-slate-750/70 rounded-2xl backdrop-blur-md space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-sm">Abia to Zamfara Integration</h3>
                  <a
                    href="https://nass.gov.ng/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                  >
                    <span>Official Gazette & Parliament Records</span>
                    <span className="text-[10px]/none">↗</span>
                  </a>
                </div>
              </div>

              {/* Stat rows with micro-charts */}
              <div className="space-y-3 pt-1 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-350">
                    <span className="font-medium">Chamber Member Presence</span>
                    <span className="font-mono font-bold text-slate-100">{stats.totalMPs} / 469 Members</span>
                  </div>
                  <div className="w-full bg-slate-705 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: "95%" }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-355">
                    <span className="font-medium">Citizen Sentiment Feedback</span>
                    <span className="font-mono font-bold text-slate-100">{stats.totalVotes.toLocaleString()} Appraisals</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: "80%" }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-355">
                    <span className="font-medium">Tenth Assembly Passage Ratio</span>
                    <span className="font-mono font-bold text-slate-150">
                      {Math.round((stats.totalPassed / (stats.totalBills || 1)) * 100)}% General Assent
                    </span>
                  </div>
                  <div className="w-full bg-slate-750 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${Math.round((stats.totalPassed / (stats.totalBills || 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-750 text-[10px] text-slate-450 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified data audited directly from official 10th Assembly Hansards.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "What You Can Do on Parliament Tracker" Feature Highlights Grid */}
      <section className="bg-white p-8 md:p-14 rounded-3xl border border-slate-200/90 shadow-xs space-y-10" id="what-you-can-do-section">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest block font-sans">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 tracking-tight leading-tight">
            What You Can Do on <span className="text-emerald-600">Parliament Tracker</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans max-w-2xl mx-auto">
            Empowering every citizen with the tools to monitor, participate in, and influence the legislative process — right from your device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Track Bills */}
          <div 
            onClick={() => onNavigateTab("bills")}
            className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition duration-300 cursor-pointer flex flex-col justify-between"
            id="whaddo-card-bills"
          >
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src="/src/assets/images/nigerian_bills_tracking_1780678714513.png" 
                  alt="Track Bills" 
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-emerald-650 transition leading-snug">
                  Track Bills in Real-Time
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
                  Follow legislation from proposal to passage
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Raise & Sign Petitions */}
          <div 
            onClick={() => onNavigateTab("propose")}
            className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition duration-300 cursor-pointer flex flex-col justify-between"
            id="whaddo-card-petitions"
          >
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src="/src/assets/images/nigerian_civic_petitions_1780678729589.png" 
                  alt="Raise & Sign Petitions" 
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-emerald-650 transition leading-snug">
                  Raise & Sign Petitions
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
                  Mobilize public support and demand change
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Legislators */}
          <div 
            onClick={() => onNavigateTab("mps")}
            className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition duration-300 cursor-pointer flex flex-col justify-between"
            id="whaddo-card-legislators"
          >
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src="/src/assets/images/nigerian_legislators_scores_1780678744320.png" 
                  alt="Legislators Profile Finder" 
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 px-1">
                <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-emerald-650 transition leading-snug">
                  Legislators
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
                  Discover detailed profiles of Nigeria's lawmakers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* See More Call-to-Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => onNavigateTab("bills")}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center gap-2 group cursor-pointer"
            id="btn-what-you-can-do-seemore"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </section>

      {/* 2. Bento Service Navigation Capabilities grid */}
      <section className="space-y-5" id="bento-navigation-spotlight">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 tracking-tight">
            Comprehensive Accountability Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">Four core modules designed to eliminate transparency barriers and connect you with power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => onNavigateTab("bills")}
            className="group cursor-pointer p-6 bg-white border border-slate-200 rounded-3xl hover:border-sky-500 transition-all hover:shadow-md flex flex-col justify-between h-64"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">Legislation Tracker</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5 font-sans">
                  Browse public legislative drafts, check current readings, and review AI summaries highlighting legal implications.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-extrabold text-sky-600 gap-1 mt-4">
              <span>Launch Tracker</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab("mps")}
            className="group cursor-pointer p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 transition-all hover:shadow-md flex flex-col justify-between h-64"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">Senator & MP scorecards</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5 font-sans">
                  Audit attendance rosters, verify bill sponsorship counters, and dispatch verified petitional emails instantly.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-extrabold text-emerald-700 gap-1 mt-4">
              <span>View Roster</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab("ai-copilot")}
            className="group cursor-pointer p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 transition-all hover:shadow-md flex flex-col justify-between h-64"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">NASS AI Copilot</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5 font-sans">
                  Query bills, assess constituency funding distribution, and receive instant policy briefings from Gemini.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-extrabold text-indigo-605 gap-1 mt-4">
              <span>Consult AI</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab("propose")}
            className="group cursor-pointer p-6 bg-white border border-slate-200 rounded-3xl hover:border-amber-500 transition-all hover:shadow-md flex flex-col justify-between h-64"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 leading-tight">Propose Custom Reforms</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5 font-sans">
                  Co-author citizen draft bills, let AI analyze technical feasibility, and share policies for public feedback.
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-extrabold text-amber-700 gap-1 mt-4">
              <span>Propose Draft</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Splitted grid - Trending Active Legislation & Spotlight Legislators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trending Bills Column */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5" id="trending-bills-spot">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black font-display text-slate-900">Trending Active Legislation</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">National bills drawing high public debate and rating votes.</p>
            </div>
            <button 
              onClick={() => onNavigateTab("bills")}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {trendingBills.map((bill, index) => {
              const totalVotes = (bill.votesFor || 0) + (bill.votesAgainst || 0);
              const forPercentage = totalVotes > 0 ? Math.round((bill.votesFor || 0) / totalVotes * 100) : 50;

              return (
                <div 
                  key={bill.id}
                  onClick={() => onSelectBill(bill.id)}
                  className="py-4 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-7 h-7 bg-slate-50 text-slate-450 border rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 transition">
                    0{index + 1}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono bg-slate-50 border px-1.5 py-0.5 rounded text-slate-500 font-semibold">{bill.billNumber}</span>
                      <span className="font-bold tracking-wider uppercase text-[9px]">{bill.category}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 leading-semibold group-hover:text-emerald-650 transition truncate">
                      {bill.title}
                    </h4>

                    {/* Simulating public sentiment split bar */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-sans">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${forPercentage}%` }} />
                        <div className="bg-rose-450 h-full" style={{ width: `${100 - forPercentage}%` }} />
                      </div>
                      <span className="shrink-0 font-medium select-none flex items-center gap-1">
                        <Vote className="w-3.5 h-3.5 text-slate-405" />
                        <strong>{totalVotes}</strong> votes ({forPercentage}% For)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highest Engaged Legislators Column */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5" id="top-legislators-spot">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black font-display text-slate-900">Highly Engaged Lawmakers</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">Top performing representatives based on active engagement indexes.</p>
            </div>
            <button 
              onClick={() => onNavigateTab("mps")}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topLegislators.map((leg) => {
              const badgeStyle = getPartyBadgeStyle(leg.party);
              return (
                <div 
                  key={leg.id}
                  onClick={() => onSelectLegislator(leg.id)}
                  className="py-4 first:pt-0 last:pb-0 cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 font-display font-black text-slate-500 flex items-center justify-center text-sm shrink-0 uppercase group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all">
                      {leg.name.split(" ").pop()?.substring(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 leading-snug truncate group-hover:text-emerald-650 transition">
                        {leg.title} {leg.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${badgeStyle}`}>
                          {leg.party}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px] md:max-w-none">
                          {leg.constituency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Leader Index score indicator */}
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Index Score</div>
                    <div className="text-sm font-black font-mono text-slate-800 mt-0.5 flex items-center justify-end gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{leg.engagementScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Legislative Calendar View Section */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6" id="legislative-calendar-view">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150/70 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-750 border border-emerald-100 text-[11px] font-bold tracking-tight uppercase">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Schedule</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 tracking-tight">
              Tenth Assembly Legislative Calendar
            </h2>
            <p className="text-xs md:text-sm text-slate-550 leading-relaxed font-sans">
              Keep track of live plenary sessions, public committee hearings, and recess dates. Data is dynamically matched from our official Assembly register.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {/* Calendar Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search schedule events..."
                value={calendarSearch}
                onChange={(e) => setCalendarSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-full sm:w-56 transition font-medium"
              />
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2" id="calendar-event-filters">
          {[
            { id: "all", label: "All Events" },
            { id: "plenary", label: "Plenary Sessions" },
            { id: "committee", label: "Committee Hearings" },
            { id: "recess", label: "Assembly Recesses" },
          ].map((type) => {
            const isSelected = selectedEventType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedEventType(type.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-205 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Calendar Events List */}
        <div className="space-y-4" id="calendar-events-list">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-350 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-550">No schedule events found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try widening your search terms or selecting another event category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredEvents.map((event) => {
                let badgeAndColorTheme = {
                  bgColor: "bg-indigo-50",
                  textColor: "text-indigo-700",
                  borderColor: "border-indigo-150",
                  hoverBorder: "hover:border-indigo-400/80",
                  dotColor: "bg-indigo-500",
                  label: "Plenary Session"
                };

                if (event.type === "committee") {
                  badgeAndColorTheme = {
                    bgColor: "bg-emerald-50",
                    textColor: "text-emerald-700",
                    borderColor: "border-emerald-150",
                    hoverBorder: "hover:border-emerald-400/80",
                    dotColor: "bg-emerald-500",
                    label: "Committee Hearing"
                  };
                } else if (event.type === "recess") {
                  badgeAndColorTheme = {
                    bgColor: "bg-amber-50",
                    textColor: "text-amber-700",
                    borderColor: "border-amber-150",
                    hoverBorder: "hover:border-amber-400/80",
                    dotColor: "bg-amber-500",
                    label: "Legislative Recess"
                  };
                }

                return (
                  <div
                    key={event.id}
                    className={`p-5 rounded-2xl bg-white border border-slate-200/90 transition duration-150 hover:shadow-xs ${badgeAndColorTheme.hoverBorder} flex flex-col justify-between sm:flex-row gap-4 items-start`}
                  >
                    {/* Date Block */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0 sm:w-28 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0 sm:pr-4">
                      <span className="font-mono text-xs font-black text-slate-850 uppercase tracking-tight">
                        {event.date}
                      </span>
                      <div className="flex items-center gap-1.5 sm:mt-1">
                        <span className={`w-2 h-2 rounded-full ${badgeAndColorTheme.dotColor}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${badgeAndColorTheme.textColor}`}>
                          {badgeAndColorTheme.label}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded text-slate-550 font-bold uppercase select-none">
                          {event.chamber} Assembly
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-black font-display text-slate-900 leading-tight">
                        {event.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        {event.description}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-450 border-t border-slate-100/60 mt-2">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-405 shrink-0" />
                          <span className="truncate max-w-[180px] md:max-w-none">{event.location}</span>
                        </span>
                      </div>

                      {event.facilitator && (
                        <p className="text-[10px] text-slate-450 italic mt-1.5 font-sans">
                          Led by: <span className="font-semibold text-slate-600">{event.facilitator}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. "How Co-Design Policy Works" - The Public Journey timeline */}
      <section className="bg-slate-50 border border-slate-205 rounded-3xl p-6 md:p-8 shadow-inner space-y-6" id="citizen-journey-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Citizen Co-Design Flow
          </span>
          <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 tracking-tight">
            How Parliament Tracker Connects You
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-sans">
            Bridge the representation gap by advancing through our active civic engagement modules stage-by-stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 relative">
          
          <div className="space-y-3 relative z-10 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black font-mono flex items-center justify-center text-xs shadow">
              1
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Monitor Plenary</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Discover recently introduced bills from constitutional amendments to economic policies, translating complex legal drafting.
            </p>
          </div>

          <div className="space-y-3 relative z-10 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black font-mono flex items-center justify-center text-xs shadow">
              2
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Express Sentiment</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Cast your simulated vote (Yea/Nay) and write verified reviews to document public sentiment scores for representatives.
            </p>
          </div>

          <div className="space-y-3 relative z-10 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black font-mono flex items-center justify-center text-xs shadow">
              3
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Direct Contact</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Write professional petitions to the sponsor or your local MP. Your letter generates automatic email alerts instantly.
            </p>
          </div>

          <div className="space-y-3 relative z-10 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black font-mono flex items-center justify-center text-xs shadow">
              4
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Draft Reforms</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Formulate your own ideas, get instant Gemini legal alignment feedback, and gather support from civic society.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
