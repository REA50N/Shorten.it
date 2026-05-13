"use client";

import { useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

import AddOutlined from "@mui/icons-material/AddOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InsertLinkOutlined from "@mui/icons-material/InsertLinkOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import QrCode2Outlined from "@mui/icons-material/QrCode2Outlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import AdsClickOutlined from "@mui/icons-material/AdsClickOutlined";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAllLink } from "@/hooks/useAllLink";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";

import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHeroStats } from "@/hooks/useHeroStats";

const glassCard =
  "rounded-3xl border border-white/10 bg-[rgba(23,31,51,0.75)] backdrop-blur-2xl";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function mapLinkToActive(link: PrismaLink) {
  return {
    shortPath: link.shortUrl,
    destination: link.longUrl,
    createdLabel: `Created ${new Date(link.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    )}`,
    totalClicks: link.clicks.toString(),
    totalClicksNumeric: link.clicks,
  };
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1326] font-sans text-[#dae2fd]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="absolute inset-0 bg-[radial-gradient(1400px_800px_at_top_left,#1e2937_0%,#0b1326_70%)]" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedSlug, setEditedSlug] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: heroStats } = useHeroStats();

  const {
    data: allLinks,
    isLoading: allLinksLoading,
    refetch: refetchAllLinks,
  } = useAllLink();

  const [currentLink, setCurrentLink] = useState<PrismaLink | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const stats = [
    {
      title: "Network activity",
      value: heroStats?.totalLinks || 0,
      label: "Links Shortened",
    },
    {
      title: "Global traffic",
      value: heroStats?.totalClicks || 0,
      label: "Total Clicks",
    },
  ];

  const active = useMemo(
    () => (currentLink ? mapLinkToActive(currentLink) : null),
    [currentLink],
  );

  const shortUrl = useMemo(() => {
    if (!active?.shortPath) return "";
    return typeof window !== "undefined"
      ? `${window.location.origin}/u/${active.shortPath}`
      : `https://${active.shortPath}`;
  }, [active]);

  const handleUpdateSlug = async () => {
    if (!currentLink) return;

    setIsUpdating(true);

    try {
      const res = await fetch("/api/short", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldSlug: currentLink.shortUrl,
          newSlug: editedSlug.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        toast.error(data.error || "Failed to update");
        return;
      }

      toast.success("Slug updated");

      setEditDialogOpen(false);

      refetchAllLinks();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };
  const handleDelete = async () => {
    if (!currentLink) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/short", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ short_url: currentLink.shortUrl }),
      });

      if (res.ok) {
        toast.success("Link deleted successfully");
        setCurrentLink(null);
        setDeleteDialogOpen(false);
        refetchAllLinks();
      } else {
        toast.error("Failed to delete link");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  // ==================== SESSION MANAGEMENT ====================

  if (status === "loading") {
    console.log(status, session);
    console.log("inside loading");
    return (
      <DashboardShell>
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-mono text-sm text-zinc-500">
            Loading dashboard...
          </p>
        </div>
      </DashboardShell>
    );
  }
  if (!session) {
    console.log("inside !session");
    console.log(status, session);

    return (
      <DashboardShell>
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
          <div className="mx-auto max-w-md text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              DASHBOARD
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-100">
              Login to manage your links
            </h1>
            <p className="mt-3 text-slate-500">
              Your short links and detailed analytics appear here after signing
              in.
            </p>
            <Button
              onClick={() => signIn("google")}
              className="mt-8 px-8 py-3 text-base font-semibold bg-[#c0c1ff] text-[#0d0096] hover:bg-[#c0c1ff]/90"
            >
              Continue with Google
            </Button>
            <p className="mt-8">
              <Link
                href="/"
                className="text-sm text-zinc-400 hover:text-zinc-200 underline-offset-4 hover:underline"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }
  // ==================== AUTHENTICATED DASHBOARD ====================

  return (
    <DashboardShell>
      <main className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter">
              Dashboard
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your short links and analytics
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#c0c1ff] text-[#0d0096] hover:bg-[#c0c1ff]/90 gap-2"
          >
            <Link href="/">
              <AddOutlined /> Create New Link
            </Link>
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-80 lg:block">
            <div className="sticky top-8 rounded-3xl border border-white/10 bg-[#171f33]/80 backdrop-blur-xl p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
                YOUR LINKS
              </h3>

              {allLinksLoading ? (
                <p className="py-12 text-center text-slate-500">Loading...</p>
              ) : allLinks?.length === 0 ? (
                <p className="py-12 text-center text-slate-500">
                  No links created yet
                </p>
              ) : (
                <div className="space-y-2">
                  {allLinks?.map((link: PrismaLink) => (
                    <button
                      key={link.shortUrl}
                      onClick={() => setCurrentLink(link)}
                      className={cn(
                        "w-full rounded-2xl px-5 py-4 text-left transition-all hover:bg-white/5",
                        currentLink?.shortUrl === link.shortUrl &&
                          "bg-white/10 border border-white/20",
                      )}
                    >
                      <div className="font-mono text-lg font-semibold text-white">
                        {link.shortUrl}
                      </div>
                      <div className="mt-1 line-clamp-1 text-xs text-slate-400">
                        {link.longUrl}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {!active ? (
              <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-white/5 bg-[#171f33]/40">
                <div className="text-center">
                  <InsertLinkOutlined
                    sx={{ fontSize: 80 }}
                    className="mx-auto mb-6 text-slate-600"
                  />
                  <p className="text-xl text-slate-400">
                    Select a link from the sidebar to view details
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Link Header */}
                <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-[#171f33]/70 p-8 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-semibold tracking-tight">
                        {active.shortPath}
                      </h2>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </div>
                    <p className="mt-1 text-slate-500">{active.createdLabel}</p>
                  </div>

                  <div className="flex gap-3">
                    <Dialog
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <EditOutlined /> Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Slug</DialogTitle>
                          <DialogDescription>
                            Change your short URL slug.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-6">
                          <input
                            value={editedSlug}
                            onChange={(e) => setEditedSlug(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                            placeholder="Enter new slug"
                          />

                          <p className="text-xs text-slate-500">
                            {typeof window !== "undefined" &&
                              window.location.origin}
                            /u/{editedSlug}
                          </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>

                          <Button
                            onClick={handleUpdateSlug}
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Updating..." : "Save Changes"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <DeleteOutlineOutlined /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete this short link?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. The link will stop
                            working immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Yes, Delete Link"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Short URL & Destination + QR Code Dialog */}
                <div className={glassCard + " p-8"}>
                  <div className="grid gap-10 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                        SHORT URL
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="font-mono  font-bold text-[#c0c1ff] break-all">
                          {shortUrl}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(shortUrl);
                              toast.success("Copied to clipboard");
                            }}
                          >
                            <ContentCopyOutlined />
                          </Button>

                          <Dialog
                            open={qrDialogOpen}
                            onOpenChange={setQrDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <QrCode2Outlined />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-center">
                                  QR Code
                                </DialogTitle>
                                <DialogDescription className="text-center text-sm">
                                  {shortUrl}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-center py-10 bg-white rounded-2xl">
                                <QRCode
                                  value={shortUrl}
                                  size={240}
                                  bgColor="#ffffff"
                                  fgColor="#0b1326"
                                />
                              </div>
                              <p className="text-center text-xs text-slate-500">
                                Scan this code to open the link instantly
                              </p>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                        DESTINATION
                      </label>
                      <div className="rounded-2xl border border-white/5 bg-black/40 p-5 text-sm text-slate-300 break-all">
                        {active.destination}{" "}
                        <a
                          href={active.destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-[#c0c1ff] hover:underline"
                          onClick={() => {
                            console.log(active.destination);
                          }}
                        >
                          Visit original link{" "}
                          <OpenInNewOutlined fontSize="small" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
