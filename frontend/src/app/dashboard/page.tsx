"use client";

import * as React from "react";
import { 
  Shield, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle, 
  ArrowDownRight, 
  ArrowUpRight 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { useHistoryStore } from "@/store/historyStore";

type Timeframe = "24h" | "7d" | "30d";

const chartSeries: Record<Timeframe, { day: string; Emails: number; SMS: number; Calls: number; Documents: number; Fraud: number }[]> = {
  "24h": [
    { day: "00:00", Emails: 12, SMS: 30, Calls: 4, Documents: 2, Fraud: 3 },
    { day: "04:00", Emails: 8, SMS: 18, Calls: 2, Documents: 1, Fraud: 1 },
    { day: "08:00", Emails: 42, SMS: 88, Calls: 14, Documents: 7, Fraud: 9 },
    { day: "12:00", Emails: 65, SMS: 132, Calls: 22, Documents: 11, Fraud: 14 },
    { day: "16:00", Emails: 58, SMS: 120, Calls: 19, Documents: 9, Fraud: 11 },
    { day: "20:00", Emails: 31, SMS: 64, Calls: 9, Documents: 4, Fraud: 6 }
  ],
  "7d": [
    { day: "Mon", Emails: 120, SMS: 340, Calls: 50, Documents: 24, Fraud: 18 },
    { day: "Tue", Emails: 180, SMS: 290, Calls: 65, Documents: 32, Fraud: 24 },
    { day: "Wed", Emails: 150, SMS: 410, Calls: 80, Documents: 28, Fraud: 15 },
    { day: "Thu", Emails: 210, SMS: 480, Calls: 72, Documents: 41, Fraud: 32 },
    { day: "Fri", Emails: 260, SMS: 520, Calls: 95, Documents: 35, Fraud: 45 },
    { day: "Sat", Emails: 110, SMS: 210, Calls: 40, Documents: 15, Fraud: 8 },
    { day: "Sun", Emails: 90, SMS: 180, Calls: 30, Documents: 12, Fraud: 12 }
  ],
  "30d": [
    { day: "Week 1", Emails: 820, SMS: 1980, Calls: 340, Documents: 148, Fraud: 96 },
    { day: "Week 2", Emails: 940, SMS: 2140, Calls: 402, Documents: 165, Fraud: 118 },
    { day: "Week 3", Emails: 1120, SMS: 2460, Calls: 388, Documents: 190, Fraud: 134 },
    { day: "Week 4", Emails: 1310, SMS: 2680, Calls: 455, Documents: 212, Fraud: 151 }
  ]
};

const timeframeLabels: Record<Timeframe, string> = {
  "24h": "24 Hours",
  "7d": "7 Days",
  "30d": "30 Days"
};

const channelFilters = [
  { key: "all", label: "All" },
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "call", label: "Voice" }
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState<Timeframe>("7d");
  const [channelFilter, setChannelFilter] = React.useState("all");

  const scans = useHistoryStore((state) => state.scans);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats from Zustand scans
  const totalScanned = scans.length;
  const criticalScans = scans.filter((s) => s.verdict === "Critical").length;
  const warningScans = scans.filter((s) => s.verdict === "Warning").length;

  const chartData = chartSeries[timeframe];
  const periodScans = chartData.reduce((sum, row) => sum + row.Emails + row.SMS + row.Calls + row.Documents, 0);
  const periodFraud = chartData.reduce((sum, row) => sum + row.Fraud, 0);

  const emailCount = scans.filter((s) => s.type === "email").length;
  const smsCount = scans.filter((s) => s.type === "sms").length;
  const callCount = scans.filter((s) => s.type === "call").length;
  const docCount = scans.filter((s) => s.type === "document").length;

  // Filter recent scans
  const filteredScans = scans.filter((s) => {
    if (channelFilter === "all") return true;
    return s.type === channelFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Security Overview</h2>
            <p className="text-xs text-gray-500 font-medium">Real-time indicators across communication vectors.</p>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-1.5 bg-gray-900/60 border border-white/5 p-1 rounded-xl">
              {(Object.keys(timeframeLabels) as Timeframe[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTimeframe(key)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-colors cursor-pointer ${timeframe === key ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
                >
                  {timeframe === key && (
                    <motion.span
                      layoutId="timeframe-pill"
                      className="absolute inset-0 rounded-lg bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{timeframeLabels[key]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Counter Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          
          <motion.div variants={cardVariants}>
          <Card className="border-white/5 h-full flex flex-col justify-between" glow>
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">System Scans</CardTitle>
              <Shield className="h-4.5 w-4.5 text-primary" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono"><CountUp value={totalScanned} /></div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowUpRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">+12%</span> vs last week
              </p>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
          <Card className="border-white/5 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">Threats Flagged</CardTitle>
              <AlertOctagon className="h-4.5 w-4.5 text-danger animate-pulse" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-red-500 font-mono"><CountUp value={criticalScans + warningScans} /></div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <span className="text-danger font-semibold mr-1">High Risk</span> action suggested
              </p>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
          <Card className="border-white/5 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">Platform Accuracy</CardTitle>
              <CheckCircle className="h-4.5 w-4.5 text-safe" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono"><CountUp value={99.4} decimals={1} suffix="%" /></div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowUpRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">0.05%</span> improvement
              </p>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
          <Card className="border-white/5 h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">False Positives</CardTitle>
              <TrendingUp className="h-4.5 w-4.5 text-secondary" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono"><CountUp value={0.12} decimals={2} suffix="%" /></div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowDownRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">Lower</span> than threshold
              </p>
            </CardContent>
          </Card>
          </motion.div>

        </motion.div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Traffic Chart */}
          <Card className="lg:col-span-2 border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-display flex items-center justify-between">
                <span>Vector Security Metrics</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {timeframeLabels[timeframe]}
                </span>
              </CardTitle>
              <CardDescription>
                {periodScans.toLocaleString()} transactions plotted by vector type over the selected window.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <motion.div key={timeframe} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSMS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(17, 24, 39, 0.95)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="Emails" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorEmails)" />
                  <Area type="monotone" dataKey="SMS" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorSMS)" />
                </AreaChart>
              </ResponsiveContainer>
              </motion.div>
            </CardContent>
          </Card>

          {/* Fraud Attempt chart */}
          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-display">Fraud Attempts Intercepted</CardTitle>
              <CardDescription>
                <CountUp value={periodFraud} /> verified fraud attempts across all layers.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <motion.div key={timeframe} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(17, 24, 39, 0.95)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }} 
                  />
                  <Bar dataKey="Fraud" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              </motion.div>
            </CardContent>
          </Card>

        </div>

        {/* Live Channel Breakdowns & Active Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Vector distribution ratios */}
          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-display">Threat Vector Distribution</CardTitle>
              <CardDescription>Scan volumes split by ingestion vector.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3.5">
                {[
                  { name: "Email Integrity Portal", count: emailCount, pct: totalScanned ? (emailCount / totalScanned) * 100 : 0, color: "bg-primary", icon: Mail },
                  { name: "SMS Security Gate", count: smsCount, pct: totalScanned ? (smsCount / totalScanned) * 100 : 0, color: "bg-secondary", icon: MessageSquare },
                  { name: "Voice Transcriptions", count: callCount, pct: totalScanned ? (callCount / totalScanned) * 100 : 0, color: "bg-accent", icon: PhoneCall },
                  { name: "Document Vault Analyzer", count: docCount, pct: totalScanned ? (docCount / totalScanned) * 100 : 0, color: "bg-safe", icon: FileText }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 flex items-center">
                          <Icon className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {item.name}
                        </span>
                        <span className="font-semibold text-white font-mono">{item.count} ({item.pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card className="lg:col-span-2 border-white/5 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white font-display">Active Verification Ledger</CardTitle>
                <CardDescription>Recent transaction scans. Click to filter by channel.</CardDescription>
              </div>

              <div className="flex items-center space-x-2 bg-gray-900/60 border border-white/5 p-1 rounded-xl text-xs font-semibold">
                {channelFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setChannelFilter(filter.key)}
                    className={`relative px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${channelFilter === filter.key ? "text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    {channelFilter === filter.key && (
                      <motion.span
                        layoutId="channel-pill"
                        className="absolute inset-0 rounded-lg bg-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{filter.label}</span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
              <div className="divide-y divide-white/5 border-t border-white/5">
                <AnimatePresence mode="popLayout" initial={false}>
                {filteredScans.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">No active scans matched criteria.</div>
                ) : (
                  filteredScans.map((scan) => {
                    const isEmail = scan.type === "email";
                    const isSms = scan.type === "sms";
                    const isCall = scan.type === "call";
                    
                    return (
                      <motion.div
                        key={scan.id}
                        layout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.25 }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        className="px-6 py-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            isEmail ? "bg-primary/10 text-primary" : isSms ? "bg-secondary/10 text-secondary" : isCall ? "bg-accent/10 text-accent" : "bg-safe/10 text-safe"
                          }`}>
                            {isEmail && <Mail className="h-4 w-4" />}
                            {isSms && <MessageSquare className="h-4 w-4" />}
                            {isCall && <PhoneCall className="h-4 w-4" />}
                            {scan.type === "document" && <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white leading-snug">
                              {isEmail && scan.details.senderReputation || isSms && "SMS alert target " + scan.details.urgencyLevel + " urgency" || isCall && "Call: " + scan.details.callerName || "Document: " + scan.details.fileName}
                            </p>
                            <span className="text-[9px] text-gray-500 font-medium block mt-0.5 font-mono">{new Date(scan.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-xs font-bold text-white font-mono block">{scan.score}%</span>
                            <span className="text-[9px] text-gray-500 font-semibold font-display tracking-wider">FRAUD SCORE</span>
                          </div>

                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-display uppercase border ${
                            scan.verdict === "Critical" 
                              ? "bg-danger/10 text-danger border-danger/25" 
                              : scan.verdict === "Warning" 
                                ? "bg-warning/10 text-warning border-warning/25" 
                                : "bg-safe/10 text-safe border-safe/25"
                          }`}>
                            {scan.verdict}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}
