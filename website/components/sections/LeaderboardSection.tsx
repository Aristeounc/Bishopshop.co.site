'use client';

import { LEADERBOARD, getBeltColor } from '@/constants/leaderboard';
import { Badge } from '@/components/ui/Badge';

export function LeaderboardSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Badge variant="primary" className="mb-4">
              Global Rankings
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">Top Communicators</h2>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Belt</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Streak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((entry, index) => {
                  const beltColor = getBeltColor(entry.belt);
                  return (
                    <tr
                      key={entry.rank}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-brand-accent">#{entry.rank}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-100">{entry.username}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">{beltColor.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <span className="text-orange-400">🔥</span>
                          {entry.streak}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{entry.totalSessions}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Rankings update daily. Practice consistently to climb the ranks.
        </p>
      </div>
    </section>
  );
}
