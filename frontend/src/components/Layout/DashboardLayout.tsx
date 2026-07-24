"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  Play, 
  Binary, 
  History, 
  Menu, 
  X, 
  Bell, 
  Settings, 
  LogOut,
  User,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Keyboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/CommandPalette";
import { useHistoryStore } from "@/store/historyStore";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  const notifications = useHistoryStore((state) => state.notifications);
  const markNotificationsAsRead = useHistoryStore((state) => state.markNotificationsAsRead);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Live Demo", href: "/demo", icon: Play },
    { name: "Architecture", href: "/architecture", icon: Binary },
    { name: "Scan History", href: "/history", icon: History },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-gray-100 flex flex-col md:flex-row relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-bg opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary animate-glow" />
          <span className="font-display font-bold tracking-tight text-white text-lg">PramaanAI</span>
        </Link>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="text-gray-400 hover:text-white p-1 focus:outline-none"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-gray-950/60 backdrop-blur-xl p-6 shrink-0 z-30 sticky top-0 h-screen">
        <Link href="/" className="flex items-center space-x-2.5 mb-8 group cursor-pointer">
          <Shield className="h-7 w-7 text-primary group-hover:rotate-6 transition-transform duration-350" style={{ filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.5))" }} />
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">PramaanAI</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold font-display">Fraud Intelligence</p>
          </div>
        </Link>

        <nav className="space-y-1.5 grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  active 
                    ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 mr-3 transition-colors ${active ? "text-primary" : "text-gray-400 group-hover:text-gray-300"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/5 pt-4 space-y-3.5">
          <button 
            onClick={() => setShowShortcuts(true)}
            className="w-full flex items-center text-xs text-gray-500 hover:text-gray-300 px-2 py-1.5 rounded-lg transition-colors text-left focus:outline-none cursor-pointer"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Keyboard Shortcuts
          </button>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                PA
              </div>
              <div className="ml-2.5 text-left">
                <p className="text-xs font-semibold text-white leading-tight">Admin Demo</p>
                <p className="text-[10px] text-gray-500 font-medium">Enterprise Tier</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-40 bg-gray-950 p-6 flex flex-col md:hidden pt-20"
          >
            <nav className="space-y-2 grow">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                      active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 text-gray-400" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-gray-500">PramaanAI Enterprise v1.0.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-gray-950/20 backdrop-blur-md sticky top-0 z-20">
          <div className="text-sm font-semibold tracking-wide text-gray-400 font-display">
            {pathname === "/dashboard" && "Platform Analytics"}
            {pathname === "/demo" && "Unified AI Threat Verification"}
            {pathname === "/architecture" && "Engine Dataflow Graph"}
            {pathname === "/history" && "Fraud Analysis Ledger"}
          </div>

          <div className="flex items-center space-x-4">
            <CommandPalette />

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={handleNotificationsClick}
                className="p-2 rounded-xl border border-white/5 hover:border-white/15 bg-gray-900/40 text-gray-400 hover:text-white transition-all relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 glass-panel-glow bg-gray-950/95 rounded-xl border border-white/10 shadow-2xl p-4 z-40 max-h-[400px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                        <span className="text-xs font-bold text-white font-display">System Notifications</span>
                        <span className="text-[10px] text-primary cursor-pointer hover:underline" onClick={() => toast.success("Marked all as read")}>Clear all</span>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start text-xs text-gray-300">
                            {n.type === "warning" ? (
                              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mr-2 mt-0.5" />
                            ) : n.type === "success" ? (
                              <CheckCircle2 className="h-4 w-4 text-safe shrink-0 mr-2 mt-0.5" />
                            ) : (
                              <Info className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                            )}
                            <div>
                              <p className="leading-snug">{n.message}</p>
                              <span className="text-[9px] text-gray-500 font-medium block mt-1">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shadow-md border border-white/10">
                  PA
                </div>
              </button>

              <AnimatePresence>
                {showProfile && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfile(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 glass-panel-glow bg-gray-950/95 rounded-xl border border-white/10 shadow-2xl p-2 z-40"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                        <p className="text-xs font-bold text-white font-display">Pramaan Admin</p>
                        <p className="text-[10px] text-gray-500">admin@pramaan.ai</p>
                      </div>
                      <button 
                        onClick={() => { setShowProfile(false); toast("Profile configurations are read-only in Demo mode."); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        Account Profile
                      </button>
                      <button 
                        onClick={() => { setShowProfile(false); toast("System settings locked by developer."); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                      >
                        <Settings className="h-4 w-4 mr-2 text-gray-400" />
                        Platform Settings
                      </button>
                      <button 
                        onClick={() => { setShowProfile(false); toast.success("Signed out of demo session."); }}
                        className="w-full flex items-center px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-red-400" />
                        Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-sm border border-white/10 rounded-xl bg-gray-950/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4">
            <Keyboard className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-white font-display">System Shortcuts</h3>
          </div>
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center text-gray-300">
              <span>Open Command Palette</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-400">Ctrl + K</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Close active popup</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-400">ESC</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span>Mark alerts as read</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-400">Auto on click</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
