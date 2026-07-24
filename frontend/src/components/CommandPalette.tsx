"use client";

import * as React from "react";
import { Search, Home, Play, Info, History, Shield, Keyboard, Trash, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { useHistoryStore } from "@/store/historyStore";
import toast from "react-hot-toast";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
    setQuery("");
  };

  const commands = [
    {
      group: "Navigation",
      items: [
        {
          name: "Go to Landing Page",
          icon: Home,
          action: () => router.push("/"),
        },
        {
          name: "Open Dashboard",
          icon: Shield,
          action: () => router.push("/dashboard"),
        },
        {
          name: "Run Live Demo",
          icon: Play,
          action: () => router.push("/demo"),
        },
        {
          name: "View Architecture",
          icon: Info,
          action: () => router.push("/architecture"),
        },
        {
          name: "View Scan History",
          icon: History,
          action: () => router.push("/history"),
        },
      ],
    },
    {
      group: "Preferences",
      items: [
        {
          name: `Toggle Theme (Current: ${theme})`,
          icon: theme === "dark" ? Sun : Moon,
          action: () => {
            setTheme(theme === "dark" ? "light" : "dark");
            toast.success(`Theme switched to ${theme === "dark" ? "light" : "dark"}`);
          },
        },
        {
          name: "Clear All Scan History",
          icon: Trash,
          action: () => {
            clearHistory();
            toast.success("Scan history cleared successfully.");
          },
        },
      ],
    },
  ];

  const filteredCommands = commands
    .map((group) => ({
      group: group.group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-gray-900/40 text-gray-400 hover:text-white transition-all text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 select-none cursor-pointer"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search commands...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border border-white/10 rounded-xl bg-gray-950/95 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center border-b border-white/5 p-4">
            <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-sm"
              autoFocus
            />
            <kbd className="pointer-events-none inline-flex select-none items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-400 border border-white/5">
              ESC
            </kbd>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
            {filteredCommands.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                No commands found matching &quot;{query}&quot;
              </div>
            ) : (
              filteredCommands.map((group) => (
                <div key={group.group} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-medium tracking-wider text-gray-500 uppercase font-display">
                    {group.group}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => runCommand(item.action)}
                          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left focus:outline-none focus:bg-white/5 cursor-pointer"
                        >
                          <Icon className="h-4 w-4 mr-3 text-gray-400 shrink-0" />
                          <span className="grow">{item.name}</span>
                          <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Execute
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 bg-black/40 px-4 py-2.5 text-xs text-gray-500 select-none">
            <span className="flex items-center">
              <Keyboard className="h-3.5 w-3.5 mr-1" /> Navigation Panel
            </span>
            <span className="flex items-center space-x-3">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
