import React from 'react';
import { BookOpen, UserCheck, Shield } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, storyId?: string, chapterId?: string) => void;
  isAdmin: boolean;
  onLogout?: () => void;
  mockMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  onLogout,
  mockMode
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-vintage-sepia bg-vintage-dark/95 backdrop-blur-md px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Website Title & Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 rounded-lg bg-vintage-sepia text-vintage-gold group-hover:bg-vintage-gold group-hover:text-vintage-dark transition-colors duration-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="logo-font text-2xl font-bold tracking-wider text-vintage-gold hover:text-white transition-colors duration-300">
              Góc nhỏ của Ninh
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-vintage-gray">
              Kỳ Bí • Trinh Thám • Light Novel
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              currentView === 'home'
                ? 'bg-vintage-sepia text-vintage-gold font-semibold border border-vintage-gold/20'
                : 'text-vintage-gray hover:text-vintage-text hover:bg-vintage-sepia/30'
            }`}
          >
            Trang Chủ
          </button>

          {/* Admin Panels */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  currentView === 'admin'
                    ? 'bg-vintage-gold text-vintage-dark font-bold'
                    : 'bg-vintage-sepia text-vintage-gold border border-vintage-gold/30 hover:bg-vintage-gold/20'
                }`}
              >
                <Shield className="w-4 h-4" />
                Quản trị
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-vintage-gray hover:text-vintage-gold hover:bg-vintage-sepia/35 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Đăng nhập Admin
            </button>
          )}

          {/* Database Mode Status Indicator */}
          <div className="hidden md:flex items-center ml-2">
            {mockMode ? (
              <span className="text-[11px] px-2.5 py-1 rounded bg-vintage-paper text-vintage-gold border border-vintage-gold/30" title="Đang chạy chế độ giả lập dữ liệu ngoại tuyến">
                ● Ngoại Tuyến (Demo)
              </span>
            ) : (
              <span className="text-[11px] px-2.5 py-1 rounded bg-green-950/30 text-green-400 border border-green-800/40" title="Đang kết nối cơ sở dữ liệu Supabase">
                ● Supabase Live
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
