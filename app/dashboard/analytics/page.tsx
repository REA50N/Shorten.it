"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useAllLink } from "@/hooks/useAllLink";
import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const { data: allLinks, isLoading } = useAllLink();

  const [searchTerm, setSearchTerm] = useState("");

  const totalClicks = useMemo(() => {
    return (
      allLinks?.reduce(
        (sum: number, link: PrismaLink) => sum + (link.clicks || 0),
        0,
      ) || 0
    );
  }, [allLinks]);

  const totalLinks = allLinks?.length || 0;

  const avgClicks = useMemo(() => {
    return totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;
  }, [totalClicks, totalLinks]);

  const filteredLinks = useMemo(() => {
    if (!allLinks) return [];
    if (!searchTerm) return allLinks;

    return allLinks.filter(
      (link: PrismaLink) =>
        link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.longUrl.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allLinks, searchTerm]);

  // Loading & Auth
  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">Loading analytics...</p>
      </div>
    );
  }

  if (!session) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-slate-500 mt-2">
          Track the performance of your shortened links
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Clicks" value={totalClicks} />
        <StatCard title="Total Links" value={totalLinks} />
        <StatCard title="Avg. Clicks per Link" value={avgClicks} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#171f33]/70">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="text-lg font-semibold">All Links Performance</h2>

          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c0c1ff] w-full sm:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                <th className="text-left px-8 py-5">Short URL</th>
                <th className="text-left px-8 py-5">Destination URL</th>
                <th className="text-right px-8 py-5">Clicks</th>
                <th className="text-right px-8 py-5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    {searchTerm ? "No matching links found" : "No links yet"}
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link: PrismaLink) => (
                  <tr
                    key={link.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-8 py-5 font-mono text-[#c0c1ff]">
                      {link.shortUrl}
                    </td>
                    <td className="px-8 py-5 text-slate-400 truncate max-w-md">
                      {link.longUrl}
                    </td>
                    <td className="px-8 py-5 text-right font-semibold">
                      {link.clicks || 0}
                    </td>
                    <td className="px-8 py-5 text-right text-sm text-slate-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#171f33]/70 p-8">
      <p className="text-sm uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <p className="text-5xl font-semibold mt-4">{value.toLocaleString()}</p>
    </div>
  );
}
