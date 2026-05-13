"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddOutlined from "@mui/icons-material/AddOutlined";
import AdsClickOutlined from "@mui/icons-material/AdsClickOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InsertLinkOutlined from "@mui/icons-material/InsertLinkOutlined";
import LeaderboardOutlined from "@mui/icons-material/LeaderboardOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import QrCode2Outlined from "@mui/icons-material/QrCode2Outlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DashboardLink = {
  shortPath: string;
  longPreview: string;
  destination: string;
  clicksLabel: string;
  timeLabel: string;
  createdLabel: string;
  totalClicks: string;
  totalClicksNumeric: number;
  trendLabel: string;
  topLocation: string;
  topLocationPct: string;
  topReferrer: string;
  topReferrerPct: string;
  barHeightsPct: number[];
};

export function LandingHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [range, setRange] = useState<"7" | "30">("7");

  return (
    <div className="bg-[#0b1326] font-sans text-[#dae2fd]">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 shadow-sm backdrop-blur-lg">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#8083ff]">
              <InsertLinkOutlined
                className="text-lg text-[#0d0096]"
                sx={{ fontSize: 22 }}
              />
            </div>
            <span className="text-xl font-black leading-none text-indigo-500">
              Shorten.it
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  "bg-[#c0c1ff]/10 text-[#c0c1ff]",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-[#c0c1ff]/20 hover:text-white hover:scale-[1.02] hover:opacity-90",
                )}
              >
                <DashboardOutlined sx={{ fontSize: 18 }} />
                Dashboard
              </span>
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                "bg-[#c0c1ff]/10 text-[#c0c1ff]",
                "transition-all duration-200 ease-in-out",
                "hover:bg-[#c0c1ff]/20 hover:text-white hover:scale-[1.02] hover:opacity-90",
              )}
            
            >
              <LeaderboardOutlined sx={{ fontSize: 18 }} />
              Analytics
            </span>
            </Link>
            <span className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  "bg-[#c0c1ff]/10 text-[#c0c1ff]",
                  "transition-all duration-200 ease-in-out",
                  "hover:bg-[#c0c1ff]/20 hover:text-white hover:scale-[1.02] hover:opacity-90",
                )}
              >
              <SettingsOutlined sx={{ fontSize: 18 }} />
              Settings
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <SearchOutlined
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              sx={{ fontSize: 18 }}
            />
            <input
              type="search"
              placeholder="Search links..."
              className="w-48 rounded-full border border-white/10 bg-[#131b2e] py-1.5 pr-4 pl-10 text-sm text-[#dae2fd] placeholder:text-slate-500 focus:ring-2 focus:ring-[#c0c1ff]/50 focus:outline-none lg:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center text-slate-400 transition-all hover:text-white active:scale-95"
              aria-label="Notifications"
            >
              <NotificationsNoneOutlined />
            </button>
            <div className="mx-2 h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              {session?.user?.image ? (
                <>
                  <Image
                    src={session.user.image}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-full border border-white/20 object-cover"
                    unoptimized
                  />
                  <span>
                    {session.user?.name ?? session.user?.email ?? "Signed in"}
                  </span>
                  <Button
                    size="sm"
                    className="h-9 rounded-md bg-indigo-600 px-4 text-[10px] font-semibold tracking-widest uppercase text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500 focus-visible:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 cursor-pointer"
                    onClick={async () => {
                      await signOut();
                      router.push("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="h-9 rounded-md bg-indigo-600 px-4 text-[10px] font-semibold tracking-widest uppercase text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-500 focus-visible:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  onClick={() => signIn("google")}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
