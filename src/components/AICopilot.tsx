/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Trash2, HelpCircle, Search, Eye, ExternalLink, Globe } from "lucide-react";
import { ChatMessage, Bill } from "../types";

interface AICopilotProps {
  bills: Bill[];
  selectedBillId: string;
  onSetSelectedBillId: (id: string) => void;
}

export default function AICopilot({ bills, selectedBillId, onSetSelectedBillId }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-msg-1",
      sender: "assistant",
      text: "Hello! I am NASS Advisor, your interactive legislative copilot. You can ask me questions about current bills, sponsor records, parliamentary procedures, or general updates in the Nigerian National Assembly (NASS). Feel free to select a bill to focus our review, or toggle 'Enable Web Search' to ground my knowledge in active news!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [currentSources, setCurrentSources] = useState<{ title: string, uri: string }[]>([]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const presetQueries = [
    { label: "State Police Bill Pros & Cons", query: "Can you analyze the Constitutional Amendment Bill for State Police? What are the primary pros, cons, and abuse risks presented by stakeholders?" },
    { label: "Electricity Act 2024 Reforms", query: "Explain the central changes in the Electricity Act (Amendment) Bill, 2024 and how it empowers states to license grids." },
    { label: "National Minimum Wage updates", query: "What are the core mandates under the National Minimum Wage Act, 2024 regarding local business sizes and salary audits?" },
    { label: "Digital Economy Bill objectives", query: "Tell me about the Digital Economy and e-Governance Bill, 2024. Who sponsored it and what are its main clauses?" }
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    if (!customText) {
      setInputText("");
    }

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          selectedBillId: selectedBillId || undefined,
          enableWebSearch: enableWebSearch
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `chat-${Date.now()}-reply`,
            sender: "assistant",
            text: data.text,
            timestamp: new Date().toISOString()
          }
        ]);
        if (data.sources && data.sources.length > 0) {
          setCurrentSources(data.sources);
        } else {
          setCurrentSources([]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `chat-${Date.now()}-error`,
            sender: "assistant",
            text: `⚠️ API Error: ${data.error || "Unable to retrieve response."}`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (e: any) {
      console.warn("Using offline fallback Copilot chat response:", e);
      const query = textToSend.toLowerCase();
      let replyText = "";
      
      if (query.includes("bill") || query.includes("law") || query.includes("proposal")) {
        replyText = `**[Offline Assistant Mode activated]**\n\nI am currently operating as your local NASS expert. Regarding legislature and bills under the Tenth National Assembly:\n\n1. we actively track crucial social-economic bills like the **Legislative Hazard Allowance Bill** (primary healthcare packages reform) and the **Cybercrime Protection Act (Amendments)**.\n2. You can view the full bill directory, see step-by-step timetables, cast direct support/oppose opinion votes, and draft reviews on the **Bills** catalog tab!\n\nIs there any specific draft category or proposal you would like to analyze?`;
      } else if (query.includes("legislator") || query.includes("senator") || query.includes("reps") || query.includes("member")) {
        replyText = `**[Offline Assistant Mode activated]**\n\nThe Canadian and Nigerian legislative dynamics in the 10th Assembly features 109 Senators and 360 House of Representatives. Under the **Representative Directory** tab, you can search all active lawmakers by party (APC, PDP, LP, etc.) or State.\n\nFor any chosen lawmaker, you can inspect their verified office emails, read through their attendance statistics, and submit direct constituent messages directly!`;
      } else {
        replyText = `**[Offline Assistant Mode activated]**\n\nI am operating with local backup knowledge of the Nigerian 10th National Assembly.\n\nWhile my direct live connection to the Gemini API server is inactive (standard for static frontend deployments or network timeouts), I can provide detailed guidance on our core system: we track 109 Senators, 360 Representatives, citizen legislative bills, attendance scorecards, and public opinion votes. How can I assist you with NASS insights today?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `chat-${Date.now()}-reply-fallback`,
          sender: "assistant",
          text: replyText,
          timestamp: new Date().toISOString()
        }
      ]);
      setCurrentSources([
        { title: "Nigerian National Assembly Home", uri: "https://nass.gov.ng" },
        { title: "PLAC Bills Track Portal", uri: "https://p.placbillstrack.org" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: "msg-clear-reset",
        sender: "assistant",
        text: "I have reset our chat context. Ask me anything about Nigerian NASS legislation!",
        timestamp: new Date().toISOString()
      }
    ]);
    setCurrentSources([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans h-[680px]" id="copilot-dashboard">
      
      {/* Column 1: Context Filter Panel (Sidebar metadata) */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-205 p-4 space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">Context Controller</h3>
            <p className="text-[10px] text-slate-500 mt-1">Focus our AI Advisor's reasoning and citations on a specific bill file.</p>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5 flex items-center justify-between">
              <span>Selected Bill File</span>
              {selectedBillId && (
                <button 
                  onClick={() => onSetSelectedBillId("")}
                  className="text-amber-600 hover:underline hover:text-amber-700 font-sans cursor-pointer font-semibold"
                >
                  Clear Selection
                </button>
              )}
            </label>
            <select
              id="chat-selected-bill"
              value={selectedBillId}
              onChange={(e) => onSetSelectedBillId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 p-2 border border-slate-250 text-slate-800 rounded-lg focus:outline-emerald-500"
            >
              <option value="">-- Chat General NASS Info --</option>
              {bills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.billNumber} - {b.title.substring(0, 36)}...
                </option>
              ))}
            </select>
          </div>

          {selectedBillId && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs animate-fade">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                <Eye className="w-3.5 h-3.5" />
                <span>Scope Profile attached</span>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight">
                {bills.find(b => b.id === selectedBillId)?.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-3 leading-normal font-medium">
                {bills.find(b => b.id === selectedBillId)?.summary}
              </p>
            </div>
          )}

          {/* Search citation lists if available */}
          {currentSources.length > 0 && (
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>Google Grounded Sources</span>
              </div>
              
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {currentSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1 p-1.5 bg-white hover:bg-slate-50 rounded border border-slate-200 text-[10px] font-bold text-emerald-600 hover:underline transition uppercase tracking-wider"
                  >
                    <span className="line-clamp-1 flex-1 text-left">{source.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={clearChatHistory}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-rose-600 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer"
          id="btn-clear-chat"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Conversations</span>
        </button>
      </div>

      {/* Columns 2-4: Conversational Engine Workspace */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-205 shadow-sm flex flex-col justify-between h-full overflow-hidden" id="chat-workspace">
        
        {/* Chat top header bar */}
        <div className="px-5 py-3.5 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">National Assembly Intelligence Assistant</h4>
              <p className="text-[10px] text-emerald-600 font-semibold">Online — Server-side Gemini 3.5 Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Current Scope:</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-50 border text-slate-700">
              {selectedBillId ? bills.find(b => b.id === selectedBillId)?.billNumber : "All NASS Acts"}
            </span>
          </div>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[460px] bg-slate-50/20" id="chat-messages-container">
          {messages.map((m) => {
            const isBot = m.sender === "assistant";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  isBot ? "self-start" : "self-end flex-row-reverse ml-auto"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs shrink-0 ${
                  isBot 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                    isBot 
                      ? "bg-white border-slate-200/60 text-slate-800 rounded-tl-none shadow-sm font-medium" 
                      : "bg-emerald-600 text-white border-emerald-500 rounded-tr-none shadow-sm shadow-emerald-600/10 font-medium"
                  }`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  <div className={`text-[9px] text-slate-400 font-mono ${!isBot && "text-right"}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] self-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border text-xs text-slate-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin text-emerald-650" />
              </div>
              <div className="p-3.5 rounded-2xl text-xs bg-slate-50 border border-slate-200/70 rounded-tl-none text-slate-600 flex items-center gap-1.5 font-semibold shadow-sm">
                <span>Engaging Gemini reasoning core... Please wait</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Bottom controls panel */}
        <div className="p-4 border-t border-slate-150 space-y-3" id="chat-input-controls-panel">
          
          {/* Preset Chips */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Recommended Legislative Briefings</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presetQueries.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.query)}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 hover:text-emerald-600 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 transition text-left cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core bar */}
          <div className="flex items-center gap-2">
            
            {/* Grounding Toggle */}
            <button
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              id="btn-toggle-grounding"
              className={`p-2.5 border rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                enableWebSearch
                  ? "bg-slate-900 border-slate-800 text-white fill-white shadow"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
              }`}
              title="Toggle Live Google Search Grounding to source actual news!"
            >
              <Globe className={`w-4 h-4 ${enableWebSearch ? "text-emerald-500 animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Enable Web Search</span>
            </button>

            {/* Input bar */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                id="copilot-input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={loading ? "Generating agent answer..." : "Ask NASS Advisor general NASS laws or connected bill contents..."}
                disabled={loading}
                className="w-full pl-4 pr-11 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition text-xs font-semibold"
              />
              
              <button
                onClick={() => handleSendMessage()}
                id="btn-chat-send"
                disabled={loading || !inputText.trim()}
                className={`absolute right-1.5 p-1.5 rounded-lg transition ${
                  inputText.trim() && !loading
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                    : "text-slate-400 hover:text-slate-500 bg-transparent"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
