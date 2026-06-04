/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Chamber {
  SENATE = "Senate",
  HOUSE_OF_REPS = "House of Representatives"
}

export enum PoliticalParty {
  APC = "APC",
  PDP = "PDP",
  LP = "LP",
  APGA = "APGA",
  NNPP = "NNPP",
  OTHER = "Other"
}

export enum BillCategory {
  CONSTITUTIONAL = "Constitutional Reform",
  SECURITY = "Security & Defense",
  FINANCE = "Finance & Economy",
  HEALTH = "Healthcare Services",
  EDUCATION = "Education & Youth",
  INFRASTRUCTURE = "Infrastructure & Power",
  JUSTICE = "Justice & Human Rights",
  AGRICULTURE = "Agriculture & Environment"
}

export enum LegislativeStage {
  FIRST_READING = "First Reading",
  SECOND_READING = "Second Reading",
  COMMITTEE_ASSIGNMENT = "Committee Assignment",
  REPORT = "Report",
  THIRD_READING = "Third Reading",
  HARMONIZATION = "Harmonization",
  ASSENT = "Assent",
  VETOED = "Vetoed / Rejected"
}

export interface TimelineEvent {
  stage: LegislativeStage;
  date: string;
  note: string;
  completed: boolean;
}

export interface AIAnalysis {
  summary: string;
  publicImpact: string;
  financialImplication: string;
  pros: string[];
  cons: string[];
  sectorsAffected: string[];
  overallRating: number; // 1-100 rating
}

export interface Bill {
  id: string;
  billNumber: string;
  title: string;
  sponsorId: string;
  sponsorName: string;
  sponsorChamber: Chamber;
  chamberOfOrigin: Chamber;
  category: BillCategory;
  currentStage: LegislativeStage;
  stageProgress: number; // 0 to 100 percentage
  dateProposed: string;
  lastUpdated: string;
  summary: string;
  fullTitle: string;
  timeline: TimelineEvent[];
  aiAnalysis?: AIAnalysis;
  votesFor?: number;
  votesAgainst?: number;
  tags: string[];
}

export interface Legislator {
  id: string;
  name: string;
  title: "Senator" | "Honourable" | "Speaker" | "President of Senate";
  chamber: Chamber;
  state: string;
  constituency: string;
  party: PoliticalParty;
  engagementScore: number; // 0 to 100 based on bills & activity
  avatarUrl?: string;
  billsSponsored: string[]; // Bill IDs
  attendanceRate: number; // percentage
  motionsPresentedCount: number;
  districtOfficeEmail?: string;
  status: "Active" | "Inactive";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  billIdContext?: string;
}

export interface UserReview {
  id: string;
  billId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}
