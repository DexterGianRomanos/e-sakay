'use client';

import React, { useState } from 'react';
import { AlertCircle, MessageSquarePlus, X } from 'lucide-react';

export const CrowdsourcedReporterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reports, setReports] = useState([
    { id: 1, loc: 'Maasin Terminal', msg: 'Heavy queue for Sogod-bound PUVs.', time: '10 mins ago' },
    { id: 2, loc: 'Tomas Oppus', msg: 'Road work near SLSU campus, slight delay.', time: '25 mins ago' },
  ]);
  const [terminal, setTerminal] = useState('Maasin Integrated Terminal');
  const [issue, setIssue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;
    setReports([{ id: Date.now(), loc: terminal, msg: issue, time: 'Just now' }, ...reports]);
    setIssue('');
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all"
      >
        <MessageSquarePlus className="w-4 h-4" />
        Report Traffic / Overcharge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Commuter Report
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Terminal / Location</label>
                <input
                  type="text"
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Report Details</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Overcharging above LTFRB matrix or long queues..."
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Submit Community Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};