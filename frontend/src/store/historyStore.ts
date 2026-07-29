import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ScanResult {
  id: string;
  type: "email" | "sms" | "call" | "document" | "phone";
  timestamp: string;
  score: number;
  confidence: number;
  verdict: "Safe" | "Warning" | "Critical";
  details: {
    senderReputation?: string;
    spf?: "PASS" | "FAIL" | "NONE";
    dkim?: "PASS" | "FAIL" | "NONE";
    dmarc?: "PASS" | "FAIL" | "NONE";
    domainAge?: string;
    headerAnalysis?: string;
    suspiciousLinks?: string[];
    urgencyLevel?: "High" | "Medium" | "Low";
    otpDetected?: boolean;
    upiDetails?: string;
    callerName?: string;
    trustScore?: number;
    manipulationTechniques?: string[];
    ocrText?: string;
    forgeryDetected?: boolean;
    missingQr?: boolean;
    signatureMatch?: boolean;
    fontMismatch?: boolean;
    compressionArtifacts?: boolean;
    fileName?: string;
    suspiciousPhrases?: string[];
  };
  aiExplanation: string;
  suggestedAction: string;
}

interface HistoryStore {
  scans: ScanResult[];
  searchQuery: string;
  filterType: string;
  notifications: Array<{ id: string; message: string; type: "info" | "warning" | "success"; time: string; read: boolean }>;
  addScan: (scan: ScanResult) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: string) => void;
  clearHistory: () => void;
  fetchRealScans: () => Promise<void>;
  addNotification: (message: string, type: "info" | "warning" | "success") => void;
  markNotificationsAsRead: () => void;
}

interface DBHistoryItem {
  _id?: string;
  channel?: string;
  timestamp?: string;
  result?: {
    score?: number;
    confidence?: number;
    verdict?: string;
    details?: Record<string, unknown>;
    aiExplanation?: string;
    suggestedAction?: string;
  };
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      scans: [],
      searchQuery: "",
      filterType: "all",
      notifications: [],
      fetchRealScans: async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const res = await fetch(`${apiUrl}/history?limit=50`);
          if (!res.ok) return;
          const data = await res.json();
          if (data && Array.isArray(data.history)) {
            const realScans: ScanResult[] = data.history
              .filter((item: DBHistoryItem) => item._id && !item._id.startsWith("sc-00"))
              .map((item: DBHistoryItem, index: number) => ({
                id: item._id || `db-${index}`,
                type: (item.channel as ScanResult["type"]) || "sms",
                timestamp: item.timestamp || new Date().toISOString(),
                score: item.result?.score || 50,
                confidence: item.result?.confidence || 90,
                verdict: (item.result?.verdict as ScanResult["verdict"]) || "Warning",
                details: item.result?.details || {},
                aiExplanation: item.result?.aiExplanation || "Real-time threat scan verified.",
                suggestedAction: item.result?.suggestedAction || "Clearance completed."
              }));
            set({ scans: realScans });
          }
        } catch (e) {
          console.warn("Failed to fetch MongoDB real history:", e);
        }
      },
      addScan: (scan) =>
        set((state) => ({
          scans: [scan, ...state.scans.filter((s) => !s.id.startsWith("sc-00"))],
          notifications: [
            {
              id: Math.random().toString(),
              message: `New ${scan.type.toUpperCase()} analysis completed: Risk Score ${scan.score}% (${scan.verdict})`,
              type: scan.verdict === "Critical" ? "warning" : scan.verdict === "Warning" ? "info" : "success",
              time: "Just now",
              read: false
            },
            ...state.notifications
          ]
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      clearHistory: () => set({ scans: [] }),
      addNotification: (message, type) =>
        set((state) => ({
          notifications: [
            {
              id: Math.random().toString(),
              message,
              type,
              time: "Just now",
              read: false
            },
            ...state.notifications
          ]
        })),
      markNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }))
    }),
    {
      name: "pramaan-ai-history-v2"
    }
  )
);
