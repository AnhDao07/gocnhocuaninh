import React, { useEffect, useState } from 'react';
import { db } from '../db';
import { Users, Eye } from 'lucide-react';

export const Footer: React.FC = () => {
  const [totalVisitors, setTotalVisitors] = useState<number>(14068);
  const [activeReaders, setActiveReaders] = useState<number>(3);

  useEffect(() => {
    // Increment visitor count once per session load
    db.incrementVisitor().then((count) => {
      if (count) setTotalVisitors(count);
    });

    const fetchStats = () => {
      db.getVisitorStats().then((stats) => {
        if (stats) {
          setTotalVisitors(stats.total_visitors);
          setActiveReaders(stats.active_readers);
        }
      });
    };

    fetchStats();
    // Poll stats every 10 seconds for real-time visualization
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-vintage-dark border-t border-vintage-sepia py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Footnote information */}
        <div className="text-center md:text-left">
          <p className="logo-font text-xl text-vintage-gold tracking-wide">
            Góc nhỏ của Ninh
          </p>
          <p className="text-xs text-vintage-gray mt-1.5 max-w-sm">
            Nơi lưu trữ truyện đã up trên page. 
          </p>
        </div>

        {/* Real-time Statistics Panel */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-vintage-paper border border-vintage-sepia/60 px-5 py-3 rounded-lg shadow-inner">
          <div className="flex items-center gap-2 text-sm text-vintage-text font-mono">
            <Eye className="w-4 h-4 text-vintage-gold" />
            <span>Tổng lượt ghé thăm:</span>
            <span className="font-bold text-vintage-gold bg-vintage-dark/80 px-2 py-0.5 rounded border border-vintage-sepia/40">
              {totalVisitors.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:block text-vintage-sepia">|</div>

          <div className="flex items-center gap-2 text-sm text-vintage-text font-mono">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>Đang đọc truyện:</span>
            <span className="font-bold text-green-400 bg-vintage-dark/80 px-2 py-0.5 rounded border border-vintage-sepia/40">
              {activeReaders}
            </span>
          </div>
        </div>

        {/* Copywrite context */}
        <div className="text-center md:text-right text-xs text-vintage-gray">
          <p>© {new Date().getFullYear()} Góc nhỏ của Ninh. All rights reserved.</p>
          <p className="mt-1">Thiết kế bởi Mộ Ninh.</p>
        </div>

      </div>
    </footer>
  );
};
