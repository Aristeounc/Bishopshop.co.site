'use client';

import { motion } from 'framer-motion';
import { LEADERBOARD, getBeltColor } from '@/constants/leaderboard';
import { Badge } from '@/components/ui/Badge';

export function LeaderboardSection() {
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <Badge variant="primary" className="mb-4">
              Global Rankings
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">Top Communicators</h2>
          </div>
        </motion.div>

        {/* Leaderboard table */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
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
                    <motion.tr
                      key={entry.rank}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-50px' }}
                      whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                    >
                      <td className="px-6 py-4">
                        <motion.span
                          className="text-lg font-bold text-brand-accent"
                          whileHover={{ scale: 1.1 }}
                        >
                          #{entry.rank}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-100">{entry.username}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="neutral">{beltColor.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <motion.span
                            className="text-orange-400"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                          >
                            🔥
                          </motion.span>
                          {entry.streak}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{entry.totalSessions}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center text-slate-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          Rankings update daily. Practice consistently to climb the ranks.
        </motion.p>
      </div>
    </section>
  );
}
