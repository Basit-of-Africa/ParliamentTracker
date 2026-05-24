/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chamber, PoliticalParty, BillCategory, LegislativeStage, Bill, Legislator, UserReview } from "./types";

export const INITIAL_LEGISLATORS: Legislator[] = [
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
  // Representatives (Honourables)
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
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: "bill-elec-2024",
    billNumber: "SB 421",
    title: "Electricity Act (Amendment) Bill, 2024",
    sponsorId: "leg-akpabio",
    sponsorName: "Senator Godswill Obot Akpabio",
    sponsorChamber: Chamber.SENATE,
    chamberOfOrigin: Chamber.SENATE,
    category: BillCategory.INFRASTRUCTURE,
    currentStage: LegislativeStage.ASSENTED,
    stageProgress: 100,
    dateProposed: "2024-01-16",
    lastUpdated: "2024-02-23",
    summary: "An Act to amend the Electricity Act 2023 to address funding deficits, de-monopolize microgrids, grant sovereign backing to decentralization licenses for states, and impose heavier criminal penalties for grid sabotage.",
    fullTitle: "A Bill for an Act to Amend the Electricity Act, 2023 to Provide a New Framework for the Regulation, Administration, and Decoupling of Electricity Distribution Licenses, and to Empower State Legislative Powers Over Embedded Power Options and for Related Matters.",
    tags: ["Electricity", "Infrastructure", "Power", "Economic Reform"],
    votesFor: 91,
    votesAgainst: 4,
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-01-16", note: "Presented on the floor of the Senate and read of the first time.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-01-30", note: "Debated, passed second reading. Referred to Joint Committee on Power.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-02-08", note: "Public hearings conducted. Stakeholders including state governments represented.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "2024-02-14", note: "Report laid on table, clause-by-clause evaluation completed.", completed: true },
      { stage: LegislativeStage.THIRD_READING, date: "2024-02-18", note: "Passed Senate with supermajority.", completed: true },
      { stage: LegislativeStage.CONCURRENCE, date: "2024-02-20", note: "House of Representatives agreed, passing identical text.", completed: true },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "2024-02-22", note: "Transmitted to the President for signature.", completed: true },
      { stage: LegislativeStage.ASSENTED, date: "2024-02-23", note: "Signed by President Bola Ahmed Tinubu and gazetted.", completed: true }
    ],
    aiAnalysis: {
      summary: "This bill decentralizes Nigeria's historically state-run grid by empowering sub-national governments (States) to license full mini-grid and distribution clusters within municipal territories. It also increases strict compliance obligations.",
      publicImpact: "Will accelerate clean energy projects, reduce dependency on the failed national grid, and allow state-specific electricity tariff rules.",
      financialImplication: "Generates private infrastructure investments upwards of $2.1B; might raise municipal tariffs locally in some states due to gas subsidy phase-outs.",
      pros: [
        "Slashes licensing bureaucracy for commercial solar and micro-hydro grids.",
        "Imposes severe imprisonment penalties (up to 12 years) for grid sabotage or raw material theft.",
        "Allows states to formulate independent electricity regulatory commissions."
      ],
      cons: [
        "Creates regulatory divergence and duplication between federal and state grid bodies.",
        "Unbalanced distribution tariffs may cause pricing inequalities across state borders."
      ],
      sectorsAffected: ["Power & Gas Utilities", "Private Equity", "Local SMES", "Manufacturing"],
      overallRating: 85
    }
  },
  {
    id: "bill-wage-2024",
    billNumber: "HB 1146",
    title: "National Minimum Wage (Amendment) Bill, 2024",
    sponsorId: "leg-akpabio",
    sponsorName: "Senator Godswill Obot Akpabio",
    sponsorChamber: Chamber.SENATE,
    chamberOfOrigin: Chamber.HOUSE_OF_REPS,
    category: BillCategory.FINANCE,
    currentStage: LegislativeStage.ASSENTED,
    stageProgress: 100,
    dateProposed: "2024-07-23",
    lastUpdated: "2024-07-29",
    summary: "An Act to prescribe a national minimum wage of ₦70,000 for workers, provide a review window every three years, and bind all corporate and micro-employers with over 5 employees to this statutory rate.",
    fullTitle: "A Bill for an Act to Prescribe a National Minimum Wage for Workers, Amend Key Exclusionary Clauses of the Principal Act, and Shorten the Periodic Review Cycle from Five Years to Three Years, and for Related Matters.",
    tags: ["Labor", "Minimum Wage", "Wages", "Inflation", "Economy"],
    votesFor: 341,
    votesAgainst: 12,
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-07-23", note: "Transmitted directly. Read the first time in both chambers under expedited rules.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-07-23", note: "Suspended standard standing rules to debate on the merits immediately. Passed.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-07-24", note: "Expedited executive session review. Addressed organized labor constraints.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "2024-07-24", note: "Adopted clause-by-clause amendments.", completed: true },
      { stage: LegislativeStage.THIRD_READING, date: "2024-07-24", note: "Passed in parallel by Senate and House.", completed: true },
      { stage: LegislativeStage.CONCURRENCE, date: "2024-07-25", note: "Concurred seamlessly due to joint executive negotiation.", completed: true },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "2024-07-26", note: "Transmitted to Aso Rock Villa.", completed: true },
      { stage: LegislativeStage.ASSENTED, date: "2024-07-29", note: "Signed into law by President Bola Ahmed Tinubu at the State House.", completed: true }
    ],
    aiAnalysis: {
      summary: "This legislation updates the baseline salary rate to ₦70k per month, effectively raising it from ₦30k to cope with the removal of fuel subsidies and devaluation of the Naira.",
      publicImpact: "Direct salary boost for low-income public servants and formal private sector workers, offset by massive nationwide inflation.",
      financialImplication: "Significant municipal budgeting expansion for states, with risks of public sector retrenchment or staff scaling in revenue-poor states.",
      pros: [
        "Substantially raises the baseline standard of living for government and regular workers.",
        "Installs a 3-year statutory review window to match currency inflation trends.",
        "Strengthens labor unions' negotiating standing."
      ],
      cons: [
        "Could spark wage-price inflationary spiraling in unregulated retail markets.",
        "May increase unemployment if micro-enterprises struggle to absorb 133% baseline wage spikes."
      ],
      sectorsAffected: ["Civil Service", "Small and Medium Businesses", "Trade Unions", "Retail & Commerce"],
      overallRating: 78
    }
  },
  {
    id: "bill-security-border",
    billNumber: "SB 102",
    title: "Border Security and Coastal Defence Bill, 2024",
    sponsorId: "leg-ndume",
    sponsorName: "Senator Mohammed Ali Ndume",
    sponsorChamber: Chamber.SENATE,
    chamberOfOrigin: Chamber.SENATE,
    category: BillCategory.SECURITY,
    currentStage: LegislativeStage.COMMITTEE_STAGE,
    stageProgress: 35,
    dateProposed: "2024-03-12",
    lastUpdated: "2024-11-15",
    summary: "A bill to establish a specialized Joint Border Patrol Command, fund radar drones for the maritime borders, and enforce digitized visa checkpoints at land-crossing outposts in Northern regions.",
    fullTitle: "A Bill for an Act to Establish the Joint Border Patrol and Coastal Defense Infrastructure Fund, Integrate Remote Drone Reconnaissance with Custom Patrol Lines, and Fortify National Land Integrity.",
    tags: ["Security", "Borders", "Immigration", "Drones"],
    votesFor: 88,
    votesAgainst: 10,
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-03-12", note: "Introduced and read for the first time.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-04-18", note: "Extensively debated regarding the duplication with Nigeria Customs. Passed and referred.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-11-15", note: "Committee on Defense and Interior conducted site visits at Seme Border. Public submissions received.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "2026-05-20", note: "Hearing outstanding report; awaiting final compilation.", completed: false },
      { stage: LegislativeStage.THIRD_READING, date: "", note: "Awaiting primary chamber vote.", completed: false },
      { stage: LegislativeStage.CONCURRENCE, date: "", note: "", completed: false },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "", note: "", completed: false },
      { stage: LegislativeStage.ASSENTED, date: "", note: "", completed: false }
    ],
    aiAnalysis: {
      summary: "This bill seeks to coordinate customs, army, and immigration forces into a single tactical command for border defense, using tech-driven remote surveillance.",
      publicImpact: "Aims to stifle arms trafficking and unauthorized migration, directly alleviating banditry across Northern borders.",
      financialImplication: "Projected annual cost of ₦450 Billion, sourced from a 0.5% levy on imported non-essential cargo.",
      pros: [
        "Unifies fragmented agencies under a unified tactical headquarters.",
        "Mandates deployment of AI-supported radar drones for swamp and desert regions."
      ],
      cons: [
        "Significant jurisdictional conflicts between Custom Command and Navy/Immigration.",
        "Could disrupt localized cross-border food and commodity commerce, raising prices."
      ],
      sectorsAffected: ["National Defense", "Customs & Clearing", "Maritime Shipping", "Border Town Residents"],
      overallRating: 72
    }
  },
  {
    id: "bill-state-police",
    billNumber: "SB 294",
    title: "Constitution Amendment (State Police) Bill, 2024",
    sponsorId: "leg-abaribe",
    sponsorName: "Senator Enyinnaya Harcourt Abaribe",
    sponsorChamber: Chamber.SENATE,
    chamberOfOrigin: Chamber.SENATE,
    category: BillCategory.CONSTITUTIONAL,
    currentStage: LegislativeStage.SECOND_READING,
    stageProgress: 22,
    dateProposed: "2024-02-14",
    lastUpdated: "2024-04-10",
    summary: "A critical constitutional amendment proposed to shift licensing of police units to Concurrent Lists, enabling Nigerian States to deploy their own law enforcement structures.",
    fullTitle: "A Bill for an Act to Alter the Constitution of the Federal Republic of Nigeria 1999 (as amended) to Delete 'Police' from the Exclusive Legislative List and Include Same on the Concurrent legislative List to authorize State Assemblies to create State Police.",
    tags: ["Constitution", "State Police", "Security", "Federalism"],
    votesFor: 76,
    votesAgainst: 28,
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-02-14", note: "First Reading and publication in the official Gazette.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-04-10", note: "Passed Second Reading after highly intense debates on state financing and abuse risks. Referred to Constitutional Review Committee.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "", note: "Currently sitting in Constitutional Review Committee. Engaging with 36 State Governors.", completed: false },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "", note: "", completed: false },
      { stage: LegislativeStage.THIRD_READING, date: "", note: "", completed: false },
      { stage: LegislativeStage.CONCURRENCE, date: "", note: "", completed: false },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "", note: "", completed: false },
      { stage: LegislativeStage.ASSENTED, date: "", note: "", completed: false }
    ],
    aiAnalysis: {
      summary: "This monumental bill amends the 1999 Constitution to decentralize police forces, providing governors command authority in their state. Outlines complex multi-governance checks to avoid political weaponization by state governors.",
      publicImpact: "Major shift in security. Local officers can patrol state areas, resolving current remote and disconnected federal command schemes.",
      financialImplication: "Massive burden shift. States will bear personnel costs, potentially requiring high municipal bonds or tax allocations.",
      pros: [
        "Optimizes localized policing as officers speak the native languages and know territories.",
        "Speeds up response times for rapid domestic disturbances."
      ],
      cons: [
        "Risk of state governors turning localized police into militias against local political dissidents.",
        "Poor states may fail to regularly pay officer salaries, leading to localized corruption spikes."
      ],
      sectorsAffected: ["State Judiciary", "Civil Liberties Groups", "Federal Police", "State Cabinets"],
      overallRating: 89
    }
  },
  {
    id: "bill-digi-econ",
    billNumber: "SB 309",
    title: "Digital Economy and E-Governance Bill, 2024",
    sponsorId: "leg-abiru",
    sponsorName: "Senator Mukhail Adetokunbo Abiru",
    sponsorChamber: Chamber.SENATE,
    chamberOfOrigin: Chamber.SENATE,
    category: BillCategory.CONSTITUTIONAL,
    currentStage: LegislativeStage.COMMITTEE_STAGE,
    stageProgress: 35,
    dateProposed: "2024-05-30",
    lastUpdated: "2024-09-12",
    summary: "A bill designed to establish digital transaction regulatory guardrails, mandate public registries to enable open API interfaces, and support localized cloud hosting for all NASS data structures.",
    fullTitle: "A Bill for an Act to Provide for the Digital Economy and E-Governance Standards, Enhance Digital Literacy in Administrative Portals, Support Remote Identity Attestations, and for Connected Matters.",
    tags: ["Technology", "Digital Economy", "E-Governance", "Cloud"],
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-05-30", note: "Presented and read first time.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-07-04", note: "Passed second reading. Public applauded administrative modernization rules.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-09-12", note: "Awaiting Committee report compilation by ICT and Cyber Security Committee.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "", note: "", completed: false },
      { stage: LegislativeStage.THIRD_READING, date: "", note: "", completed: false },
      { stage: LegislativeStage.CONCURRENCE, date: "", note: "", completed: false },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "", note: "", completed: false },
      { stage: LegislativeStage.ASSENTED, date: "", note: "", completed: false }
    ],
    aiAnalysis: {
      summary: "Compels digital modernization structures inside the federal governmental departments, making digital processing legally equivalent to physical prints.",
      publicImpact: "Would slash time to obtain official documents (business registrations, passports, tax slips) by shifting to serverless e-government.",
      financialImplication: "Requires ₦75 Billion initial public cloud framework deployment, offset by cutting paper and storage logistics.",
      pros: [
        "Makes web-based remote digital contracts legally binding at all institutional levels.",
        "Compels government agencies to offer unified, web-based open API portals."
      ],
      cons: [
        "Creates massive cyber risk if servers are poorly defended.",
        "Could disenfranchise rural Nigerians lacking high-speed internet connectivity."
      ],
      sectorsAffected: ["Tech Startups", "Government Registries", "Telcos", "Cybersecurity"],
      overallRating: 81
    }
  },
  {
    id: "bill-se-commission",
    billNumber: "HB 128",
    title: "South East Development Commission Bill, 2024",
    sponsorId: "leg-kalu",
    sponsorName: "Hon. Benjamin Okezie Kalu",
    sponsorChamber: Chamber.HOUSE_OF_REPS,
    chamberOfOrigin: Chamber.HOUSE_OF_REPS,
    category: BillCategory.INFRASTRUCTURE,
    currentStage: LegislativeStage.ASSENTED,
    stageProgress: 100,
    dateProposed: "2024-02-28",
    lastUpdated: "2024-07-31",
    summary: "An Act to establish the South East Development Commission to receive statutory allocations for the reconstruction of war-damaged civil infrastructure, rehabilitation of regional erosion, and the stimulation of economic development in South East Nigeria.",
    fullTitle: "A Bill for an Act to Establish the South East Development Commission to Manage Funds Allocated for the Reconstruction and Rehabilitation of Roads, Houses, and Other Infrastructure Destroyed in the Region, and to Address Ecological and Environmental Hardships.",
    tags: ["Regional Development", "Infrastructure", "Erosion", "South East"],
    votesFor: 220,
    votesAgainst: 8,
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-02-28", note: "Introduced on House floor, read first time.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-03-14", note: "Passed second reading. Debated on ecological balance.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-04-10", note: "Referred to House Committee on Justice and Regional Matters.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "2024-05-22", note: "Layed report on table, clause-by-clause consideration passed.", completed: true },
      { stage: LegislativeStage.THIRD_READING, date: "2024-06-04", note: "Passed House. Transmitted to Senate.", completed: true },
      { stage: LegislativeStage.CONCURRENCE, date: "2024-06-11", note: "Senate concurred and passed identical legislative text.", completed: true },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "2024-07-20", note: "Transmitted to President for assent.", completed: true },
      { stage: LegislativeStage.ASSENTED, date: "2024-07-23", note: "Signed into law by President Tinubu, creating the Commission.", completed: true }
    ],
    aiAnalysis: {
      summary: "Establishes a statutory administrative commission to rebuild the South East region, funded through ecological funds and 15% equivalent allocations from member states' federation accounts.",
      publicImpact: "Promotes regional peace, rebuilds crumbling federal highways, and directly funds extensive erosion containment walls.",
      financialImplication: "Funded via 3% allocation from Federal Accounts and direct allocations from Federal Budgets, projected at ₦120B annually.",
      pros: [
        "Provides dedicated, institutional attention to severe erosion and gully ecological disasters.",
        "Helps integrate and heal historical civil war scars via direct regional reconstruction."
      ],
      cons: [
        "Adds to the high number of redundant regional commissions, potentially raising administrative overheads.",
        "Concerns on political corruption or local elite capture of reconstruction funds."
      ],
      sectorsAffected: ["Regional Real Estate", "Civil Engineering Contractors", "Ecological Control Agencies", "Subnational Finance"],
      overallRating: 75
    }
  },
  {
    id: "bill-youth-fund",
    billNumber: "HB 895",
    title: "Youth Entrepreneurship Development Trust Fund Bill, 2024",
    sponsorId: "leg-salam",
    sponsorName: "Hon. Bamidele Salam",
    sponsorChamber: Chamber.HOUSE_OF_REPS,
    chamberOfOrigin: Chamber.HOUSE_OF_REPS,
    category: BillCategory.EDUCATION,
    currentStage: LegislativeStage.CONCURRENCE,
    stageProgress: 66,
    dateProposed: "2024-04-24",
    lastUpdated: "2024-12-05",
    summary: "A bill seeking to establish a Trust Fund to provide interest-free startup capital, business training, and incubation support to young Nigerian graduates and self-employed youth.",
    fullTitle: "A Bill for an Act to Establish the Youth Entrepreneurship Development Trust Fund (YEDTF) to Provide Financial and Skill Support to Youth Entrepreneurs, Administer Loans, and for Related Matters.",
    tags: ["Youth", "Jobs", "Startups", "Trust Fund", "Loans"],
    timeline: [
      { stage: LegislativeStage.FIRST_READING, date: "2024-04-24", note: "Presented and read first time.", completed: true },
      { stage: LegislativeStage.SECOND_READING, date: "2024-06-18", note: "Debated, received positive feedback. Referred to Youth Development Committee.", completed: true },
      { stage: LegislativeStage.COMMITTEE_STAGE, date: "2024-10-15", note: "Public hearings with youth and startup founders in Abuja.", completed: true },
      { stage: LegislativeStage.REPORT_CONSIDERATION, date: "2024-11-20", note: "Adopted report, clause-by-clause amendments passed.", completed: true },
      { stage: LegislativeStage.THIRD_READING, date: "2024-12-05", note: "Passed third reading in House, transmitted to Senate.", completed: true },
      { stage: LegislativeStage.CONCURRENCE, date: "2024-12-19", note: "Senate read first time, currently scheduling Senate concurrence debate.", completed: true },
      { stage: LegislativeStage.PRESIDENTIAL_ASSENT, date: "", note: "Pending Senate concurrence and transmission.", completed: false },
      { stage: LegislativeStage.ASSENTED, date: "", note: "", completed: false }
    ],
    aiAnalysis: {
      summary: "Establishes a statutory National Trust Fund focused on raising vocational skills and financing startups for graduates, leveraging on corporate taxes.",
      publicImpact: "Could finance up to 50,000 micro-enterprises annually, stemming unemployment and reducing youth emigration.",
      financialImplication: "Funded via a 1% levy on profits of tech firms, telcos, and commercial banks in Nigeria.",
      pros: [
        "Provides non-collateral, interest-free loan structures for tech, agri, and craft businesses.",
        "Includes standard professional mentoring directly from chambers of commerce."
      ],
      cons: [
        "Levies on corporate profits might raise administrative resistance from private financial institutions.",
        "High defaults are common on unsecured microloans if post-funding tracking is weak."
      ],
      sectorsAffected: ["Venture Capital", "Vocational Schools", "Commercial Banking", "Graduate Employment"],
      overallRating: 82
    }
  }
];

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
