"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Newspaper,
  Wrench,
  Flame,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/workshop", label: "Workshop", icon: Wrench },
  { href: "/forge", label: "Forge", icon: Flame },
  { href: "/conversation", label: "Conversation", icon: MessageSquare },
] as const;

const SIDEBAR_COLLAPSED_W = 72;
const SIDEBAR_EXPANDED_W = 256;

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-3 border-b border-white/5">
        <Link href="/" className="flex items-center min-w-0">
          <Image
            src="/Logo.png"
            alt="Dude.Box"
            width={140}
            height={40}
            className={`transition-all duration-300 ${
              expanded || isMobile ? "h-7 w-auto" : "h-6 w-auto"
            }`}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-tactical-500/10 text-tactical-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-tactical-500/10 border border-tactical-500/20"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Icon
                className={`relative z-10 shrink-0 w-5 h-5 transition-colors ${
                  active ? "text-tactical-400" : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
              <AnimatePresence>
                {(expanded || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {!expanded && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-gray-900 text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/5 p-3">
        {status === "loading" ? (
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
        ) : session?.user ? (
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-tactical-600/50 shrink-0"
                />
              ) : (
                <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-tactical-600/20 text-xs font-bold text-tactical-400 ring-2 ring-tactical-600/30">
                  {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              <AnimatePresence>
                {(expanded || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-0 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {session.user.name?.split(" ")[0] ?? "Account"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-all"
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {(expanded || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      Admin
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {(expanded || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-tactical-400 hover:bg-white/5 transition-all"
            >
              <LogIn className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {(expanded || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-tactical-400 hover:bg-white/5 transition-all"
            >
              <User className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {(expanded || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    Create Account
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        )}
      </div>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <div className="border-t border-white/5 p-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          >
            {expanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-40 glass-panel"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* Desktop spacer */}
      <motion.div
        initial={false}
        animate={{ width: expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="hidden md:block shrink-0"
      />

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 rounded-xl glass-panel text-gray-300 hover:text-white transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 glass-panel"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
