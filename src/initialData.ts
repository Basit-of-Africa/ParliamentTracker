/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chamber, PoliticalParty, BillCategory, LegislativeStage, Bill, Legislator, UserReview } from "./types";
import { EXTENDED_LEGISLATORS } from "./nassExtendedMembers";
import PLAC_BILLS_REAL from "./plac_bills_mapped.json";

const BASE_LEGISLATORS: Legislator[] = [
  {
    id: "leg-akpabio",
    name: "Senator Godswill Obot Akpabio",
    title: "President of Senate",
    chamber: Chamber.SENATE,
    state: "Akwa Ibom",
    constituency: "Akwa Ibom North-West",
    party: PoliticalParty.APC,
    engagementScore: 92,
    avatarUrl: "",
    billsSponsored: ["bill-elec-2024", "bill-wage-2024"],
    attendanceRate: 98,
    motionsPresentedCount: 14,
    districtOfficeEmail: "g.akpabio@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-abaribe",
    name: "Senator Enyinnaya Harcourt Abaribe",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Abia",
    constituency: "Abia South",
    party: PoliticalParty.APGA,
    engagementScore: 88,
    avatarUrl: "",
    billsSponsored: ["bill-court-reform", "bill-state-police"],
    attendanceRate: 94,
    motionsPresentedCount: 22,
    districtOfficeEmail: "e.abaribe@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-abiru",
    name: "Senator Mukhail Adetokunbo Abiru",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Lagos",
    constituency: "Lagos East",
    party: PoliticalParty.APC,
    engagementScore: 85,
    avatarUrl: "",
    billsSponsored: ["bill-digi-econ"],
    attendanceRate: 95,
    motionsPresentedCount: 11,
    districtOfficeEmail: "t.abiru@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-kingibe",
    name: "Senator Ireti Heebah Kingibe",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "FCT",
    constituency: "Federal Capital Territory",
    party: PoliticalParty.LP,
    engagementScore: 79,
    avatarUrl: "",
    billsSponsored: ["bill-fct-dev"],
    attendanceRate: 89,
    motionsPresentedCount: 18,
    districtOfficeEmail: "i.kingibe@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ndume",
    name: "Senator Mohammed Ali Ndume",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Borno",
    constituency: "Borno South",
    party: PoliticalParty.APC,
    engagementScore: 82,
    avatarUrl: "",
    billsSponsored: ["bill-security-border"],
    attendanceRate: 92,
    motionsPresentedCount: 25,
    districtOfficeEmail: "a.ndume@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-bamidele",
    name: "Senator Michael Opeyemi Bamidele",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Ekiti",
    constituency: "Ekiti Central",
    party: PoliticalParty.APC,
    engagementScore: 86,
    avatarUrl: "",
    billsSponsored: ["bill-cybercrime-2024"],
    attendanceRate: 97,
    motionsPresentedCount: 9,
    districtOfficeEmail: "o.bamidele@senate.gov.ng",
    status: "Active"
  },
  // All 36 States Representatives (Senators)
  {
    id: "leg-yaroe",
    name: "Senator Binos Dauda Yaroe",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Adamawa",
    constituency: "Adamawa South",
    party: PoliticalParty.PDP,
    engagementScore: 81,
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 8,
    districtOfficeEmail: "b.yaroe@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-umeh",
    name: "Senator Victor Umeh",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Anambra",
    constituency: "Anambra Central",
    party: PoliticalParty.LP,
    engagementScore: 84,
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 15,
    districtOfficeEmail: "v.umeh@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-umar",
    name: "Senator Shehu Buba Umar",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Bauchi",
    constituency: "Bauchi South",
    party: PoliticalParty.APC,
    engagementScore: 83,
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 11,
    districtOfficeEmail: "s.umar@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-dickson",
    name: "Senator Henry Seriake Dickson",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Bayelsa",
    constituency: "Bayelsa West",
    party: PoliticalParty.PDP,
    engagementScore: 85,
    billsSponsored: [],
    attendanceRate: 94,
    motionsPresentedCount: 13,
    districtOfficeEmail: "s.dickson@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-moro",
    name: "Senator Abba Moro",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Benue",
    constituency: "Benue South",
    party: PoliticalParty.PDP,
    engagementScore: 87,
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 19,
    districtOfficeEmail: "a.moro@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-jarigbe",
    name: "Senator Jarigbe Agom Jarigbe",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Cross River",
    constituency: "Cross River North",
    party: PoliticalParty.PDP,
    engagementScore: 86,
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 14,
    districtOfficeEmail: "j.jarigbe@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-nwoko",
    name: "Senator Prince Ned Nwoko",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Delta",
    constituency: "Delta North",
    party: PoliticalParty.PDP,
    engagementScore: 82,
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 16,
    districtOfficeEmail: "n.nwoko@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-okorie",
    name: "Senator Anthony Okorie",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Ebonyi",
    constituency: "Ebonyi South",
    party: PoliticalParty.APC,
    engagementScore: 78,
    billsSponsored: [],
    attendanceRate: 89,
    motionsPresentedCount: 7,
    districtOfficeEmail: "a.okorie@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-oshiomhole",
    name: "Senator Adams Aliyu Oshiomhole",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Edo",
    constituency: "Edo North",
    party: PoliticalParty.APC,
    engagementScore: 88,
    billsSponsored: [],
    attendanceRate: 96,
    motionsPresentedCount: 20,
    districtOfficeEmail: "a.oshiomhole@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ezea",
    name: "Senator Okey Ezea",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Enugu",
    constituency: "Enugu North",
    party: PoliticalParty.LP,
    engagementScore: 80,
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 10,
    districtOfficeEmail: "o.ezea@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-goje",
    name: "Senator Danjuma Goje",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Gombe",
    constituency: "Gombe Central",
    party: PoliticalParty.APC,
    engagementScore: 84,
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 12,
    districtOfficeEmail: "d.goje@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-izunaso",
    name: "Senator Osita Izunaso",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Imo",
    constituency: "Imo West",
    party: PoliticalParty.APC,
    engagementScore: 82,
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 14,
    districtOfficeEmail: "o.izunaso@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-hussaini",
    name: "Senator Babangida Hussaini",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Jigawa",
    constituency: "Jigawa West",
    party: PoliticalParty.APC,
    engagementScore: 79,
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 8,
    districtOfficeEmail: "b.hussaini@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-katung",
    name: "Senator Sunday Marshall Katung",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kaduna",
    constituency: "Kaduna South",
    party: PoliticalParty.PDP,
    engagementScore: 85,
    billsSponsored: [],
    attendanceRate: 94,
    motionsPresentedCount: 11,
    districtOfficeEmail: "s.katung@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-hanga",
    name: "Senator Rufai Hanga",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kano",
    constituency: "Kano Central",
    party: PoliticalParty.NNPP,
    engagementScore: 83,
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 13,
    districtOfficeEmail: "r.hanga@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-yaradua",
    name: "Senator Abdulaziz Yar'Adua",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Katsina",
    constituency: "Katsina Central",
    party: PoliticalParty.APC,
    engagementScore: 84,
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 14,
    districtOfficeEmail: "a.yaradua@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-aliero",
    name: "Senator Adamu Aliero",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kebbi",
    constituency: "Kebbi Central",
    party: PoliticalParty.PDP,
    engagementScore: 86,
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 18,
    districtOfficeEmail: "a.aliero@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-karimi",
    name: "Senator Sunday Steve Karimi",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kogi",
    constituency: "Kogi West",
    party: PoliticalParty.APC,
    engagementScore: 81,
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 10,
    districtOfficeEmail: "s.karimi@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-mustapha",
    name: "Senator Saliu Mustapha",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kwara",
    constituency: "Kwara Central",
    party: PoliticalParty.APC,
    engagementScore: 86,
    billsSponsored: [],
    attendanceRate: 96,
    motionsPresentedCount: 15,
    districtOfficeEmail: "s.mustapha@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-wadada",
    name: "Senator Aliyu Wadada",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Nasarawa",
    constituency: "Nasarawa West",
    party: PoliticalParty.OTHER,
    engagementScore: 84,
    billsSponsored: [],
    attendanceRate: 94,
    motionsPresentedCount: 14,
    districtOfficeEmail: "a.wadada@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-musa",
    name: "Senator Mohammed Sani Musa",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Niger",
    constituency: "Niger East",
    party: PoliticalParty.APC,
    engagementScore: 88,
    billsSponsored: [],
    attendanceRate: 97,
    motionsPresentedCount: 21,
    districtOfficeEmail: "s.musa@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-daniel",
    name: "Senator Justus Olugbenga Daniel",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Ogun",
    constituency: "Ogun East",
    party: PoliticalParty.APC,
    engagementScore: 83,
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 12,
    districtOfficeEmail: "g.daniel@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ibrahim",
    name: "Senator Jimoh Ibrahim",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Ondo",
    constituency: "Ondo South",
    party: PoliticalParty.APC,
    engagementScore: 81,
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 9,
    districtOfficeEmail: "j.ibrahim@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-olubiyi",
    name: "Senator Fadeyi Olubiyi",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Osun",
    constituency: "Osun Central",
    party: PoliticalParty.PDP,
    engagementScore: 80,
    billsSponsored: [],
    attendanceRate: 89,
    motionsPresentedCount: 10,
    districtOfficeEmail: "f.olubiyi@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-alli",
    name: "Senator Sharafadeen Abiodun Alli",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Oyo",
    constituency: "Oyo South",
    party: PoliticalParty.APC,
    engagementScore: 82,
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 11,
    districtOfficeEmail: "s.alli@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-lalong",
    name: "Senator Simon Bako Lalong",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Plateau",
    constituency: "Plateau South",
    party: PoliticalParty.APC,
    engagementScore: 84,
    billsSponsored: [],
    attendanceRate: 94,
    motionsPresentedCount: 12,
    districtOfficeEmail: "s.lalong@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-harry",
    name: "Senator Banigo Ipalibo Harry",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Rivers",
    constituency: "Rivers West",
    party: PoliticalParty.PDP,
    engagementScore: 83,
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 13,
    districtOfficeEmail: "i.banigo@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-tambuwal",
    name: "Senator Aminu Waziri Tambuwal",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Sokoto",
    constituency: "Sokoto South",
    party: PoliticalParty.PDP,
    engagementScore: 87,
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 16,
    districtOfficeEmail: "a.tambuwal@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-haruna",
    name: "Senator Manu Haruna",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Taraba",
    constituency: "Taraba Central",
    party: PoliticalParty.PDP,
    engagementScore: 78,
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 6,
    districtOfficeEmail: "m.haruna@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-lawan",
    name: "Senator Ahmad Ibrahim Lawan",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Yobe",
    constituency: "Yobe North",
    party: PoliticalParty.APC,
    engagementScore: 90,
    billsSponsored: [],
    attendanceRate: 98,
    motionsPresentedCount: 15,
    districtOfficeEmail: "a.lawan@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-yari",
    name: "Senator Abdul'aziz Abubakar Yari",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Zamfara",
    constituency: "Zamfara West",
    party: PoliticalParty.APC,
    engagementScore: 85,
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 14,
    districtOfficeEmail: "a.yari@senate.gov.ng",
    status: "Active"
  },
  // Representatives (Honourables) & Additional Key Senators
  {
    id: "leg-abbas",
    name: "Hon. Tajudeen Abbas",
    title: "Speaker",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Kaduna",
    constituency: "Zaria Federal Constituency",
    party: PoliticalParty.APC,
    engagementScore: 94,
    avatarUrl: "",
    billsSponsored: ["bill-wage-2024", "bill-food-security"],
    attendanceRate: 99,
    motionsPresentedCount: 8,
    districtOfficeEmail: "t.abbas@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-kalu",
    name: "Hon. Benjamin Okezie Kalu",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Abia",
    constituency: "Bende Federal Constituency",
    party: PoliticalParty.APC,
    engagementScore: 90,
    avatarUrl: "",
    billsSponsored: ["bill-se-commission"],
    attendanceRate: 96,
    motionsPresentedCount: 16,
    districtOfficeEmail: "b.kalu@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-chinda",
    name: "Hon. Kingsley Ogundu Chinda",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Rivers",
    constituency: "Obio/Akpor Federal Constituency",
    party: PoliticalParty.PDP,
    engagementScore: 84,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 31,
    districtOfficeEmail: "k.chinda@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-salam",
    name: "Hon. Bamidele Salam",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Osun",
    constituency: "Ede North/Ede South/Egbedore Fed Constituency",
    party: PoliticalParty.PDP,
    engagementScore: 87,
    avatarUrl: "",
    billsSponsored: ["bill-youth-fund"],
    attendanceRate: 93,
    motionsPresentedCount: 20,
    districtOfficeEmail: "b.salam@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-doguwa",
    name: "Hon. Alhassan Ado Garba Doguwa",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Kano",
    constituency: "Doguwa/Tudun Wada Fed Constituency",
    party: PoliticalParty.APC,
    engagementScore: 80,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 15,
    districtOfficeEmail: "a.doguwa@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ningi",
    name: "Senator Abdul Ningi",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Bauchi",
    constituency: "Bauchi Central",
    party: PoliticalParty.PDP,
    engagementScore: 86,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 17,
    districtOfficeEmail: "a.ningi@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-adeogun",
    name: "Hon. Abass Adekunle Adeogun",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Oyo",
    constituency: "Ibadan North East/Ibadan South East",
    party: PoliticalParty.PDP,
    engagementScore: 81,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 11,
    districtOfficeEmail: "a.adeogun@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ado",
    name: "Hon. Abdulhakeem Kamilu Ado",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Kano",
    constituency: "Wudil/Garko",
    party: PoliticalParty.NNPP,
    engagementScore: 79,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 87,
    motionsPresentedCount: 6,
    districtOfficeEmail: "k.ado@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-danbuya",
    name: "Hon. Abdulkadir Danbuya",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Sokoto",
    constituency: "Isa/Sabon Birni",
    party: PoliticalParty.APC,
    engagementScore: 80,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 8,
    districtOfficeEmail: "a.danbuya@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-rahis",
    name: "Hon. Abdulkadir Rahis",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Borno",
    constituency: "Maiduguri (Metropolitan)",
    party: PoliticalParty.APC,
    engagementScore: 84,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 12,
    districtOfficeEmail: "a.rahis@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-dabai",
    name: "Hon. Abdullahi Dabai",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Katsina",
    constituency: "Bakori/Danja",
    party: PoliticalParty.PDP,
    engagementScore: 78,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 89,
    motionsPresentedCount: 5,
    districtOfficeEmail: "a.dabai@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ali-kogi",
    name: "Hon. Abdullahi Ibrahim Ali",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Kogi",
    constituency: "Ankpa/Omala/Olamaboro",
    party: PoliticalParty.APC,
    engagementScore: 82,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 9,
    districtOfficeEmail: "a.ali@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-garba-niger",
    name: "Hon. Abdullahi Idris Garba",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Niger",
    constituency: "Kontagora/Wushishi/Mariga/Mashegu",
    party: PoliticalParty.APC,
    engagementScore: 88,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 14,
    districtOfficeEmail: "a.garba@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-mamudu",
    name: "Hon. Abdullahi Mamudu",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Niger",
    constituency: "Agaie/Lapai",
    party: PoliticalParty.APC,
    engagementScore: 83,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 10,
    districtOfficeEmail: "a.mamudu@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-abdullahi-sani",
    name: "Hon. Abdullahi Sani",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Kano",
    constituency: "Karaye/Rogo",
    party: PoliticalParty.NNPP,
    engagementScore: 81,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 7,
    districtOfficeEmail: "a.sani@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-zubairu",
    name: "Hon. Abdulmalik Zubairu",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Zamfara",
    constituency: "Bungudu/Maru",
    party: PoliticalParty.APC,
    engagementScore: 80,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 8,
    districtOfficeEmail: "a.zubairu@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-ari-moh",
    name: "Hon. Abdulmumin Ari Mohammed",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Nasarawa",
    constituency: "Nassarawa/Toto",
    party: PoliticalParty.APC,
    engagementScore: 84,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 11,
    districtOfficeEmail: "a.mohammed@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-adebule",
    name: "Senator Adebule Idiat Oluranti",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Lagos",
    constituency: "Lagos West",
    party: PoliticalParty.APC,
    engagementScore: 87,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 94,
    motionsPresentedCount: 13,
    districtOfficeEmail: "i.adebule@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-abiru-tokunbo",
    name: "Senator Adetokunbo Mukhail Abiru",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Lagos",
    constituency: "Lagos East",
    party: PoliticalParty.APC,
    engagementScore: 89,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 14,
    districtOfficeEmail: "t.abiru@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-adegbonmire",
    name: "Senator Adeniyi Adegbonmire",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Ondo",
    constituency: "Ondo Central",
    party: PoliticalParty.APC,
    engagementScore: 85,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 93,
    motionsPresentedCount: 11,
    districtOfficeEmail: "a.adegbonmire@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-akpoti-natasha",
    name: "Senator Natasha Akpoti-Uduaghan",
    title: "Senator",
    chamber: Chamber.SENATE,
    state: "Kogi",
    constituency: "Kogi Central",
    party: PoliticalParty.OTHER,
    engagementScore: 91,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 96,
    motionsPresentedCount: 19,
    districtOfficeEmail: "n.akpoti@senate.gov.ng",
    status: "Active"
  },
  {
    id: "leg-faleke-james",
    name: "Hon. James Abiodun Faleke",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Lagos",
    constituency: "Ikeja Federal Constituency",
    party: PoliticalParty.APC,
    engagementScore: 89,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 95,
    motionsPresentedCount: 15,
    districtOfficeEmail: "j.faleke@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-jimi-benson-rep",
    name: "Hon. Babajimi Adegoke Benson",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Lagos",
    constituency: "Ikorodu Federal Constituency",
    party: PoliticalParty.APC,
    engagementScore: 91,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 96,
    motionsPresentedCount: 18,
    districtOfficeEmail: "j.benson@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-afam-ogene-rep",
    name: "Hon. Afam Victor Ogene",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Anambra",
    constituency: "Ogbaru Federal Constituency",
    party: PoliticalParty.LP,
    engagementScore: 85,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 91,
    motionsPresentedCount: 12,
    districtOfficeEmail: "v.ogene@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-makinde-obi",
    name: "Hon. Abiola Peter Makinde",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Ondo",
    constituency: "Ondo East/Ondo West",
    party: PoliticalParty.APC,
    engagementScore: 82,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 90,
    motionsPresentedCount: 9,
    districtOfficeEmail: "a.makinde@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-shittu-galambi",
    name: "Hon. Yusuf Shitu Galambi",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Jigawa",
    constituency: "Gwaram",
    party: PoliticalParty.NNPP,
    engagementScore: 80,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 88,
    motionsPresentedCount: 7,
    districtOfficeEmail: "y.galambi@nass.gov.ng",
    status: "Active"
  },
  {
    id: "leg-gimbi-zainab",
    name: "Hon. Zainab Gimba",
    title: "Honourable",
    chamber: Chamber.HOUSE_OF_REPS,
    state: "Bama/Ngala/Kala-Balge",
    constituency: "Bama/Ngala/Kala-Balge Federal Constituency",
    party: PoliticalParty.APC,
    engagementScore: 84,
    avatarUrl: "",
    billsSponsored: [],
    attendanceRate: 92,
    motionsPresentedCount: 11,
    districtOfficeEmail: "z.gimba@nass.gov.ng",
    status: "Active"
  }
];

const combined = [...BASE_LEGISLATORS, ...EXTENDED_LEGISLATORS];
const seen = new Set<string>();
const DEDUPLICATED_LEGISLATORS: Legislator[] = combined.filter(l => {
  if (seen.has(l.id)) return false;
  seen.add(l.id);
  return true;
});

// High-fidelity self-healing synthetic generator to ensure exactly 109 Senators and 360 Reps
const FIRST_NAMES_MALE = [
  "Musa", "Ibrahim", "Abubakar", "Bashir", "Kabiru", "Aliyu", "Danladi", "Haruna", "Abdullahi",
  "Chinedu", "Olumide", "Emeka", "Chidi", "Oladimeji", "Tunde", "Chukwuma", "Kingsley", "Mustapha", "Aminu",
  "Sunday", "Joseph", "Emmanuel", "Samuel", "David", "John", "Victor", "Daniel", "Michael", "Efe", "Uche"
];
const FIRST_NAMES_FEMALE = [
  "Zainab", "Amina", "Funmilayo", "Ngozi", "Aisha", "Halima", "Chioma", "Amara", "Tolani", "Temitope",
  "Yetunde", "Fatima", "Blessing", "Chinwe", "Ifeoma", "Mary", "Grace", "Joy", "Helen", "Sarah", "Kemi", "Ada"
];
const SURNAMES = [
  "Okonkwo", "Balogun", "Adebayo", "Nwosu", "Okafor", "Bello", "Buhari", "Tinubu", "Ojo", "Olatunji",
  "Eze", "Okeke", "Chukwu", "Egwu", "Nwachukwu", "Obinna", "Alao", "Adeleke", "Oyedepo", "Usman",
  "Garba", "Yusuf", "Sani", "Shehu", "Lawal", "Mohammed", "Gidado", "Agabi", "Danjuma", "Igwe"
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", 
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const REPRESENTATIVE_ALLOCATION: Record<string, number> = {
  "Abia": 8, "Adamawa": 8, "Akwa Ibom": 10, "Anambra": 11, "Bauchi": 12, "Bayelsa": 5, "Benue": 11,
  "Borno": 10, "Cross River": 8, "Delta": 10, "Ebonyi": 6, "Edo": 9, "Ekiti": 6, "Enugu": 8,
  "Gombe": 6, "Imo": 10, "Jigawa": 11, "Kaduna": 16, "Kano": 24, "Katsina": 15, "Kebbi": 8,
  "Kogi": 9, "Kwara": 6, "Lagos": 24, "Nasarawa": 5, "Niger": 10, "Ogun": 9, "Ondo": 9,
  "Osun": 9, "Oyo": 14, "Plateau": 8, "Rivers": 13, "Sokoto": 11, "Taraba": 6, "Yobe": 6,
  "Zamfara": 7, "FCT": 2
};

const PARTIES = [
  PoliticalParty.APC,
  PoliticalParty.PDP,
  PoliticalParty.LP,
  PoliticalParty.NNPP,
  PoliticalParty.APGA,
  PoliticalParty.OTHER
];

function generateFullRoster(existing: Legislator[]): Legislator[] {
  const currentSenators = existing.filter(l => l.chamber === Chamber.SENATE);
  const currentReps = existing.filter(l => l.chamber === Chamber.HOUSE_OF_REPS);

  const finalSenators: Legislator[] = [];
  const finalReps: Legislator[] = [];

  // 1. Build Senate seats (exactly 109)
  const senateSeats: { state: string; constituency: string }[] = [];
  for (const state of NIGERIAN_STATES) {
    if (state === "FCT") {
      senateSeats.push({ state, constituency: "FCT Senatorial District" });
    } else {
      senateSeats.push({ state, constituency: `${state} North Senatorial District` });
      senateSeats.push({ state, constituency: `${state} South Senatorial District` });
      senateSeats.push({ state, constituency: `${state} Central Senatorial District` });
    }
  }

  // Map each seat
  const unusedCurrentSenators = [...currentSenators];
  for (const seat of senateSeats) {
    // Try to find exact match in unused pool
    let idx = unusedCurrentSenators.findIndex(
      s => s.state.toLowerCase() === seat.state.toLowerCase() && 
           s.constituency.toLowerCase() === seat.constituency.toLowerCase()
    );
    
    // Try partial match if not found
    if (idx === -1) {
      idx = unusedCurrentSenators.findIndex(
        s => s.state.toLowerCase() === seat.state.toLowerCase()
      );
    }

    if (idx !== -1) {
      // Use existing Senator
      const matched = unusedCurrentSenators.splice(idx, 1)[0];
      // Normalize constituency
      matched.constituency = seat.constituency;
      finalSenators.push(matched);
    } else {
      // Generate synthetic Senator
      const isMale = Math.random() > 0.15;
      const firstName = isMale 
        ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
        : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
      const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
      const name = `Sen. ${firstName} ${lastName}`;
      const party = PARTIES[Math.floor(Math.random() * PARTIES.length)];
      const idCode = `${seat.state}-${seat.constituency}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const id = `leg-gen-sen-${idCode}`;
      
      const charCodeSum = id.split("").reduce((sum: number, c: string) => sum + c.charCodeAt(0), 0);
      const attendanceRate = 80 + (charCodeSum % 19); // 80% to 98%
      const motionsPresentedCount = 1 + (charCodeSum % 14); // 1 to 14
      const engagementScore = 72 + (charCodeSum % 24); // 72 to 95
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@senate.gov.ng`;

      finalSenators.push({
        id,
        name,
        title: "Senator",
        chamber: Chamber.SENATE,
        state: seat.state,
        constituency: seat.constituency,
        party,
        engagementScore,
        billsSponsored: [],
        attendanceRate,
        motionsPresentedCount,
        districtOfficeEmail: email,
        status: "Active"
      });
    }
  }

  // 2. Build House of Reps seats (exactly 360)
  const unusedCurrentReps = [...currentReps];
  for (const state of NIGERIAN_STATES) {
    const seatCount = REPRESENTATIVE_ALLOCATION[state] || 5;
    for (let i = 1; i <= seatCount; i++) {
      // Try to find any remaining Rep for this state
      const idx = unusedCurrentReps.findIndex(
        r => r.state.toLowerCase() === state.toLowerCase()
      );

      if (idx !== -1) {
        // Use existing Representative
        const matched = unusedCurrentReps.splice(idx, 1)[0];
        finalReps.push(matched);
      } else {
        // Generate synthetic Representative
        const isMale = Math.random() > 0.15;
        const firstName = isMale 
          ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
          : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
        const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
        const name = `Hon. ${firstName} ${lastName}`;
        const party = PARTIES[Math.floor(Math.random() * PARTIES.length)];
        const id = `leg-gen-rep-${state.toLowerCase()}-${i}`;
        const constituency = `${state} Federal Constituency ${i}`;

        const charCodeSum = id.split("").reduce((sum: number, c: string) => sum + c.charCodeAt(0), 0);
        const attendanceRate = 78 + (charCodeSum % 21); // 78% to 98%
        const motionsPresentedCount = 1 + (charCodeSum % 16); 
        const engagementScore = 68 + (charCodeSum % 28); 
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@reps.gov.ng`;

        finalReps.push({
          id,
          name,
          title: "Honourable",
          chamber: Chamber.HOUSE_OF_REPS,
          state,
          constituency,
          party,
          engagementScore,
          billsSponsored: [],
          attendanceRate,
          motionsPresentedCount,
          districtOfficeEmail: email,
          status: "Active"
        });
      }
    }
  }

  // Combine and sort alphabetically
  return [...finalSenators, ...finalReps];
}

export const INITIAL_LEGISLATORS: Legislator[] = generateFullRoster(DEDUPLICATED_LEGISLATORS);


function generateExtendedBills(realCount: number): Bill[] {
  const result: Bill[] = [];
  const targetTotal = 2734;
  const needed = targetTotal - realCount;

  const topics = [
    {
      category: BillCategory.CONSTITUTIONAL,
      prefix: "Constitution of the Federal Republic of Nigeria 1999 (Alteration)",
      suffixes: ["Bill", "Amendment Bill", "Statutory Reform Bill"],
      summaries: [
        "A bill to alter the provisions of the Constitution to strengthen federal governance, improve statutory transparency, and facilitate subnational operations.",
        "An alteration bill to review subnational legislative schedules, streamlining exclusive lists and local empowerment frameworks.",
        "A statutory amendment to refine electoral timelines, judicial appointments, and federal character commission guidelines."
      ],
      pros: ["Secures democratic checks and balances.", "Decentralizes redundant authority lines.", "Improves local governance oversight."],
      cons: ["Requires high coordination for state assembly concurrent passage.", "Prolongs statutory implementation phase."],
      impact: "Aligns state administration structures, streamlining citizen interaction with legal state offices.",
      finance: "Covered within annual gazette printing budgets and legislative committee allocations.",
      sectors: ["Electoral Operations", "State Assemblies", "Public Accountability"]
    },
    {
      category: BillCategory.SECURITY,
      prefix: "National Security Agency and Policing",
      suffixes: ["Amendment Bill", "Prohibition and Regulation Bill", "Oversight and Funding Bill"],
      summaries: [
        "A bill to coordinate national security operations, fund remote camera tracking, and secure Northern regional border lines.",
        "An enforcement framework to deploy cybersecurity provisions, safeguard public data assets, and train police units.",
        "A bill seeking to establish localized emergency patrol commands and elevate joint defense logistics at sea ports."
      ],
      pros: ["Coordinates fragmented surveillance divisions.", "Boosts emergency action and intervention speed.", "Reduces Northern land crossing bottlenecks."],
      cons: ["Demands substantial initial defense infrastructure funding.", "Potential jurisdictional conflicts between customs and military."],
      impact: "Enhances localized community safety, providing officers with modernized digital coordination instruments.",
      finance: "Co-funded by special ecological levies and national defense emergency allocations.",
      sectors: ["National Defense", "Public Safety", "Border Controls"]
    },
    {
      category: BillCategory.FINANCE,
      prefix: "Appropriation and Revenue Stamp Duty",
      suffixes: ["Regulation Bill", "Tax Reform and Tariff Alignment Bill", "Fiscal Management Act (Amendment) Bill"],
      summaries: [
        "A statutory guidelines bill to optimize federal customs clearing, establish tax-exempt windows for micro-businesses, and audit public treasuries.",
        "An economic reform bill to align national excise collections, minimize inflation latency, and secure trade loans.",
        "A bill designed to establish digital transaction regulatory guardrails and audit local government tax registries."
      ],
      pros: ["Standardizes clearing pipelines and reduces cargo delays.", "Expands fiscal opportunities for local micro-employers.", "Increases treasury audits and oversight transparency."],
      cons: ["Might experience initial compliance resistance from shipping lines.", "Adds reporting obligations on subnational financial agencies."],
      impact: "Lowers business setup hurdles and introduces stable fiscal predictability for formal trade markets.",
      finance: "Financed by standard efficiency savings across federal inland revenue departments.",
      sectors: ["Fiscal Appropriations", "Trade Operations", "Small Business Support"]
    },
    {
      category: BillCategory.HEALTH,
      prefix: "National Health Authority and Primary Healthcare Centre",
      suffixes: ["Funding and Access Bill", "Establishment Bill", "Service Standardization Bill"],
      summaries: [
        "A bill to expand national clinical care protocols, scale subsidized child medical checks, and establish local nursing facilities.",
        "A legislation to provide state-backed research infrastructure for epidemic controls and standardize regional medical facilities.",
        "A bill to establish community medical boards, subsidize pharmaceuticals, and expand community health practitioner qualifications."
      ],
      pros: ["Slashes child care mortality metrics in rural communities.", "Upgrades equipment and medical supplies consistency.", "Elevates remote telemedicine infrastructure and clinical standards."],
      cons: ["Requires initial capital for hospital upgrades.", "Involves lengthy recruitment training skills for practitioners."],
      impact: "Significantly decreases out-of-pocket health costs for underserved rural households.",
      finance: "Statutorily backed by the National Health Insurance Fund and regional health grants.",
      sectors: ["Primary Healthcare", "Pharmaceuticals", "Rural Wellness"]
    },
    {
      category: BillCategory.EDUCATION,
      prefix: "Student Loan and Tertiary Educational Quality",
      suffixes: ["Access and Standards Bill", "Vocational Training Promotion Bill", "Trust Fund Establishment Bill"],
      summaries: [
        "A bill to streamline tertiary education loans, expand online study portals, and establish vocational talent registries.",
        "An administrative bill to fund technical incubation hubs and empower young enterprise founders.",
        "A legislation seeking to elevate national academic standard audits and construct standard science lab centers in secondary schools."
      ],
      pros: ["Unlocks tertiary educational options for low-income youths.", "Increases vocational skill sets and post-graduate career pipelines.", "Modernizes digital academic registries and certificates."],
      cons: ["Depends on steady financial corporate tax allocation streams.", "Requires multi-state implementation guidelines."],
      impact: "Raises secondary and tertiary graduate employability metrics nationwide.",
      finance: "Funded via a 1% statutory interest levy on telecommunication and bank profit margins.",
      sectors: ["Higher Education", "Skill Development", "Youth Employment"]
    },
    {
      category: BillCategory.INFRASTRUCTURE,
      prefix: "Electricity Act and National Transport Network",
      suffixes: ["Regulation and Decoupling Bill", "Expansion Bill", "Security and Maintenance Bill"],
      summaries: [
        "A bill to decouple embedded power distribution, grant subnational licensing authorities, and protect rail cables from sabotage.",
        "An infrastructure bill seeking to establish deep-sea harbor standards and fund federal route repairs.",
        "A strategic framework to deploy intelligent transport sensors and optimize rural-urban power transmission lines."
      ],
      pros: ["Speeds up local off-grid solar and micro-hydro deployments.", "Imposes severe legal penalties (up to 10 years) for grid sabotage.", "Reduces federal logjam by delegating licensing to state bodies."],
      cons: ["May create pricing inconsistencies across subnational territories.", "Requires heavy private capital investment backing."],
      impact: "Boosts manufacturing productivity and cuts down logistical transit delays for farm produce.",
      finance: "Sourced through infrastructure bonds and public-private partnership (PPP) frameworks.",
      sectors: ["Power Distribution", "Civil Logistics", "Manufacturing"]
    },
    {
      category: BillCategory.JUSTICE,
      prefix: "Criminal Code and Legal Aid Service",
      suffixes: ["Modernization Bill", "Equal Opportunity and Rights Bill", "Judicial Procedure Reform Bill"],
      summaries: [
        "A bill to reform national prison overcrowding, expand public legal defenders, and secure child civil liberties.",
        "An action framework to outlaw workplace discrimination, elevate gender payroll equity, and secure civic assembly rights.",
        "A fast-track adjudication bill matching trial processes with modernized remote witness digital testimonies."
      ],
      pros: ["Reduces the number of un-sentenced suspects in correctional facilities.", "Standardizes workplace representation and salary transparency.", "Reduces backlogs through smart digital registry integrations."],
      cons: ["Requires initial IT equipment deployment in local courts.", "Needs intensive legal training for state court operators."],
      impact: "Improves rule of law and accelerates citizens' access to timely, high-fidelity legal aid.",
      finance: "Financed by direct allocations under the Ministry of Justice and police budget lines.",
      sectors: ["Judicial Framework", "Civil Protection", "Correctional Facilities"]
    },
    {
      category: BillCategory.AGRICULTURE,
      prefix: "Food Sovereignty and Soil Erosion Restoration",
      suffixes: ["Empowerment Bill", "Crisis Control and Funding Bill", "Rural Fertilizer Support Bill"],
      summaries: [
        "A bill to fund regional gully erosion barriers, subsidize organic crop nutrients, and coordinate farm security teams.",
        "An environment bill to impose strict industrial emission limits and secure rural groundwater wells.",
        "A strategic program to modernize agro-processing plants and grant credit to cooperative farmers."
      ],
      pros: ["Mitigates severe soil degradation and landslides in southern states.", "Improves smallholder yield metrics through subsidized resources.", "Enforces high accountability on agro-processing waste disposal."],
      cons: ["Operational rollouts might experience initial transport delays.", "Involves high monitoring costs in remote agricultural zones."],
      impact: "Guarantees crop security, lowering urban food inflation trends over a 3-year cycle.",
      finance: "Statutorily backed by the Federal Ecological Fund and rural development grants.",
      sectors: ["Crop Production", "Ecological Restoration", "Agro-Industries"]
    }
  ];

  const getPseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const stages = [
    { stage: LegislativeStage.FIRST_READING, progress: 15 },
    { stage: LegislativeStage.SECOND_READING, progress: 35 },
    { stage: LegislativeStage.COMMITTEE_ASSIGNMENT, progress: 55 },
    { stage: LegislativeStage.REPORT, progress: 70 },
    { stage: LegislativeStage.THIRD_READING, progress: 85 },
    { stage: LegislativeStage.HARMONIZATION, progress: 92 },
    { stage: LegislativeStage.ASSENT, progress: 100 }
  ];

  for (let idx = 1; idx <= needed; idx++) {
    const seed = idx + 10000;
    const r1 = getPseudoRandom(seed);
    const r2 = getPseudoRandom(seed + 1);
    const r3 = getPseudoRandom(seed + 2);
    const r4 = getPseudoRandom(seed + 3);
    const r5 = getPseudoRandom(seed + 4);

    const topicObj = topics[Math.floor(r1 * topics.length)];
    const legisl = INITIAL_LEGISLATORS[Math.floor(r2 * INITIAL_LEGISLATORS.length)];
    
    let stageObj = stages[0];
    if (r3 < 0.40) stageObj = stages[0];
    else if (r3 < 0.65) stageObj = stages[1];
    else if (r3 < 0.80) stageObj = stages[2];
    else if (r3 < 0.88) stageObj = stages[3];
    else if (r3 < 0.94) stageObj = stages[4];
    else if (r3 < 0.98) stageObj = stages[5];
    else stageObj = stages[6];

    const year = 2023 + Math.floor(r4 * 3);
    const month = 1 + Math.floor(r5 * 12);
    const day = 1 + Math.floor(getPseudoRandom(seed + 5) * 28);
    
    const doubleDigits = (n: number) => n < 10 ? `0${n}` : `${n}`;
    const dateProposed = `${year}-${doubleDigits(month)}-${doubleDigits(day)}`;
    const lastUpdated = `${year + (stageObj.progress === 100 ? 1 : 0)}-${doubleDigits((month + 2) % 12 || 12)}-${doubleDigits(day)}`;

    const pType = legisl.chamber === Chamber.SENATE ? "SB" : "HB";
    const billNumVal = 100 + (idx % 1200);
    const billNumber = `${pType} ${billNumVal}`;
    const id = `bill-gen-${idx}`;

    const titleSuffix = topicObj.suffixes[Math.floor(r4 * topicObj.suffixes.length)];
    const fullTitle = `A Bill for an Act to Provide for the ${topicObj.prefix} (${titleSuffix}) and to Empower Statutory Alignments of Governance Codes for Nigeria.`;
    const title = `${topicObj.prefix} (${titleSuffix}), ${year}`;

    const currentIdx = stages.findIndex(st => st.stage === stageObj.stage);
    const timeline = stages.map((st, i) => {
      const completed = i <= currentIdx;
      return {
        stage: st.stage,
        date: completed ? (i === currentIdx ? lastUpdated : dateProposed) : "",
        note: completed ? `${st.stage} milestones completed and recorded.` : `Awaiting preceding actions.`,
        completed
      };
    });

    const vFor = Math.floor(52 + (getPseudoRandom(seed + 6) * 210));
    const vAgainst = Math.floor(4 + (getPseudoRandom(seed + 7) * 45));

    const summaryIndex = Math.floor(getPseudoRandom(seed + 8) * topicObj.summaries.length);
    const summaryText = topicObj.summaries[summaryIndex];

    const aiAnalysis = {
      summary: `A legal framework proposal evaluating public operations and establishing guidelines. It addresses institutional parameters in ${topicObj.category} to ensure accountability and standards across states.`,
      publicImpact: topicObj.impact,
      financialImplication: topicObj.finance,
      pros: topicObj.pros,
      cons: topicObj.cons,
      sectorsAffected: topicObj.sectors,
      overallRating: 68 + Math.floor(getPseudoRandom(seed + 9) * 26)
    };

    result.push({
      id,
      billNumber,
      title,
      fullTitle,
      sponsorId: legisl.id,
      sponsorName: legisl.name,
      sponsorChamber: legisl.chamber,
      chamberOfOrigin: legisl.chamber,
      category: topicObj.category,
      currentStage: stageObj.stage,
      stageProgress: stageObj.progress,
      dateProposed,
      lastUpdated,
      summary: summaryText,
      timeline,
      aiAnalysis,
      votesFor: vFor,
      votesAgainst: vAgainst,
      tags: [topicObj.category, legisl.chamber === Chamber.SENATE ? "Senate Draft" : "Reps Draft"]
    });

    if (!legisl.billsSponsored) legisl.billsSponsored = [];
    if (!legisl.billsSponsored.includes(id)) {
      legisl.billsSponsored.push(id);
    }
  }

  return result;
}

const realMappedBills: Bill[] = (PLAC_BILLS_REAL as any[]).map((b: any) => {
  return {
    ...b,
    sponsorChamber: b.sponsorChamber === "Senate" ? Chamber.SENATE : Chamber.HOUSE_OF_REPS,
    chamberOfOrigin: b.chamberOfOrigin === "Senate" ? Chamber.SENATE : Chamber.HOUSE_OF_REPS,
  } as Bill;
});

realMappedBills.forEach(b => {
  const legisl = INITIAL_LEGISLATORS.find(l => l.id === b.sponsorId);
  if (legisl) {
    if (!legisl.billsSponsored) legisl.billsSponsored = [];
    if (!legisl.billsSponsored.includes(b.id)) {
      legisl.billsSponsored.push(b.id);
    }
  }
});

const syntheticBills = generateExtendedBills(realMappedBills.length);

export const INITIAL_BILLS: Bill[] = [...realMappedBills, ...syntheticBills];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: "rev-1",
    billId: "bill-elec-2024",
    userName: "Chinedu Okafor",
    rating: 5,
    comment: "This is a fantastic legislation! In Enugu, our state assembly is already starting to license local solar grids. We've had steady power for 3 weeks straight in our industrial layout because of state grids!",
    timestamp: "2024-03-02T10:30:00Z"
  },
  {
    id: "rev-2",
    billId: "bill-elec-2024",
    userName: "Aminu Ibrahim",
    rating: 4,
    comment: "Excellent idea to increase penalties for grid sabotage. Cabling thieves have thrown our entire state into blackout twice this year. Let them stay in jail!",
    timestamp: "2024-03-05T14:22:00Z"
  },
  {
    id: "rev-3",
    billId: "bill-state-police",
    userName: "Oluwaseun Adebayo",
    rating: 3,
    comment: "On paper, state police solves everything because community policing is better. But I'm very scared some of these governors will use the state police to terrorize political rivals and rigging elections.",
    timestamp: "2024-04-12T18:15:00Z"
  },
  {
    id: "rev-4",
    billId: "bill-wage-2024",
    userName: "Nneka Nwosu",
    rating: 4,
    comment: "₦70,000 is good compared to ₦30,000, but with inflation and gas prices, buying basic food currently eats up the entire salary in 5 days. We need price controls together with minimum wage.",
    timestamp: "2024-08-01T08:45:00Z"
  }
];
