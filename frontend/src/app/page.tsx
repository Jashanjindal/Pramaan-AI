"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Mail, MessageSquare, PhoneCall, FileText, ArrowRight, Activity, Cpu, Sparkles, CheckCircle2, RefreshCw, BarChart2, XCircle, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { TiltCard } from "@/components/ui/TiltCard";

const ROTATING_CHANNELS = ["Fraud Channels.", "Email Threats.", "SMS Scams.", "Voice Frauds.", "Fake Documents."];

const STEP_INTERVAL_MS = 3200;

export default function LandingPage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const heroRef = React.useRef<HTMLElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [autoCycle, setAutoCycle] = React.useState(true);
  const [rotatingIndex, setRotatingIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, reduceMotion ? 1 : 0.15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const steps = React.useMemo(
    () => [
      {
        num: "01",
        title: "Input Channels",
        desc: "Upload documents, paste email transcripts, input SMS records, or drop phone call transcripts.",
        icon: RefreshCw,
      },
      {
        num: "02",
        title: "Data Extraction",
        desc: "Multi-layered extraction executes OCR on documents, parses headers, or maps phone transcribing markers.",
        icon: Activity,
      },
      {
        num: "03",
        title: "Embedding Fusion",
        desc: "Our MiniLM transformer maps tokens into high-dimensional vector spaces to catch contextual similarity.",
        icon: Cpu,
      },
      {
        num: "04",
        title: "Scam Classification",
        desc: "Classifiers screen the text against bank impersonation and OTP theft heuristics.",
        icon: Shield,
      },
      {
        num: "05",
        title: "Risk Engine Synthesis",
        desc: "Fusion matrix binds metadata validation with semantic threat weights into one score.",
        icon: Sparkles,
      },
      {
        num: "06",
        title: "Explainable Output",
        desc: "Detailed scoring indicators highlight text cues and suggest automated mitigations.",
        icon: BarChart2,
      },
    ],
    []
  );

  const liveStats = [
    { label: "Assets scanned", value: 128420, suffix: "+" },
    { label: "Detection accuracy", value: 99.4, suffix: "%", decimals: 1 },
    { label: "Median scan time", value: 1.8, suffix: "s", decimals: 1 },
    { label: "Channels unified", value: 4, suffix: "" },
  ];

  React.useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setRotatingIndex((i) => (i + 1) % ROTATING_CHANNELS.length), 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  React.useEffect(() => {
    if (!autoCycle || reduceMotion) return;
    const id = setInterval(() => setActiveStep((s) => (s + 1) % steps.length), STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoCycle, reduceMotion, steps.length]);

  const navLinks = (
    <>
      <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
      <a href="#comparison" className="text-gray-400 hover:text-white transition-colors">Platform Comparison</a>
      <Link href="/architecture" className="text-gray-400 hover:text-white transition-colors">Architecture</Link>
      <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
    </>
  );

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-bg-dark text-gray-100 selection:bg-primary/30 selection:text-white relative overflow-hidden"
      style={{
        "--mouse-x": `${coords.x}px`,
        "--mouse-y": `${coords.y}px`,
      } as React.CSSProperties}
    >
      <ScrollProgress />

      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-[0.25] pointer-events-none" />
      
      {/* Spotlight glow following mouse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_350px_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(37,99,235,0.06),transparent_80%)] pointer-events-none" />

      {/* Grid line scanning animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[pulse_2s_infinite]" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-gray-950/40 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <Shield className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" style={{ filter: "drop-shadow(0 0 8px rgba(37, 99, 235, 0.4))" }} />
          <span className="font-display font-bold tracking-tight text-white text-xl">PramaanAI</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm">
          {navLinks}
        </div>

        <div className="flex items-center space-x-3">
          <Link 
            href="/demo" 
            className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 cursor-pointer"
          >
            Try Live Demo
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden p-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden sticky top-[65px] z-40 overflow-hidden border-b border-white/5 bg-gray-950/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex flex-col space-y-4 px-6 py-6 text-sm">
              {navLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroFade }}
        className="px-6 md:px-12 pt-20 pb-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        <div className="space-y-8">
          <Reveal direction="right" className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-display">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Next-Gen Cybersecurity Platform</span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white leading-[1.1]">
              One Intelligence.<br />
              <span className="inline-block min-h-[1.15em] bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={ROTATING_CHANNELS[rotatingIndex]}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {ROTATING_CHANNELS[rotatingIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
              PramaanAI unifies Email, SMS, Call Transcript, and Document verification into a single AI-powered fraud detection engine with explainable results.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-wrap gap-4 pt-2">
            <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link 
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-gray-950 font-bold text-sm hover:bg-gray-100 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer group"
              >
                Try Live Demo
                <ArrowRight className="ml-2.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link 
                href="/architecture"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gray-900/50 text-white font-bold text-sm border border-white/10 hover:bg-gray-900 hover:border-white/20 transition-colors cursor-pointer"
              >
                See Architecture
              </Link>
            </motion.div>
          </Reveal>

          {/* Mini Badges */}
          <Reveal delay={0.2} className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-gray-500 border-t border-white/5">
            {[
              { icon: Mail, label: "Email Integrity", color: "text-primary" },
              { icon: MessageSquare, label: "SMS Security", color: "text-secondary" },
              { icon: PhoneCall, label: "Voice Trust", color: "text-accent" },
              { icon: FileText, label: "Document Verification", color: "text-safe" },
            ].map(({ icon: Icon, label, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: reduceMotion ? 0 : -3, color: "#f3f4f6" }}
                className="flex items-center space-x-2 cursor-default"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span>{label}</span>
              </motion.div>
            ))}
          </Reveal>
        </div>

        {/* Right Animated Graphic */}
        <motion.div style={{ y: heroParallax }} className="relative flex justify-center items-center h-[350px] md:h-[450px]">
          <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl -z-10 animate-pulse" />
          
          {/* Cyber Scanning Rings */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-primary/40 p-4"
            />
            {/* Middle Ring */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-double border-secondary/30 p-4"
            />
            {/* Inner Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-accent/20 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <span className="absolute top-0 left-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_15px_#2563EB] -translate-x-1/2" />
              <span className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_12px_#7C3AED] -translate-x-1/2" />
              <span className="absolute left-0 top-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_12px_#06B6D4] -translate-y-1/2" />
            </div>

            {/* Matrix Data Nodes */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass-panel p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center space-x-2 bg-gray-950/80"
            >
              <Mail className="h-4 w-4 text-primary" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold font-display uppercase leading-none">Email Threat</p>
                <p className="text-xs text-white font-mono leading-tight">Phishing: SPF Fail</p>
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -bottom-6 -left-6 glass-panel p-3.5 rounded-xl border border-white/10 shadow-lg flex items-center space-x-2 bg-gray-950/80"
            >
              <FileText className="h-4 w-4 text-safe" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold font-display uppercase leading-none">Document Scan</p>
                <p className="text-xs text-white font-mono leading-tight">Authentic QR Match</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Live Stats Strip */}
      <section className="px-6 md:px-12 pb-8 max-w-7xl mx-auto relative z-10">
        <Reveal className="glass-panel rounded-2xl border border-white/5 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
          {liveStats.map((stat) => (
            <div key={stat.label} className="p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                <CountUp value={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix} />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold font-display mt-1.5">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Interactive How It Works */}
      <section id="how-it-works" className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-white/5 relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">How PramaanAI Works</h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            From raw input submission to detailed contextual explanations: witness the workflow behind our threat engine.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Hover or click a stage to inspect it — the pipeline auto-advances otherwise.
          </p>
        </Reveal>

        {/* Pipeline progress rail */}
        <div className="mb-10 flex items-center gap-2">
          {steps.map((s, index) => (
            <button
              key={`rail-${s.num}`}
              type="button"
              aria-label={`Show stage ${s.num}: ${s.title}`}
              onClick={() => { setActiveStep(index); setAutoCycle(false); }}
              className="group h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden cursor-pointer"
            >
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={false}
                animate={{ width: index <= activeStep ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          onMouseEnter={() => setAutoCycle(false)}
          onMouseLeave={() => setAutoCycle(true)}
        >
          {steps.map((s, index) => {
            const Icon = s.icon;
            const active = index === activeStep;
            return (
              <Reveal key={s.num} delay={index * 0.06}>
                <TiltCard
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => { setActiveStep(index); setAutoCycle(false); }}
                  className="h-full rounded-2xl cursor-pointer"
                >
                  <div
                    className={`glass-panel h-full p-6 rounded-2xl relative border transition-colors duration-300 group overflow-hidden ${
                      active ? "border-primary/40 shadow-[0_0_40px_-12px_rgba(37,99,235,0.5)]" : "border-white/5 hover:border-white/15"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="step-active-glow"
                        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none"
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/5 font-display select-none">
                      {s.num}
                    </div>
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 transition-all duration-300 ${
                        active ? "bg-primary/25 border-primary/40 scale-110" : "bg-primary/10 border-primary/20 group-hover:scale-110"
                      }`}
                    >
                      <Icon className={`h-5 w-5 text-primary ${active && !reduceMotion ? "animate-pulse" : ""}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-display relative">{s.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed relative">{s.desc}</p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="px-6 md:px-12 py-24 max-w-5xl mx-auto border-t border-white/5 relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white">Unified Platform Strategy</h2>
          <p className="text-gray-400 text-sm md:text-base">
            Why security leaders choose PramaanAI over fragmented, legacy scanner tools.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Legacy Tools */}
          <Reveal direction="right">
            <div className="glass-panel h-full p-8 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-400 mb-6 font-display">Traditional Infrastructure</h3>
                <div className="space-y-4">
                  {[
                    "Segmented Email Spammers",
                    "Fragmented SMS alert logs",
                    "Manual telephony verification lists",
                    "Basic OCR templates without visual matching",
                    "Binary flags without explanation rules"
                  ].map((txt, i) => (
                    <motion.div
                      key={txt}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="flex items-start space-x-3 text-sm text-gray-500"
                    >
                      <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                      <span>{txt}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 mt-8">
                <p className="text-xs text-gray-500 font-medium font-mono">Prone to API sprawl and security gaps.</p>
              </div>
            </div>
          </Reveal>

          {/* PramaanAI */}
          <Reveal direction="left">
            <TiltCard className="h-full rounded-2xl" maxTilt={5}>
              <div className="glass-panel h-full p-8 rounded-2xl border border-primary/20 relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                <div className="absolute top-0 right-0 bg-primary/20 text-primary border-b border-l border-primary/30 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl font-display">
                  Enterprise Grade
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 font-display flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    PramaanAI Unified Engine
                  </h3>
                  <div className="space-y-4">
                    {[
                      "One Unified UI Interface",
                      "Cross-Channel Threat Correlation",
                      "Explainable Threat Indicators & Suggestions",
                      "Deep Document Layout Forgery checks",
                      "Transformer Embeddings + Regex rules"
                    ].map((txt, i) => (
                      <motion.div
                        key={txt}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="flex items-start space-x-3 text-sm text-gray-200"
                      >
                        <CheckCircle2 className="h-5 w-5 text-safe shrink-0 mt-0.5" />
                        <span>{txt}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/5 pt-6 mt-8">
                  <p className="text-xs text-primary font-bold font-mono">Consolidated stack. Higher response rates.</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-24 text-center relative z-10 max-w-4xl mx-auto">
        <Reveal>
          <div className="glass-panel-glow p-12 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Protect your business from multi-channel attacks.
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Deploy the PramaanAI engine to guard transaction workflows, document processing pipelines, and customer communications.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  href="/demo"
                  className="inline-block px-8 py-4 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Start Free Demo
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link 
                  href="/dashboard"
                  className="inline-block px-8 py-4 rounded-xl bg-gray-900 border border-white/10 text-white font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  System Analytics
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 text-center text-xs text-gray-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Shield className="h-4.5 w-4.5 text-primary" />
            <span className="font-display font-bold text-white">PramaanAI</span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">Process</a>
            <a href="#comparison" className="hover:text-white transition-colors">Unified Engine</a>
            <Link href="/architecture" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Analytics</Link>
          </div>
          <div>
            <p>© 2026 PramaanAI Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
