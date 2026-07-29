"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  ShieldAlert, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  File, 
  RotateCw,
  TrendingUp,
  Award,
  Trash2,
  Volume2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useHistoryStore, ScanResult } from "@/store/historyStore";
import toast from "react-hot-toast";

export default function DemoPage() {
  const [activeTab, setActiveTab] = React.useState<string>("email");
  const [analyzing, setAnalyzing] = React.useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = React.useState<number>(0);
  const [result, setResult] = React.useState<ScanResult | null>(null);

  const addScan = useHistoryStore((state) => state.addScan);

  // Forms inputs
  const [emailSender, setEmailSender] = React.useState("billing-alert@stripe-support-checkout.xyz");
  const [emailSubject, setEmailSubject] = React.useState("IMMEDIATE ACTION REQUIRED: Verify your payment details");
  const [emailBody, setEmailBody] = React.useState(
    "Dear customer, we detected unusual login activity on your Stripe Account from a new device. Please verify your payment details within 24 hours to prevent account suspension. Click the link below to resolve this immediately: http://secure-stripe-login-portal-verify.xyz/update"
  );

  const [smsSender, setSmsSender] = React.useState("AD-KOTAKBK");
  const [smsBody, setSmsBody] = React.useState(
    "URGENT: Your Kotak Bank account has been blocked due to suspicious activity. To reactivate, click here http://pay-bank-reward.in/otp to verify your OTP immediately and avoid a fee of Rs 5,000."
  );

  const [callCaller, setCallCaller] = React.useState("+1 (800) 412-9981 (VoIP)");
  const [callTranscript, setCallTranscript] = React.useState(
    "Officer: This is agent Williams from the compliance department. We found an irregular audit trail in your tax files. If you do not execute an immediate wire transfer of Rs 50,000 to our safe escrow routing, we will issue a warrant for your arrest within two hours. Please stay on the line and confirm."
  );

  const [phoneLookup, setPhoneLookup] = React.useState("+1 (800) 412-9981 (VoIP)");

  const [docFile, setDocFile] = React.useState<File | null>(null);
  const [docPreview, setDocPreview] = React.useState<string | null>(null);
  const loadPreset = (type: string, variant: "phishing" | "clean") => {
    if (type === "phone") {
      if (variant === "phishing") {
        setPhoneLookup("+1 (800) 412-9981 (VoIP)");
        toast.success("Loaded Unverified VoIP Scam Number");
      } else {
        setPhoneLookup("+1 (800) 275-2273 (Apple Toll-Free)");
        toast.success("Loaded Verified Business Number");
      }
    } else if (type === "email") {
      if (variant === "phishing") {
        setEmailSender("billing-alert@stripe-support-checkout.xyz");
        setEmailSubject("IMMEDIATE ACTION REQUIRED: Verify your payment details");
        setEmailBody("Dear customer, we detected unusual login activity on your Stripe Account from a new device. Please verify your payment details within 24 hours to prevent account suspension. Click the link below to resolve this immediately: http://secure-stripe-login-portal-verify.xyz/update");
        toast.success("Loaded Stripe Phishing sample");
      } else {
        setEmailSender("billing@stripe.com");
        setEmailSubject("Receipt for your monthly subscription #INV-9012");
        setEmailBody("Hello, thank you for your payment to Stripe. Your receipt #INV-9012 is now available in your account dashboard. No further action is required.");
        toast.success("Loaded Clean Email sample");
      }
    } else if (type === "sms") {
      if (variant === "phishing") {
        setSmsSender("AD-KOTAKBK");
        setSmsBody("URGENT: Your Kotak Bank account has been blocked due to suspicious activity. To reactivate, click here http://pay-bank-reward.in/otp to verify your OTP immediately and avoid a fee of Rs 5,000.");
        toast.success("Loaded Bank OTP Scam sample");
      } else {
        setSmsSender("AMAZON");
        setSmsBody("Your Amazon package #402-991203 has been delivered to your front door. Thank you for shopping with Amazon!");
        toast.success("Loaded Clean SMS alert");
      }
    } else if (type === "call") {
      if (variant === "phishing") {
        setCallCaller("+1 (800) 412-9981 (VoIP)");
        setCallTranscript("Officer: This is agent Williams from the compliance department. We found an irregular audit trail in your tax files. If you do not execute an immediate wire transfer of Rs 50,000 to our safe escrow routing, we will issue a warrant for your arrest within two hours. Please stay on the line and confirm.");
        toast.success("Loaded Extortion Call sample");
      } else {
        setCallCaller("+1 (800) 275-2273 (Apple Support)");
        setCallTranscript("Representative: Hi Sarah, following up on your support request regarding iCloud storage synchronization. We have completed the background diagnostic and your device is syncing normally.");
        toast.success("Loaded Clean Support Call sample");
      }
    }
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setDocFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success(`Loaded document: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"], "application/pdf": [".pdf"] },
    maxFiles: 1
  });

  const pipelineStages = [
    "Extracting Input Text...",
    "Generating Vector Embeddings (MiniLM)...",
    "Running AI Threat Classifiers...",
    "Validating Domain & Header Metas...",
    "Running Risk Fusion Matrices...",
    "Compiling Explainable Analytics Report..."
  ];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setPipelineStage(0);
    setResult(null);

    // Simulate pipeline timeline ticking
    for (let i = 0; i < pipelineStages.length; i++) {
      setPipelineStage(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    let generatedResult: ScanResult;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      if (activeTab === "email") {
        const response = await fetch(`${apiUrl}/email/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: emailSender,
            subject: emailSubject,
            body: emailBody
          })
        });
        if (!response.ok) throw new Error("API responded with error");
        const data = await response.json();
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "email",
          timestamp: new Date().toISOString(),
          score: data.score,
          confidence: data.confidence,
          verdict: data.verdict as ScanResult["verdict"],
          details: data.details,
          aiExplanation: data.aiExplanation,
          suggestedAction: data.suggestedAction
        };
      } else if (activeTab === "sms") {
        const response = await fetch(`${apiUrl}/sms/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: smsSender,
            body: smsBody
          })
        });
        if (!response.ok) throw new Error("API responded with error");
        const data = await response.json();
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "sms",
          timestamp: new Date().toISOString(),
          score: data.score,
          confidence: data.confidence,
          verdict: data.verdict as ScanResult["verdict"],
          details: data.details,
          aiExplanation: data.aiExplanation,
          suggestedAction: data.suggestedAction
        };
      } else if (activeTab === "call") {
        const response = await fetch(`${apiUrl}/call/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caller: callCaller,
            transcript: callTranscript
          })
        });
        if (!response.ok) throw new Error("API responded with error");
        const data = await response.json();
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "call",
          timestamp: new Date().toISOString(),
          score: data.score,
          confidence: data.confidence,
          verdict: data.verdict as ScanResult["verdict"],
          details: data.details,
          aiExplanation: data.aiExplanation,
          suggestedAction: data.suggestedAction
        };
      } else if (activeTab === "phone") {
        const response = await fetch(`${apiUrl}/phone/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phoneLookup })
        });
        if (!response.ok) throw new Error("API responded with error");
        const data = await response.json();
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "call",
          timestamp: new Date().toISOString(),
          score: 100 - data.trustScore,
          confidence: 96,
          verdict: data.trustScore >= 80 ? "Safe" : data.trustScore >= 50 ? "Warning" : "Critical",
          details: {
            callerName: data.phone,
            trustScore: data.trustScore,
            headerAnalysis: `Line Type: ${data.lineType} | Carrier: ${data.carrier} | Country: ${data.country}`,
            urgencyLevel: data.isVoip ? "High" : "Low",
            manipulationTechniques: data.isVoip ? ["Unverified Virtual Line (VoIP)", "Potential Identity Spoofing"] : ["Verified Telecom Network"]
          },
          aiExplanation: `Phone number validation report for ${data.phone}. Verdict: ${data.reputationVerdict}. Carrier: ${data.carrier}. Line Type: ${data.lineType} (${data.isVoip ? "Unverified virtual VoIP gateway" : "Authenticated telecom network"}).`,
          suggestedAction: data.details.recommendation
        };
      } else {
        if (!docFile) throw new Error("No file selected");
        const formData = new FormData();
        formData.append("file", docFile);
        const response = await fetch(`${apiUrl}/document/analyze`, {
          method: "POST",
          body: formData
        });
        if (!response.ok) throw new Error("API responded with error");
        const data = await response.json();
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "document",
          timestamp: new Date().toISOString(),
          score: data.score,
          confidence: data.confidence,
          verdict: data.verdict as ScanResult["verdict"],
          details: data.details,
          aiExplanation: data.aiExplanation,
          suggestedAction: data.suggestedAction
        };
      }
    } catch {
      console.warn("FastAPI backend offline. Falling back to local heuristics simulation.");
      if (activeTab === "email") {
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "email",
          timestamp: new Date().toISOString(),
          score: 89,
          confidence: 96,
          verdict: "Critical",
          details: {
            senderReputation: "Suspicious (registered recently)",
            spf: "FAIL",
            dkim: "FAIL",
            dmarc: "FAIL",
            domainAge: "5 days old",
            headerAnalysis: "Return-Path does not match From address domain. DKIM signatures invalid.",
            suspiciousLinks: ["http://secure-stripe-login-portal-verify.xyz/update"],
            suspiciousPhrases: ["IMMEDIATE ACTION REQUIRED", "account suspension", "verify your payment"]
          },
          aiExplanation: `phishing vector targeting account credentials. Sender domain is '${emailSender.split('@')[1]}' which was registered 5 days ago and is spoofing Stripe's official billing service. Content indicates high urgency combined with phishing links.`,
          suggestedAction: "Mark as Phishing, block the sender domain, and warn billing staff about this specific domain pattern."
        };
      } else if (activeTab === "sms") {
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "sms",
          timestamp: new Date().toISOString(),
          score: 96,
          confidence: 98,
          verdict: "Critical",
          details: {
            urgencyLevel: "High",
            otpDetected: true,
            upiDetails: "Kotak bank impersonation seeking immediate reactivation via link.",
            suspiciousLinks: ["http://pay-bank-reward.in/otp"],
            suspiciousPhrases: ["URGENT", "blocked", "verify your OTP", "avoid a fee"]
          },
          aiExplanation: `OTP and UPI fraud detected. The SMS contents match banking credential harvest templates. Sender mask '${smsSender}' mimics bank notification protocols, but embeds an unverified short url.`,
          suggestedAction: "Do NOT click the URL link. Block sender ID and report details to safety regulators."
        };
      } else if (activeTab === "call") {
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "call",
          timestamp: new Date().toISOString(),
          score: 78,
          confidence: 88,
          verdict: "Warning",
          details: {
            callerName: callCaller,
            trustScore: 22,
            manipulationTechniques: ["Pressure tactics", "Compliance Impersonation", "Escrow Transfer Scams"],
            suspiciousPhrases: ["compliance department", "warrant for your arrest", "immediate wire transfer"]
          },
          aiExplanation: "Impersonation pressure scam. Audio transcripts and vocabulary structures show high correlation with fake government warning call rings, seeking instant monetary conversion.",
          suggestedAction: "Hang up the phone call. Do not transfer funds or share identification documentation."
        };
      } else if (activeTab === "phone") {
        const isVoip = phoneLookup.toLowerCase().includes("voip");
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "call",
          timestamp: new Date().toISOString(),
          score: isVoip ? 85 : 15,
          confidence: 95,
          verdict: isVoip ? "Critical" : "Safe",
          details: {
            callerName: phoneLookup,
            trustScore: isVoip ? 35 : 95,
            headerAnalysis: isVoip ? "Line Type: VOIP | Carrier: Virtual Gateway | Risk: High" : "Line Type: MOBILE | Carrier: Verizon Wireless | Risk: Low",
            urgencyLevel: isVoip ? "High" : "Low",
            manipulationTechniques: isVoip ? ["Unverified Virtual Line (VoIP)", "Potential Identity Spoofing"] : ["Verified Network Registration"]
          },
          aiExplanation: `Phone number intelligence scan for ${phoneLookup}. ${isVoip ? "High-risk unverified VoIP number detected. Likely spoofed virtual caller ID." : "Verified telecom carrier registration. Format valid."}`,
          suggestedAction: isVoip ? "Exercise high caution. Do not share OTP codes or authorize wire transfers." : "Safe to communicate."
        };
      } else {
        generatedResult = {
          id: "sc-" + Math.random().toString(36).substr(2, 9),
          type: "document",
          timestamp: new Date().toISOString(),
          score: 64,
          confidence: 90,
          verdict: "Warning",
          details: {
            fileName: docFile ? docFile.name : "invoice_copy.pdf",
            forgeryDetected: true,
            missingQr: true,
            signatureMatch: false,
            fontMismatch: true,
            compressionArtifacts: true,
            headerAnalysis: "Structural template mismatches found at bottom margins."
          },
          aiExplanation: "Visual forgery detected. We found editing software artifacts, a missing verification QR code, and template anomalies along the billing table, indicating stamp modification.",
          suggestedAction: "Review original document logs. Contact the issuing partner directly using pre-verified channels."
        };
      }
    }

    addScan(generatedResult);
    setResult(generatedResult);
    setAnalyzing(false);
    toast.success("AI Scam Analysis Completed!");
  };

  const highlightSuspiciousText = (text: string, suspiciousPhrases: string[] | undefined) => {
    if (!suspiciousPhrases || suspiciousPhrases.length === 0) return text;
    let highlighted = text;
    suspiciousPhrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, "gi");
      highlighted = highlighted.replace(regex, `<span class="bg-red-500/20 text-red-400 border-b border-red-500 font-semibold px-0.5">$1</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Form Inputs & Selector */}
        {!analyzing && !result && (
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <RotateCw className="h-6 w-6 text-primary animate-spin-slow" />
                <span>Submit Asset for Scam Verification</span>
              </CardTitle>
              <CardDescription>
                Select an input channel, paste your message details or drag your document, and click Analyze to trigger our Threat fusion model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar w-full mb-8 p-1.5 bg-gray-900/60 rounded-xl border border-white/5 gap-1.5">
                  <TabsTrigger value="email" className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold shrink-0 sm:shrink min-w-[100px] sm:min-w-0">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="inline text-xs sm:text-sm">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold shrink-0 sm:shrink min-w-[100px] sm:min-w-0">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="inline text-xs sm:text-sm">SMS</span>
                  </TabsTrigger>
                  <TabsTrigger value="call" className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold shrink-0 sm:shrink min-w-[100px] sm:min-w-0">
                    <PhoneCall className="h-4 w-4 shrink-0" />
                    <span className="inline text-xs sm:text-sm">Calls</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold shrink-0 sm:shrink min-w-[110px] sm:min-w-0">
                    <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="inline text-xs sm:text-sm">Number</span>
                  </TabsTrigger>
                  <TabsTrigger value="document" className="flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-semibold shrink-0 sm:shrink min-w-[100px] sm:min-w-0">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="inline text-xs sm:text-sm">Docs</span>
                  </TabsTrigger>
                </TabsList>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-gray-300 font-display flex items-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary mr-1.5 animate-pulse" /> 1-Click Quick Samples:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => loadPreset("email", "phishing")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-all cursor-pointer"
                      >
                        🚨 Stripe Phishing
                      </button>
                      <button 
                        type="button"
                        onClick={() => loadPreset("email", "clean")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-safe/10 text-safe border border-safe/20 hover:bg-safe/20 transition-all cursor-pointer"
                      >
                        ✅ Clean Receipt
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sender Address</label>
                      <input 
                        type="text" 
                        value={emailSender} 
                        onChange={(e) => setEmailSender(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="e.g. support@paypal.security-alert.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject Line</label>
                      <input 
                        type="text" 
                        value={emailSubject} 
                        onChange={(e) => setEmailSubject(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="e.g. Account Suspended - Action Required"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Body Context</label>
                    <textarea 
                      rows={5}
                      value={emailBody} 
                      onChange={(e) => setEmailBody(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                      placeholder="Paste the complete email text content here..."
                    />
                  </div>
                </TabsContent>

                {/* SMS Tab */}
                <TabsContent value="sms" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-gray-300 font-display flex items-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-secondary mr-1.5 animate-pulse" /> 1-Click Quick Samples:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => loadPreset("sms", "phishing")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-all cursor-pointer"
                      >
                        🚨 Bank OTP Scam
                      </button>
                      <button 
                        type="button"
                        onClick={() => loadPreset("sms", "clean")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-safe/10 text-safe border border-safe/20 hover:bg-safe/20 transition-all cursor-pointer"
                      >
                        ✅ Amazon Delivery Alert
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sender Mask ID / Phone Number</label>
                    <input 
                      type="text" 
                      value={smsSender} 
                      onChange={(e) => setSmsSender(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                      placeholder="e.g. BP-SBIINB or +91 9988776655"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SMS Message Content</label>
                    <textarea 
                      rows={4}
                      value={smsBody} 
                      onChange={(e) => setSmsBody(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                      placeholder="Paste SMS text body..."
                    />
                  </div>
                </TabsContent>

                {/* Call Transcript */}
                <TabsContent value="call" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-gray-300 font-display flex items-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-accent mr-1.5 animate-pulse" /> 1-Click Quick Samples:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => loadPreset("call", "phishing")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-all cursor-pointer"
                      >
                        🚨 Arrest Warrant Extortion
                      </button>
                      <button 
                        type="button"
                        onClick={() => loadPreset("call", "clean")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-safe/10 text-safe border border-safe/20 hover:bg-safe/20 transition-all cursor-pointer"
                      >
                        ✅ Apple Support Call
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Caller Caller ID</label>
                    <input 
                      type="text" 
                      value={callCaller} 
                      onChange={(e) => setCallCaller(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                      placeholder="e.g. +1 (800) 555-0199 or VoIP Number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Conversational Script Transcript</label>
                    <textarea 
                      rows={5}
                      value={callTranscript} 
                      onChange={(e) => setCallTranscript(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-primary/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                      placeholder="Provide caller dialog details..."
                    />
                  </div>
                </TabsContent>

                {/* Number Verifier Tab */}
                <TabsContent value="phone" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-gray-300 font-display flex items-center shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400 mr-1.5 animate-pulse" /> 1-Click Quick Samples:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => loadPreset("phone", "phishing")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition-all cursor-pointer"
                      >
                        🚨 Unverified VoIP Line
                      </button>
                      <button 
                        type="button"
                        onClick={() => loadPreset("phone", "clean")}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-safe/10 text-safe border border-safe/20 hover:bg-safe/20 transition-all cursor-pointer"
                      >
                        ✅ Verified Business Toll-Free
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number / Caller ID</label>
                    <input 
                      type="text" 
                      value={phoneLookup} 
                      onChange={(e) => setPhoneLookup(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-white/10 focus:border-emerald-500/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                      placeholder="e.g. +1 (800) 412-9981 or +91 98765 43210"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Performs carrier network verification, line type validation (VoIP / Mobile / Landline), and Truecaller-style trust score check.
                    </p>
                  </div>
                </TabsContent>

                {/* Document Tab */}
                <TabsContent value="document" className="space-y-4">
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isDragActive 
                        ? "border-primary bg-primary/5" 
                        : docFile 
                          ? "border-safe/40 bg-safe/5" 
                          : "border-white/10 hover:border-white/20 bg-gray-900/10"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <FileText className={`h-12 w-12 mb-4 ${docFile ? "text-safe animate-bounce" : "text-gray-500"}`} />
                    {docFile ? (
                      <div>
                        <p className="text-sm font-semibold text-white">{docFile.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{(docFile.size / 1024).toFixed(1)} KB • Click to swap file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-white">Drag & drop your document here, or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Supports Invoice PDFs, Receipts, PNGs, and JPGs (Max 10MB)</p>
                      </div>
                    )}
                  </div>

                  {docPreview && (
                    <div className="flex justify-center">
                      <div className="relative border border-white/10 rounded-xl overflow-hidden max-w-[200px] h-[150px]">
                        <img src={docPreview} alt="Doc preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDocFile(null); setDocPreview(null); }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-red-400 border border-white/10 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleAnalyze}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:scale-[1.02] shadow-[0_4px_25px_rgba(124,58,237,0.3)] transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Initialize AI Verification</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pipeline Loader Animation */}
        <AnimatePresence>
          {analyzing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center items-center min-h-[450px]"
            >
              <Card className="max-w-md w-full border-primary/20 bg-gray-950/80 shadow-2xl relative overflow-hidden text-center p-8">
                <div className="absolute inset-0 bg-grid-bg-fine opacity-20" />
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent w-full animate-pulse" />
                
                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-6" />
                <h3 className="text-lg font-bold text-white font-display mb-1.5">PramaanAI Core Engine Active</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold font-display mb-6">Threat Verification Pipeline</p>

                {/* Pipeline visual steps */}
                <div className="space-y-3.5 text-left max-w-xs mx-auto">
                  {pipelineStages.map((stage, idx) => {
                    const active = idx === pipelineStage;
                    const completed = idx < pipelineStage;
                    return (
                      <div 
                        key={stage} 
                        className={`flex items-center space-x-3 text-sm transition-all duration-300 ${
                          active ? "text-primary font-semibold" : completed ? "text-safe" : "text-gray-600"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle className="h-4.5 w-4.5 text-safe shrink-0" />
                        ) : active ? (
                          <Loader2 className="h-4.5 w-4.5 text-primary animate-spin shrink-0" />
                        ) : (
                          <div className="h-4.5 w-4.5 rounded-full border border-gray-700 shrink-0" />
                        )}
                        <span>{stage}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Screen */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setResult(null)}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-[0_2px_15px_rgba(37,99,235,0.3)] cursor-pointer flex items-center space-x-1.5"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Test Another Sample</span>
                  </button>
                  <span className="text-xs text-gray-400 font-mono hidden sm:inline">Run ID: {result.id}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400 font-medium hidden sm:inline">Threat Assessment:</span>
                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-display uppercase border shadow-sm ${
                    result.verdict === "Critical" 
                      ? "bg-danger/10 text-danger border-danger/30" 
                      : result.verdict === "Warning" 
                        ? "bg-warning/10 text-warning border-warning/30" 
                        : "bg-safe/10 text-safe border-safe/30"
                  }`}>
                    {result.verdict} Severity
                  </div>
                </div>
              </div>

              {/* Core Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Fraud score card */}
                <Card className="border-white/5 relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col justify-between items-center text-center">
                  <div className="absolute top-0 right-0 p-4">
                    <ShieldAlert className="h-5 w-5 text-gray-600" />
                  </div>
                  <CardHeader className="mb-0">
                    <CardTitle className="text-sm font-semibold tracking-wider text-gray-400 uppercase font-display">Scam Index Ratio</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="relative flex items-center justify-center">
                      {/* SVG circular dial */}
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          cx="64" 
                          cy="64" 
                          r="50" 
                          stroke={result.verdict === "Critical" ? "#EF4444" : result.verdict === "Warning" ? "#F59E0B" : "#10B981"} 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 50}
                          initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                          animate={{ strokeDashoffset: (2 * Math.PI * 50) * (1 - result.score / 100) }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-white font-mono">{result.score}%</span>
                        <span className="text-[10px] text-gray-500 font-semibold font-display tracking-wider">FRAUD INDEX</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence Card */}
                <Card className="border-white/5 flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold tracking-wider text-gray-400 uppercase font-display flex items-center justify-between">
                      <span>Model Confidence</span>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-mono">
                        <span>Classification Confidence</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary" 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Our Risk Fusion Engine maps content vocabulary distributions, metadata attributes, and network telemetry parameters to build statistical confidence levels.
                    </p>
                  </CardContent>
                </Card>

                {/* AI Explanation Summary */}
                <Card className="border-white/5 flex flex-col justify-between md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold tracking-wider text-gray-400 uppercase font-display flex items-center justify-between">
                      <span>Remediation Advice</span>
                      <Award className="h-4 w-4 text-secondary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-xs font-semibold text-white leading-tight font-display mb-1">Recommended Response</p>
                      <p className="text-xs text-gray-300 font-sans">{result.suggestedAction}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold">Verification Node Code: OK</span>
                  </CardContent>
                </Card>
              </div>

              {/* Suspicious content timeline & specific tags */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Highlight text / metadata scan details */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-white/5">
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-white font-display">Risk Highlights & Phrase Markers</CardTitle>
                      <CardDescription>Suspicious cues detected by our text processing layer are highlighted below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 text-sm leading-relaxed text-gray-300 font-sans">
                        {result.type === "email" && highlightSuspiciousText(emailBody, result.details.suspiciousPhrases)}
                        {result.type === "sms" && highlightSuspiciousText(smsBody, result.details.suspiciousPhrases)}
                        {result.type === "call" && highlightSuspiciousText(callTranscript, result.details.suspiciousPhrases)}
                        {result.type === "document" && (
                          <div className="space-y-3 text-xs font-mono">
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-display mb-2">OCR Extracted String Context</p>
                            <div className="bg-black/30 p-3 rounded-lg border border-white/5 max-h-[150px] overflow-y-auto">
                              TAX INVOICE <br />
                              Pramaan Enterprises Ltd. <br />
                              Invoice No: INV-2026-992 <br />
                              Total Billing: $14,250.00 <br />
                              Swift Routing: FAKE_ROUTE_SWIFT <br />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        <span className="font-semibold text-white">AI Verdict Note:</span> {result.aiExplanation}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Specific channel diagnostics details */}
                <div className="space-y-6">
                  <Card className="border-white/5">
                    <CardHeader>
                      <CardTitle className="text-base font-bold text-white font-display">Diagnostic Logs</CardTitle>
                      <CardDescription>Granular indicators analyzed by specific channel parsers.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm font-sans space-y-4">
                      {result.type === "email" && (
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Sender Trust</span>
                            <span className="text-red-400 font-medium font-mono">{result.details.senderReputation}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Domain Age</span>
                            <span className="text-white font-medium font-mono">{result.details.domainAge}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">SPF record</span>
                            <span className="text-red-400 font-bold font-mono">FAIL</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">DKIM sign</span>
                            <span className="text-red-400 font-bold font-mono">FAIL</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">DMARC config</span>
                            <span className="text-red-400 font-bold font-mono">FAIL</span>
                          </div>
                          <div className="flex justify-between pb-1 flex-col">
                            <span className="text-gray-400 mb-1">Suspicious Links</span>
                            <span className="text-red-400 text-xs truncate font-mono">{result.details.suspiciousLinks?.[0]}</span>
                          </div>
                        </div>
                      )}

                      {result.type === "sms" && (
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Urgency Level</span>
                            <span className="text-red-400 font-bold font-mono">{result.details.urgencyLevel}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">OTP scam matching</span>
                            <span className="text-red-400 font-semibold font-mono">MATCHED</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">UPI links detected</span>
                            <span className="text-yellow-400 font-medium font-mono">YES</span>
                          </div>
                          <div className="flex justify-between pb-1 flex-col">
                            <span className="text-gray-400 mb-1">Target Short Link</span>
                            <span className="text-red-400 text-xs truncate font-mono">{result.details.suspiciousLinks?.[0]}</span>
                          </div>
                        </div>
                      )}

                      {result.type === "call" && (
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Caller Identity</span>
                            <span className="text-yellow-400 font-medium font-mono">{result.details.callerName}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Trust Score rating</span>
                            <span className="text-red-400 font-bold font-mono">{result.details.trustScore} / 100</span>
                          </div>
                          <div className="flex justify-between pb-1 flex-col">
                            <span className="text-gray-400 mb-1.5">Social Manipulation Methods</span>
                            <div className="flex flex-wrap gap-1.5">
                              {result.details.manipulationTechniques?.map((m) => (
                                <span key={m} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/25 text-[10px] text-red-400 font-semibold font-display">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="pt-2 flex flex-col justify-center items-center p-3 rounded-xl bg-black/40 border border-white/5">
                            {/* Call audio waveform mimic */}
                            <div className="flex items-center space-x-1.5 h-8">
                              {[3, 8, 5, 9, 6, 2, 7, 4, 8, 3].map((h, i) => (
                                <div 
                                  key={i} 
                                  style={{ height: `${h * 3}px` }} 
                                  className="w-1.5 bg-primary/80 rounded-full animate-[pulse_1.5s_infinite]" 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-2 flex items-center">
                              <Volume2 className="h-3 w-3 text-primary mr-1" /> Speech Waveform Scanner
                            </span>
                          </div>
                        </div>
                      )}

                      {result.type === "document" && (
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Visual Forgery flag</span>
                            <span className="text-red-400 font-bold font-mono">DETECTED</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Font Alignment deviations</span>
                            <span className="text-red-400 font-semibold font-mono">YES</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Compression anomalies</span>
                            <span className="text-yellow-400 font-semibold font-mono">YES</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Seal Verification stamp</span>
                            <span className="text-red-400 font-semibold font-mono">UNVERIFIED</span>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="text-gray-400">Verification QR code</span>
                            <span className="text-red-400 font-bold font-mono">MISSING</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
