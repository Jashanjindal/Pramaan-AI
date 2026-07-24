"use client";

import * as React from "react";
import { Mail, MessageSquare, PhoneCall, FileText, Search, Trash2, ShieldAlert, Calendar, Eye, ShieldCheck, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { useHistoryStore, ScanResult } from "@/store/historyStore";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [mounted, setMounted] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [viewScan, setViewScan] = React.useState<ScanResult | null>(null);

  const { scans, clearHistory } = useHistoryStore();

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

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = 
      scan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.aiExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scan.details.senderReputation && scan.details.senderReputation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (scan.details.fileName && scan.details.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || scan.type === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleDownloadReport = (scan: ScanResult) => {
    const reportContent = `
PramaanAI Threat Assessment Report
==================================
Report ID: ${scan.id}
Timestamp: ${new Date(scan.timestamp).toLocaleString()}
Ingress Channel: ${scan.type.toUpperCase()}
Verdict: ${scan.verdict.toUpperCase()}
Fraud Index Score: ${scan.score}%
Confidence Rate: ${scan.confidence}%

Threat Summary:
${scan.aiExplanation}

Mitigation Protocol:
${scan.suggestedAction}
    `;

    const blob = new Blob([reportContent.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pramaan-report-${scan.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded security report for ${scan.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-display">Verification History Ledger</h2>
            <p className="text-xs text-gray-500 font-medium">Audit logs of all communications screened through PramaanAI.</p>
          </div>

          <button
            onClick={() => {
              clearHistory();
              toast.success("Audit logs cleared.");
            }}
            className="flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3.5 py-2.5 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Flush Logs</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <Card className="border-white/5 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search sender, hash, files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/50 border border-white/5 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center space-x-2 bg-gray-900/60 border border-white/5 p-1 rounded-xl text-xs font-semibold w-full md:w-auto overflow-x-auto">
            {[
              { id: "all", label: "All Items" },
              { id: "email", label: "Emails" },
              { id: "sms", label: "SMS" },
              { id: "call", label: "Voice" },
              { id: "document", label: "Documents" }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)} 
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${categoryFilter === tab.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Ledger Table List */}
        <Card className="border-white/5 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 font-display text-xs font-bold uppercase bg-black/20">
                  <th className="px-6 py-4">Ingress Channel</th>
                  <th className="px-6 py-4">Target / Metadata</th>
                  <th className="px-6 py-4">Scan Date</th>
                  <th className="px-6 py-4">Risk Rating</th>
                  <th className="px-6 py-4">Verdict</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredScans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 text-xs font-mono">No entries found matching filters.</td>
                  </tr>
                ) : (
                  filteredScans.map((scan) => {
                    const isEmail = scan.type === "email";
                    const isSms = scan.type === "sms";
                    const isCall = scan.type === "call";

                    return (
                      <tr key={scan.id} className="hover:bg-white/[0.01] transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="flex items-center space-x-2 text-xs font-medium text-white">
                            {isEmail && <Mail className="w-4 h-4 text-primary" />}
                            {isSms && <MessageSquare className="w-4 h-4 text-secondary" />}
                            {isCall && <PhoneCall className="w-4 h-4 text-accent" />}
                            {scan.type === "document" && <FileText className="w-4 h-4 text-safe" />}
                            <span className="capitalize">{scan.type}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 max-w-[200px] truncate">
                          <span className="text-xs font-semibold text-gray-300">
                            {isEmail && scan.details.senderReputation || isSms && "SMS Alert: " + scan.details.urgencyLevel + " urgency" || isCall && "VoIP Call ID: " + scan.details.callerName || "Doc: " + scan.details.fileName}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                          {new Date(scan.timestamp).toLocaleString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-white">
                          {scan.score}% Score
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-display uppercase border ${
                            scan.verdict === "Critical" 
                              ? "bg-danger/10 text-danger border-danger/25" 
                              : scan.verdict === "Warning" 
                                ? "bg-warning/10 text-warning border-warning/25" 
                                : "bg-safe/10 text-safe border-safe/25"
                          }`}>
                            {scan.verdict}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => setViewScan(scan)}
                              className="p-1.5 rounded-lg border border-white/5 hover:border-white/15 bg-gray-900/40 text-gray-400 hover:text-white transition-all cursor-pointer"
                              title="Inspect Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDownloadReport(scan)}
                              className="p-1.5 rounded-lg border border-white/5 hover:border-white/15 bg-gray-900/40 text-gray-400 hover:text-white transition-all cursor-pointer"
                              title="Download Report"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Scan Details Modal */}
        <Dialog open={!!viewScan} onOpenChange={(open) => !open && setViewScan(null)}>
          {viewScan && (
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <div className="flex items-center space-x-2 text-primary font-display font-bold text-sm mb-1 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Threat Intelligence Report</span>
                </div>
                <DialogTitle className="text-xl">Scan Run ID: {viewScan.id}</DialogTitle>
                <DialogDescription>
                  Detailed analysis generated on {new Date(viewScan.timestamp).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm font-sans pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-display">Fraud Score</span>
                    <span className="text-xl font-bold text-white font-mono mt-0.5 block">{viewScan.score}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-display">Verdict</span>
                    <span className={`text-base font-bold font-display uppercase mt-0.5 block ${
                      viewScan.verdict === "Critical" ? "text-danger" : viewScan.verdict === "Warning" ? "text-warning" : "text-safe"
                    }`}>{viewScan.verdict}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-display">AI System explanation</span>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">{viewScan.aiExplanation}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-display">Remediation actions</span>
                  <p className="text-xs text-primary font-bold mt-1 leading-snug">{viewScan.suggestedAction}</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDownloadReport(viewScan)}
                    className="px-4 py-2 rounded-xl bg-white text-gray-950 text-xs font-bold hover:bg-gray-100 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT Report</span>
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
