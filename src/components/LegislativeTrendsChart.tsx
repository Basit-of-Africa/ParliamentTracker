/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { Bill, LegislativeStage } from "../types";
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  FilePlus2, 
  BarChart3,
  Percent,
  Sparkles
} from "lucide-react";

interface LegislativeTrendsChartProps {
  bills: Bill[];
  defaultYear?: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthlyDataPoint {
  monthIndex: number;
  month: string;
  fullMonth: string;
  introduced: number;
  passed: number;
  rate: number;
}

export default function LegislativeTrendsChart({ 
  bills, 
  defaultYear = 2026 
}: LegislativeTrendsChartProps) {
  // Available years from dataset + default to 2026
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    yearsSet.add(2026);
    yearsSet.add(2025);
    yearsSet.add(2024);

    bills.forEach((bill) => {
      if (bill.dateProposed) {
        const yr = new Date(bill.dateProposed).getFullYear();
        if (!isNaN(yr) && yr >= 2020 && yr <= 2030) {
          yearsSet.add(yr);
        }
      }
    });

    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [bills]);

  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [activeMetric, setActiveMetric] = useState<"all" | "introduced" | "passed">("all");

  // Aggregate monthly trends data
  const { monthlyData, yearTotals } = useMemo(() => {
    // Initialize 12 months array
    const monthsMap: { [key: number]: { introduced: number; passed: number } } = {};
    for (let i = 0; i < 12; i++) {
      monthsMap[i] = { introduced: 0, passed: 0 };
    }

    let totalIntroducedYear = 0;
    let totalPassedYear = 0;

    bills.forEach((bill) => {
      // 1. Check Introduction Date
      if (bill.dateProposed) {
        const introDate = new Date(bill.dateProposed);
        if (!isNaN(introDate.getTime()) && introDate.getFullYear() === selectedYear) {
          const m = introDate.getMonth();
          if (m >= 0 && m < 12) {
            monthsMap[m].introduced += 1;
            totalIntroducedYear += 1;
          }
        }
      }

      // 2. Check Passing Date
      const isPassed = 
        bill.currentStage === LegislativeStage.ASSENT || 
        bill.stageProgress === 100;

      if (isPassed) {
        // Try to get specific date of assent from timeline
        let passedDateStr = "";
        if (bill.timeline && bill.timeline.length > 0) {
          const assentEvent = bill.timeline.find(
            (t) => t.stage === LegislativeStage.ASSENT && t.completed && t.date
          );
          if (assentEvent?.date) {
            passedDateStr = assentEvent.date;
          } else {
            const thirdReading = bill.timeline.find(
              (t) => t.stage === LegislativeStage.THIRD_READING && t.completed && t.date
            );
            if (thirdReading?.date) {
              passedDateStr = thirdReading.date;
            }
          }
        }

        if (!passedDateStr && bill.lastUpdated) {
          passedDateStr = bill.lastUpdated;
        } else if (!passedDateStr && bill.dateProposed) {
          passedDateStr = bill.dateProposed;
        }

        if (passedDateStr) {
          const pDate = new Date(passedDateStr);
          if (!isNaN(pDate.getTime()) && pDate.getFullYear() === selectedYear) {
            const m = pDate.getMonth();
            if (m >= 0 && m < 12) {
              monthsMap[m].passed += 1;
              totalPassedYear += 1;
            }
          }
        }
      }
    });

    // Format for recharts
    const chartData: MonthlyDataPoint[] = MONTH_NAMES.map((name, idx) => {
      const intro = monthsMap[idx].introduced;
      const pass = monthsMap[idx].passed;
      const rate = intro > 0 ? Math.round((pass / intro) * 100) : 0;
      return {
        monthIndex: idx,
        month: name,
        fullMonth: FULL_MONTH_NAMES[idx],
        introduced: intro,
        passed: pass,
        rate
      };
    });

    // Find peak month
    let peakIntroMonth = "N/A";
    let maxIntro = -1;
    chartData.forEach((d) => {
      if (d.introduced > maxIntro) {
        maxIntro = d.introduced;
        peakIntroMonth = d.fullMonth;
      }
    });

    const overallRate = totalIntroducedYear > 0 
      ? Math.round((totalPassedYear / totalIntroducedYear) * 100) 
      : 0;

    return {
      monthlyData: chartData,
      yearTotals: {
        introduced: totalIntroducedYear,
        passed: totalPassedYear,
        passageRate: overallRate,
        peakMonth: peakIntroMonth,
        peakCount: maxIntro > 0 ? maxIntro : 0
      }
    };
  }, [bills, selectedYear]);

  // Custom recharts tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md text-xs font-sans min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
            <span className="font-extrabold text-slate-200 text-sm font-display">
              {dataPoint.fullMonth} {selectedYear}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              10th Assembly
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-xs shadow-blue-500/50" />
                <span>Introduced Bills:</span>
              </span>
              <span className="font-mono font-bold text-sm text-white">
                {dataPoint.introduced.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-500/50" />
                <span>Passed / Assented:</span>
              </span>
              <span className="font-mono font-bold text-sm text-white">
                {dataPoint.passed.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Conversion Ratio:</span>
              <span className="font-mono font-bold text-amber-300">
                {dataPoint.rate}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6"
      id="legislative-trends-chart-section"
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-150/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold tracking-tight uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Annual Parliamentary Dynamics</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
            <span>Legislative Velocity Trend</span>
            <span className="text-blue-600 text-lg md:text-xl font-normal font-sans">
              ({selectedYear})
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
            Monthly progression comparing newly gazetted bill introductions against passed acts assented into law.
          </p>
        </div>

        {/* Right Controls: Year Selector & View Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200" id="year-selector-tabs">
            {availableYears.map((yr) => {
              const isCurrent = yr === 2026;
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  id={`year-tab-${yr}`}
                >
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{yr}</span>
                  {isCurrent && (
                    <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200" id="metric-toggle-group">
            <button
              onClick={() => setActiveMetric("all")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMetric === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setActiveMetric("introduced")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMetric === "introduced"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Introductions
            </button>
            <button
              onClick={() => setActiveMetric("passed")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMetric === "passed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Passings
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5" id="trend-summary-kpis">
        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <FilePlus2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Introduced ({selectedYear})</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold font-display text-slate-900">
              {yearTotals.introduced.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Bills</span>
          </div>
        </div>

        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passed / Assented</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold font-display text-emerald-600">
              {yearTotals.passed.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Acts</span>
          </div>
        </div>

        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              <span>Passage Efficiency</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold font-display text-slate-900">
              {yearTotals.passageRate}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Conversion</span>
          </div>
        </div>

        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>Peak Month</span>
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-base md:text-lg font-bold font-display text-slate-900 truncate">
              {yearTotals.peakMonth}
            </span>
            {yearTotals.peakCount > 0 && (
              <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">
                ({yearTotals.peakCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Visual Line Chart Canvas */}
      <div className="w-full h-80 sm:h-96 pt-2 select-none" id="recharts-linechart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyData}
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              vertical={false} 
            />
            
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              dy={8}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              allowDecimals={false}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingBottom: "10px", fontSize: "12px", fontWeight: 600 }}
              formatter={(value) => {
                if (value === "introduced") return <span className="text-slate-700 mr-4">Introduced Bills</span>;
                if (value === "passed") return <span className="text-slate-700">Passed / Assented Acts</span>;
                return value;
              }}
            />

            {/* Introduced Bills Line */}
            {(activeMetric === "all" || activeMetric === "introduced") && (
              <Line
                type="monotone"
                dataKey="introduced"
                name="introduced"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#1d4ed8", stroke: "#dbeafe", strokeWidth: 3 }}
                animationDuration={900}
              />
            )}

            {/* Passed Bills Line */}
            {(activeMetric === "all" || activeMetric === "passed") && (
              <Line
                type="monotone"
                dataKey="passed"
                name="passed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#059669", stroke: "#d1fae5", strokeWidth: 3 }}
                animationDuration={900}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            Data grounded in official Tenth National Assembly Hansards and Federal Ministry of Information gazettes.
          </span>
        </div>
        <span className="font-mono text-slate-400">
          Sync Cycle: Real-time
        </span>
      </div>
    </section>
  );
}
