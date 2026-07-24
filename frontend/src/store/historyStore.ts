import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ScanResult {
  id: string;
  type: "email" | "sms" | "call" | "document";
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
  addNotification: (message: string, type: "info" | "warning" | "success") => void;
  markNotificationsAsRead: () => void;
}

const mockInitialScans: ScanResult[] = [
  {
    id: "sc-001",
    type: "email",
    timestamp: "2026-07-23T20:15:00Z",
    score: 87,
    confidence: 94,
    verdict: "Critical",
    details: {
      senderReputation: "Poor (Flagged domain)",
      spf: "FAIL",
      dkim: "FAIL",
      dmarc: "FAIL",
      domainAge: "3 days old",
      headerAnalysis: "Mismatched Return-Path, suspect SPF alignment",
      suspiciousLinks: ["http://secure-stripe-login-portal-verify.xyz/update"],
      suspiciousPhrases: ["Verify now", "account suspended", "immediate action required"]
    },
    aiExplanation: "The sender address 'support@stripe-security-verify.xyz' mismatches the official Stripe SPF records. The domain was registered 3 days ago. Multiple urgency keywords and phishing links were detected in the email body, mimicking Stripe billing alerts.",
    suggestedAction: "Block the sender domain immediately. Do not click any links or provide credential details."
  },
  {
    id: "sc-002",
    type: "sms",
    timestamp: "2026-07-23T19:40:00Z",
    score: 95,
    confidence: 98,
    verdict: "Critical",
    details: {
      urgencyLevel: "High",
      otpDetected: true,
      upiDetails: "Requesting money transfer via UPI link",
      suspiciousLinks: ["http://pay-bank-reward.in/otp"],
      suspiciousPhrases: ["OTP shared", "account blocked", "click here to claim reward"]
    },
    aiExplanation: "The message contents indicate an urgent OTP scam requesting bank credential validation to claim rewards. It embeds a shortened URL that routes to an unverified third-party phishing site mimicking a major Indian bank.",
    suggestedAction: "Report this number to the National Cyber Crime Portal. Delete the SMS and block the sender."
  },
  {
    id: "sc-003",
    type: "call",
    timestamp: "2026-07-23T18:10:00Z",
    score: 72,
    confidence: 89,
    verdict: "Warning",
    details: {
      callerName: "Unknown VoIP Number",
      trustScore: 34,
      manipulationTechniques: ["Urgency", "Authority Impersonation", "Voice stress cues"],
      suspiciousPhrases: ["compliance department", "penalty of Rs 50,000", "immediate wire transfer"]
    },
    aiExplanation: "The speaker transcript exhibits social engineering behavior, impersonating a government legal compliance official. They demand immediate wire transfer to avoid penalties. Structural speech cues indicate stress and synthetic call routing characteristics.",
    suggestedAction: "Terminate the call. Verify details directly with official organization channels."
  },
  {
    id: "sc-004",
    type: "document",
    timestamp: "2026-07-23T17:05:00Z",
    score: 12,
    confidence: 97,
    verdict: "Safe",
    details: {
      fileName: "Q2_Tax_Invoice_2026.pdf",
      ocrText: "TAX INVOICE. Pramaan Enterprises Ltd. Invoice No: INV-2026-992. Total: $14,250.00",
      forgeryDetected: false,
      missingQr: false,
      signatureMatch: true,
      fontMismatch: false,
      compressionArtifacts: false
    },
    aiExplanation: "The invoice exhibits standard formatting, matching QR code verification, valid seals, and uniform font distributions. No compression artifacts or template deviations were detected. Signature matches established records.",
    suggestedAction: "Safe to process and submit for payment routing."
  }
];

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      scans: mockInitialScans,
      searchQuery: "",
      filterType: "all",
      notifications: [
        {
          id: "n-1",
          message: "Critical Email fraud detected matching Stripe phishing signature.",
          type: "warning",
          time: "5 mins ago",
          read: false
        },
        {
          id: "n-2",
          message: "Weekly Fraud Analytics summary compiled successfully.",
          type: "success",
          time: "1 hour ago",
          read: false
        }
      ],
      addScan: (scan) =>
        set((state) => ({
          scans: [scan, ...state.scans],
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
      name: "pramaan-ai-history-store"
    }
  )
);
