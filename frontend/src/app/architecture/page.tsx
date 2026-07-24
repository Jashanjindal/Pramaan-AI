"use client";

import * as React from "react";
import { 
  Shield, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Cpu, 
  Database, 
  Activity, 
  Binary, 
  Eye, 
  FileSignature, 
  GitMerge, 
  Layers, 
  Terminal, 
  Zap, 
  LineChart 
} from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface NodeDetail {
  title: string;
  sub: string;
  desc: string;
  latency: string;
  accuracy: string;
  stack: string;
}

const nodeDetails: Record<string, NodeDetail> = {
  ingress: {
    title: "Ingress Layer",
    sub: "Unified API Ingestion Gateway",
    desc: "Ingests unstructured communication vectors: SMTP servers, Twilio webhooks, VoIP session SIP records, and direct multipart document uploads.",
    latency: "8ms - 15ms",
    accuracy: "N/A (Gateway)",
    stack: "FastAPI Routers, Async Ingress queue"
  },
  parser: {
    title: "Parser & Normalizer",
    sub: "Text Normalization & Cleansing Engine",
    desc: "Splits headers, strips HTML, decodes Unicode variations, resolves URL shorteners, and structures metadata keys.",
    latency: "12ms",
    accuracy: "99.8% Parse Success",
    stack: "Python regex libraries, custom URL redirect parser"
  },
  ocr: {
    title: "OCR Visual Extraction",
    sub: "EasyOCR & Tesseract OCR Engines",
    desc: "Performs layout analysis, identifies bounding boxes, extracts invoice text characters, and captures visual seals/QR matrices.",
    latency: "350ms - 800ms",
    accuracy: "98.2% Character Accuracy",
    stack: "EasyOCR (PyTorch), Tesseract OCR Engine, OpenCV"
  },
  whisper: {
    title: "Whisper Transcription Engine",
    sub: "Speech-to-Text Voice Parser",
    desc: "Transcribes audio waveforms from VoIP recordings, checks phonetic accents, identifies pauses, and yields timed dialog records.",
    latency: "400ms - 1.2s",
    accuracy: "95.6% Word Error Rate",
    stack: "OpenAI Whisper Speech-to-Text Model, FFmpeg"
  },
  embeddings: {
    title: "MiniLM Embeddings Vectorizer",
    sub: "Sentence Transformers Semantic Vectors",
    desc: "Converts text fragments into dense 384-dimensional vector spaces using a MiniLM model to map semantic meaning.",
    latency: "45ms",
    accuracy: "92.4% Similarity Alignment",
    stack: "HuggingFace MiniLM-L6-v2, PyTorch"
  },
  classifiers: {
    title: "ML Scam Classifiers",
    sub: "Scikit-Learn Heuristic Models",
    desc: "Screens texts against OTP scams, bank impersonations, phishing indicators, and urgency pressure tactics.",
    latency: "15ms",
    accuracy: "97.1% Classification Recall",
    stack: "Scikit-Learn Random Forest, XGBoost"
  },
  auxiliary: {
    title: "Auxiliary Validator",
    sub: "DNS & File Verification Core",
    desc: "Validates SMTP SPF records, checks domain age registries, scans for image compression tampering, and checks document structure.",
    latency: "120ms",
    accuracy: "100% Rule Reliability",
    stack: "Python DNSResolver, Pillow metadata inspections"
  },
  fusion: {
    title: "Risk Fusion Matrix",
    sub: "Unified threat calculation core",
    desc: "Synthesizes classifier scores, visual anomaly indicators, and email SPF records into a unified threat index using weight vectors.",
    latency: "5ms",
    accuracy: "99.4% Platform accuracy",
    stack: "Custom Risk Weight Matrices, NumPy"
  },
  verdict: {
    title: "Verdict Generation Layer",
    sub: "Decision Output Gate",
    desc: "Categorizes Threat Index into Safe, Warning, or Critical levels, and outlines specific action strategies.",
    latency: "2ms",
    accuracy: "N/A (Decision Rule)",
    stack: "Pydantic response filters"
  }
};

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = React.useState<string>("ingress");

  const detail = nodeDetails[selectedNode] || nodeDetails.ingress;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">System Architecture</h2>
          <p className="text-xs text-gray-500 font-medium">Interactive processing pipeline diagram. Hover or click nodes to inspect layers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Visual Architecture Diagram */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center">
            
            {/* SVG Running Data Flow Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  .flow-line {
                    stroke-dasharray: 8 4;
                    animation: flow 20s linear infinite;
                  }
                  @keyframes flow {
                    to { stroke-dashoffset: -200; }
                  }
                `}</style>
                {/* SVG path traces connecting visual blocks */}
                <path d="M 120 100 L 250 100" fill="none" stroke="#2563EB" strokeWidth="2" className="flow-line" />
                <path d="M 120 180 L 250 180" fill="none" stroke="#2563EB" strokeWidth="2" className="flow-line" />
                <path d="M 120 260 L 250 260" fill="none" stroke="#2563EB" strokeWidth="2" className="flow-line" />
                
                <path d="M 370 180 L 480 180" fill="none" stroke="#7C3AED" strokeWidth="2" className="flow-line" />
                <path d="M 400 100 L 480 180" fill="none" stroke="#7C3AED" strokeWidth="2" className="flow-line" />
                <path d="M 400 260 L 480 180" fill="none" stroke="#7C3AED" strokeWidth="2" className="flow-line" />

                <path d="M 520 180 L 620 180" fill="none" stroke="#06B6D4" strokeWidth="2" className="flow-line" />
              </svg>
            </div>

            <div className="w-full space-y-12 relative z-10">
              
              {/* Row 1: Ingress Gateway */}
              <div className="flex justify-center">
                <div 
                  onMouseEnter={() => setSelectedNode("ingress")}
                  onClick={() => setSelectedNode("ingress")}
                  className={`px-6 py-4 rounded-xl border transition-all cursor-pointer text-center max-w-[200px] ${
                    selectedNode === "ingress" 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <Layers className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">Ingress API Gateway</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-1">Multi-Channel Ingestion</span>
                </div>
              </div>

              {/* Row 2: Ingress Channels */}
              <div className="grid grid-cols-3 gap-4">
                <div 
                  onMouseEnter={() => setSelectedNode("parser")}
                  onClick={() => setSelectedNode("parser")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "parser" 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <Mail className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">Email/SMS Parser</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Regex & Metadata</span>
                </div>

                <div 
                  onMouseEnter={() => setSelectedNode("ocr")}
                  onClick={() => setSelectedNode("ocr")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "ocr" 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <FileText className="h-5 w-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">OCR Engine</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">EasyOCR / Vision</span>
                </div>

                <div 
                  onMouseEnter={() => setSelectedNode("whisper")}
                  onClick={() => setSelectedNode("whisper")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "whisper" 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(37,99,235,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <PhoneCall className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">STT Whisper</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Waveform parsing</span>
                </div>
              </div>

              {/* Row 3: Unified ML Engine */}
              <div className="grid grid-cols-3 gap-4">
                <div 
                  onMouseEnter={() => setSelectedNode("embeddings")}
                  onClick={() => setSelectedNode("embeddings")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "embeddings" 
                      ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <Binary className="h-5 w-5 text-secondary mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">MiniLM Vectors</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Embeddings Model</span>
                </div>

                <div 
                  onMouseEnter={() => setSelectedNode("classifiers")}
                  onClick={() => setSelectedNode("classifiers")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "classifiers" 
                      ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <Cpu className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">ML Classifiers</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Threat patterns</span>
                </div>

                <div 
                  onMouseEnter={() => setSelectedNode("auxiliary")}
                  onClick={() => setSelectedNode("auxiliary")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "auxiliary" 
                      ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <FileSignature className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">Auxiliary verify</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Domain & QR seals</span>
                </div>
              </div>

              {/* Row 4: Risk Fusion & Final Verdict */}
              <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                <div 
                  onMouseEnter={() => setSelectedNode("fusion")}
                  onClick={() => setSelectedNode("fusion")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "fusion" 
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <GitMerge className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-xs font-bold text-white font-display">Risk Fusion Core</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Synthesis Matrix</span>
                </div>

                <div 
                  onMouseEnter={() => setSelectedNode("verdict")}
                  onClick={() => setSelectedNode("verdict")}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-center ${
                    selectedNode === "verdict" 
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
                      : "border-white/5 bg-gray-900/40 hover:border-white/10"
                  }`}
                >
                  <Shield className="h-5 w-5 text-safe mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-white font-display">Verdict Logic</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">Threat response</span>
                </div>
              </div>

            </div>

          </div>

          {/* Node Inspector Side Panel */}
          <div className="space-y-6">
            <Card className="border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900">
              <div className="absolute top-0 right-0 p-4">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white font-display flex items-center">
                  <Terminal className="h-4.5 w-4.5 mr-2 text-primary" />
                  Node Inspector
                </CardTitle>
                <CardDescription>Metrics, configurations, and stack details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-sm font-sans">
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">Component name</label>
                  <p className="text-base font-bold text-white font-display mt-0.5">{detail.title}</p>
                  <span className="text-xs text-primary font-semibold block">{detail.sub}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">Description</label>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">{detail.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">Average Latency</label>
                    <p className="text-xs font-bold text-white font-mono mt-0.5">{detail.latency}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">Accuracy Metric</label>
                    <p className="text-xs font-bold text-safe font-mono mt-0.5">{detail.accuracy}</p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-white/5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">Technology stack</label>
                  <p className="text-xs font-bold text-gray-300 font-mono mt-1 leading-snug">{detail.stack}</p>
                </div>

              </CardContent>
            </Card>

            <Card className="border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white font-display">Pipeline Specifications</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-2 font-sans">
                <p>• Multi-channel messages correlate threat footprints via metadata similarity hashing.</p>
                <p>• High-volume REST responses bypass heavy model invocations using key-lookup caches.</p>
                <p>• Dual-mode architecture falls back to heuristics when CUDA nodes are offline.</p>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
