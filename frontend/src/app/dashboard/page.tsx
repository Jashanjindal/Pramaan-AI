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
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useHistoryStore } from "@/store/historyStore";

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const [timeframe, setTimeframe] = React.useState("7d");
  const [channelFilter, setChannelFilter] = React.useState("all");

  const scans = useHistoryStore((state) => state.scans);
  const fetchRealScans = useHistoryStore((state) => state.fetchRealScans);

  React.useEffect(() => {
    setMounted(true);
    fetchRealScans();
  }, [fetchRealScans]);

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Dynamic chart data from real scans
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day) => {
    const dayScans = scans.filter((s) => {
      const d = new Date(s.timestamp);
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
      return dayName === day;
    });
    return {
      day,
      Emails: dayScans.filter((s) => s.type === "email").length,
      SMS: dayScans.filter((s) => s.type === "sms").length,
      Calls: dayScans.filter((s) => s.type === "call" || s.type === "phone").length,
      Documents: dayScans.filter((s) => s.type === "document").length,
      Fraud: dayScans.filter((s) => s.verdict === "Critical" || s.verdict === "Warning").length
    };
  });

  // Calculate stats from Zustand scans
  const totalScanned = scans.length;
  const criticalScans = scans.filter((s) => s.verdict === "Critical").length;
  const warningScans = scans.filter((s) => s.verdict === "Warning").length;

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
              <button 
                onClick={() => setTimeframe("24h")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${timeframe === "24h" ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                24 Hours
              </button>
              <button 
                onClick={() => setTimeframe("7d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${timeframe === "7d" ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setTimeframe("30d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${timeframe === "30d" ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200"}`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="border-white/5 flex flex-col justify-between" glow>
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">System Scans</CardTitle>
              <Shield className="h-4.5 w-4.5 text-primary" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono">{totalScanned}</div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowUpRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">+12%</span> vs last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">Threats Flagged</CardTitle>
              <AlertOctagon className="h-4.5 w-4.5 text-danger animate-pulse" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-red-500 font-mono">{criticalScans + warningScans}</div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <span className="text-danger font-semibold mr-1">High Risk</span> action suggested
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">Platform Accuracy</CardTitle>
              <CheckCircle className="h-4.5 w-4.5 text-safe" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono">99.4%</div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowUpRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">0.05%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
              <CardTitle className="text-xs font-bold tracking-wider text-gray-400 uppercase font-display">False Positives</CardTitle>
              <TrendingUp className="h-4.5 w-4.5 text-secondary" />
            </CardHeader>
            <CardContent className="mt-3">
              <div className="text-2xl font-bold text-white font-mono">0.12%</div>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight flex items-center">
                <ArrowDownRight className="h-3 w-3 text-safe mr-0.5" />
                <span className="text-safe font-semibold mr-1">Lower</span> than threshold
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Traffic Chart */}
          <Card className="lg:col-span-2 border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-display">Vector Security Metrics</CardTitle>
              <CardDescription>Processed transactions plotted by vector type over the past week.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
            </CardContent>
          </Card>

          {/* Fraud Attempt chart */}
          <Card className="border-white/5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white font-display">Fraud Attempts Intercepted</CardTitle>
              <CardDescription>Daily verified fraud attempts across all layers.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
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
                <button 
                  onClick={() => setChannelFilter("all")} 
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${channelFilter === "all" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setChannelFilter("email")} 
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${channelFilter === "email" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Email
                </button>
                <button 
                  onClick={() => setChannelFilter("sms")} 
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${channelFilter === "sms" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  SMS
                </button>
                <button 
                  onClick={() => setChannelFilter("call")} 
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${channelFilter === "call" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Voice
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
              <div className="divide-y divide-white/5 border-t border-white/5">
                {filteredScans.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">No active scans matched criteria.</div>
                ) : (
                  filteredScans.map((scan) => {
                    const isEmail = scan.type === "email";
                    const isSms = scan.type === "sms";
                    const isCall = scan.type === "call";
                    
                    return (
                      <div key={scan.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-all">
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
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </DashboardLayout>
  );
}
