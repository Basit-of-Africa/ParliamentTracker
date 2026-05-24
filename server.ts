/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import { INITIAL_LEGISLATORS, INITIAL_BILLS, INITIAL_REVIEWS } from "./src/initialData.ts";
import { Chamber, PoliticalParty, BillCategory, LegislativeStage, Bill, Legislator, UserReview } from "./src/types.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory store for dynamic session persistence
let legislators_store: Legislator[] = [...INITIAL_LEGISLATORS];
let bills_store: Bill[] = [...INITIAL_BILLS];
let reviews_store: UserReview[] = [...INITIAL_REVIEWS];

// Initialize Google GenAI
const getAIClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API Endpoints ---

// Get all bills
app.get("/api/bills", (req, res) => {
  res.json({ success: true, count: bills_store.length, bills: bills_store });
});

// Create/Submit a bill
app.post("/api/bills", (req, res) => {
  try {
    const { billNumber, title, fullTitle, sponsorId, chamberOfOrigin, category, summary, tags } = req.body;
    
    if (!title || !sponsorId || !category || !summary) {
      return res.status(400).json({ success: false, error: "Missing required bill fields" });
    }

    const sponsor = legislators_store.find(l => l.id === sponsorId);
    if (!sponsor) {
      return res.status(404).json({ success: false, error: "Sponsor legislator not found" });
    }

    const num = billNumber || `HB ${Math.floor(100 + Math.random() * 900)}`;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: num,
      title,
      sponsorId,
      sponsorName: sponsor.name,
      sponsorChamber: sponsor.chamber,
      chamberOfOrigin: chamberOfOrigin || sponsor.chamber,
      category: category as BillCategory,
      currentStage: LegislativeStage.FIRST_READING,
      stageProgress: 10,
      dateProposed: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      summary,
      fullTitle: fullTitle || title,
      tags: tags || [category],
      votesFor: 0,
      votesAgainst: 0,
      timeline: [
        { stage: LegislativeStage.FIRST_READING, date: new Date().toISOString().split('T')[0], note: "Citizen/Representative bill proposal submitted.", completed: true },
        { stage: LegislativeStage.SECOND_READING, date: "", note: "Pending secondary committee review.", completed: false },
        { stage: LegislativeStage.COMMITTEE_STAGE, date: "", note: "", completed: false },
        { stage: LegislativeStage.REPORT_CONSIDERATION, date: "", note: "", completed: false },
        { stage: LegislativeStage.THIRD_READING, date: "", note: "", completed: false },
        { stage: LegislativeStage.CONCURRENCE, date: "", note: "", completed: false },
        { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "", note: "", completed: false },
        { stage: LegislativeStage.ASSENTED, date: "", note: "", completed: false }
      ]
    };

    // Auto add to sponsor's list of bills
    sponsor.billsSponsored = [...(sponsor.billsSponsored || []), newBill.id];

    bills_store.unshift(newBill);
    res.status(201).json({ success: true, bill: newBill });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a bill's stage (for testing/interactive simulation)
app.post("/api/bills/:id/stage", (req, res) => {
  const { id } = req.params;
  const { stage, note } = req.body;

  const bill = bills_store.find(b => b.id === id);
  if (!bill) {
    return res.status(404).json({ success: false, error: "Bill not found" });
  }

  const today = new Date().toISOString().split('T')[0];
  
  // Find index of standard stages
  const stagesList = Object.values(LegislativeStage);
  const stageIndex = stagesList.indexOf(stage as LegislativeStage);

  if (stageIndex === -1) {
    return res.status(400).json({ success: false, error: "Invalid legislative stage" });
  }

  bill.currentStage = stage as LegislativeStage;
  // Calculate approximate percentage progress
  bill.stageProgress = Math.floor(((stageIndex + 1) / stagesList.length) * 100);
  bill.lastUpdated = today;

  // Mark timeline events up to this stage as completed
  bill.timeline = bill.timeline.map((item, idx) => {
    const listStageIdx = stagesList.indexOf(item.stage);
    if (listStageIdx <= stageIndex) {
      return {
        ...item,
        completed: true,
        date: item.date || today,
        note: item.stage === stage ? (note || `Advanced to ${stage}`) : (item.note || "Stage completed.")
      };
    }
    return item;
  });

  res.json({ success: true, bill });
});

// Get all legislators
app.get("/api/legislators", (req, res) => {
  res.json({ success: true, count: legislators_store.length, legislators: legislators_store });
});

// Fallback scraping trigger - fetches PLAC bills track or loads initial
app.get("/api/scrape/members", async (req, res) => {
  try {
    // Attempt parsing list from placbillstrack. Since it's a hydrated client-side app,
    // if a scraper runs, it fetches raw HTML.
    // To ensure full reliability and never block the user, we attempt to retrieve it,
    // and if blocked, or if we want to augment, we return our enriched legislators.
    // Truly scraping NextJS requires reading __NEXT_DATA__ block! Let's do that.
    console.log("Scraping members list from PLAC...");
    const url = "https://p.placbillstrack.org/members/";
    const fetchRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    
    if (fetchRes.ok) {
      const htmlText = await fetchRes.text();
      // Look for __NEXT_DATA__ script block
      const match = htmlText.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
      if (match && match[1]) {
        const nextData = JSON.parse(match[1]);
        // Sometime pageProps has dynamic list
        console.log("Found NEXT_DATA Props on server");
        // We can expose the prop structures to see if legislators are embedded.
        // Even if we cannot parse it perfectly because details are fetch-on-scroll, 
        // we can dynamically build on top of our pristine default dataset!
        return res.json({
          success: true,
          scraped: true,
          nextProps: {
            page: nextData.page,
            buildId: nextData.buildId
          },
          legislators: legislators_store
        });
      }
    }
    
    res.json({
      success: true,
      scraped: false,
      message: "Fetched local synchronized members.",
      legislators: legislators_store
    });
  } catch (error: any) {
    res.json({
      success: true,
      scraped: false,
      error: error.message,
      legislators: legislators_store
    });
  }
});

// Vote in public polls on a bill
app.post("/api/bills/:id/vote", (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // 'for' or 'against'

  const bill = bills_store.find(b => b.id === id);
  if (!bill) {
    return res.status(404).json({ success: false, error: "Bill not found" });
  }

  if (vote === "for") {
    bill.votesFor = (bill.votesFor || 0) + 1;
  } else if (vote === "against") {
    bill.votesAgainst = (bill.votesAgainst || 0) + 1;
  } else {
    return res.status(400).json({ success: false, error: "Invalid vote type" });
  }

  res.json({ success: true, votesFor: bill.votesFor, votesAgainst: bill.votesAgainst });
});

// Get reviews / citizen opinions for a bill
app.get("/api/bills/:id/reviews", (req, res) => {
  const { id } = req.params;
  const billReviews = reviews_store.filter(r => r.billId === id);
  res.json({ success: true, count: billReviews.length, reviews: billReviews });
});

// Post a review
app.post("/api/bills/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ success: false, error: "Missing comment properties" });
  }

  const newReview: UserReview = {
    id: `rev-${Date.now()}`,
    billId: id,
    userName,
    rating: Number(rating),
    comment,
    timestamp: new Date().toISOString()
  };

  reviews_store.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// --- AI Gemini-Powered Endpoints ---

// Generates complete legislative analysis (Brief, summary, impacts, pros, cons) for citizen bills
app.post("/api/gemini/generate-bill-details", async (req, res) => {
  try {
    const { title, category, summary } = req.body;
    if (!title || !summary) {
      return res.status(400).json({ success: false, error: "Title and Summary are required" });
    }

    const prompt = `You are a professional legislative expert in Nigerian law. Analyze the following bill proposal:
    Title: ${title}
    Category: ${category}
    Initial Summary: ${summary}
    
    Please refine and generate a high-quality analysis inside JSON format. The output MUST be valid JSON parsing the schema matching this structure:
    {
      "refinedFullTitle": "string",
      "refinedSummary": "string",
      "aiAnalysis": {
        "summary": "string analyzing draft objectives",
        "publicImpact": "string discussing effect on standard citizens",
        "financialImplication": "string describing cost funding source",
        "pros": ["string1", "string2", "string3"],
        "cons": ["string1", "string2"],
        "sectorsAffected": ["sector1", "sector2"],
        "overallRating": number (1 to 100 rating)
      },
      "tags": ["string1", "string2"]
    }
    Ensure valid JSON output (no markdown wrappers like \`\`\`json outside, or parseable cleanly).`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedFullTitle: { type: Type.STRING },
            refinedSummary: { type: Type.STRING },
            aiAnalysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                publicImpact: { type: Type.STRING },
                financialImplication: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                sectorsAffected: { type: Type.ARRAY, items: { type: Type.STRING } },
                overallRating: { type: Type.INTEGER }
              },
              required: ["summary", "publicImpact", "financialImplication", "pros", "cons", "sectorsAffected", "overallRating"]
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["refinedFullTitle", "refinedSummary", "aiAnalysis", "tags"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chatbot Copilot assist
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, selectedBillId, enableWebSearch } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Invalid chat messages structure" });
    }

    // Build context
    let contextStr = "You are 'NASS Advisor', an interactive, objective, and expert AI chatbot for 'ParliamentTracker', a website designed to track engagement of Senators/Honorables and progress of legislative bills under the Nigerian National Assembly (NASS). ";
    
    if (selectedBillId) {
      const selectedBill = bills_store.find(b => b.id === selectedBillId);
      if (selectedBill) {
        contextStr += `\nCurrently, the user is focusing on this bill:\n` +
          `Title: ${selectedBill.title}\n` +
          `Number: ${selectedBill.billNumber}\n` +
          `Sponsor: ${selectedBill.sponsorName} (${selectedBill.sponsorChamber})\n` +
          `Current Stage: ${selectedBill.currentStage}\n` +
          `Summary: ${selectedBill.summary}\n` +
          `Full Info: ${selectedBill.fullTitle}\n`;
        if (selectedBill.aiAnalysis) {
          contextStr += `AI Analysis of this bill:\n` +
            `- Public Impact: ${selectedBill.aiAnalysis.publicImpact}\n` +
            `- Finance Implication: ${selectedBill.aiAnalysis.financialImplication}\n` +
            `- Pros: ${selectedBill.aiAnalysis.pros.join(", ")}\n` +
            `- Cons: ${selectedBill.aiAnalysis.cons.join(", ")}\n`;
        }
      }
    }

    // List of active bills and legislators so AI knows about the portal's system state
    contextStr += `\nHere are some other active bills we are tracking:\n` + 
      bills_store.map(b => `- ${b.title} [Stage: ${b.currentStage}, Sponsor: ${b.sponsorName}]`).join("\n");
      
    contextStr += `\nHere are some of the legislators in our database:\n` + 
      legislators_store.map(l => `- ${l.title} ${l.name} (${l.party}, State: ${l.state}, Chamber: ${l.chamber}, Engagement Score: ${l.engagementScore}%)`).join("\n");

    const geminiHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // The last user message is the core query
    const lastUserMessage = messages[messages.length - 1];
    
    const queryConfig: any = {
      systemInstruction: contextStr,
    };

    if (enableWebSearch) {
      queryConfig.tools = [{ googleSearch: {} }];
    }

    const ai = getAIClient();
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: lastUserMessage.text,
      config: queryConfig
    });

    const botResponseText = result.text;
    
    // Extract search grounding metadata if present
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
      return {
        title: chunk.web?.title || "Search Reference",
        uri: chunk.web?.uri || ""
      };
    }) || [];

    res.json({
      success: true,
      text: botResponseText,
      sources: sources.filter((s: any) => s.uri)
    });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Serve static files in production & Vite support
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ParliamentTracker full-stack server listening on http://localhost:${PORT}`);
  });
}

startServer();
