import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StoryCard } from './components/StoryCard';
import { StoryDetail } from './components/StoryDetail';
import { ChapterReader } from './components/ChapterReader';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { db, isSupabaseConfigured } from './db';
import { Story, Chapter } from './types';
import { Search, Sparkles, Filter, Bookmark, BookOpen, Clock, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  // Navigation & Page routing state
  const [currentView, setCurrentView] = useState<string>('home'); // 'home' | 'story' | 'chapter' | 'login' | 'admin'
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  // Authenticated Admin session
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');

  // Story catalog cache
  const [stories, setStories] = useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // All tags index extracted dynamically
  const [allTags, setAllTags] = useState<string[]>(['Tất cả', 'Kỳ bí', 'Trinh thám', 'Kinh dị', 'Light Novel', 'Lãng mạn']);

  // Restore Admin Session on start
  useEffect(() => {
    const cachedSession = localStorage.getItem('goc_nho_admin_session');
    if (cachedSession) {
      setIsAdmin(true);
      setAdminEmail(cachedSession);
    }
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const list = await db.getStories();
      setStories(list);
    } catch (e) {
      console.error('Lỗi khi tải truyện App.tsx:', e);
    } finally {
      setLoading(false);
    }
  };

  // Safe navigation proxy
  const handleNavigate = (view: string, storyId?: string, chapterId?: string) => {
    setCurrentView(view);
    if (storyId) setActiveStoryId(storyId);
    if (chapterId) setActiveChapterId(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    localStorage.setItem('goc_nho_admin_session', email);
    handleNavigate('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminEmail('');
    localStorage.removeItem('goc_nho_admin_session');
    handleNavigate('home');
    loadStories(); // reload story cache
  };

  // Search/Tag Filters logic
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !activeTag || activeTag === 'Tất cả' || story.tags?.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-vintage-dark text-vintage-text flex flex-col justify-between selection:bg-vintage-gold selection:text-vintage-dark">
      
      {/* Dynamic Header */}
      <Header 
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        onLogout={handleAdminLogout}
        mockMode={!isSupabaseConfigured}
      />

      {/* Main Core View Area */}
      <div className="flex-grow">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            
            {/* Visual Header / Mystery Library Hero Banner */}
            <section className="relative overflow-hidden bg-gradient-to-b from-vintage-paper to-vintage-dark border-b border-vintage-sepia/70 py-16 px-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vintage-sepia/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-vintage-sepia text-vintage-gold border border-vintage-gold/20 text-xs font-mono font-bold tracking-widest uppercase mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> GÓC KÝ THƯ HOÀI NIỆM
                </span>
                
                <h2 className="logo-font text-4xl sm:text-5xl font-extrabold tracking-wide text-vintage-gold mt-1">
                  Thư phòng của Ninh
                </h2>
                
                <p className="story-font text-base sm:text-lg text-vintage-gray mt-5 max-w-2xl mx-auto leading-relaxed italic">
                  "Nơi ghi chép những án văn kỳ bí dở dang, những bản dịch nhẹ nhàng mang hơi hướng u uất từ các gác trọ tuyết phủ của Nhật Bản, cùng tách trà chiều ngát hương hoa nhài..."
                </p>

                {/* Main Filter & Search Hub */}
                <div className="mt-8 max-w-lg mx-auto relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-vintage-gray">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    placeholder="Tìm tên truyện, tác giả, bút tích kỳ bí..."
                    className="w-full bg-vintage-dark/80 border border-vintage-sepia hover:border-vintage-gold/30 rounded-xl py-3 pl-10 pr-4 text-sm text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold focus:ring-1 focus:ring-vintage-gold transition-all duration-300 shadow-inner"
                  />
                </div>

                {/* Literary Category Quick Selectors */}
                <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag === 'Tất cả' ? null : tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all duration-300 ${
                        (tag === 'Tất cả' && !activeTag) || activeTag === tag
                          ? 'bg-vintage-gold text-vintage-dark font-semibold border-vintage-gold scale-102 shadow-md shadow-vintage-gold/10'
                          : 'bg-vintage-dark/50 border-vintage-sepia text-vintage-gray hover:bg-vintage-sepia hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Catalog list section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
              <div className="flex items-center justify-between border-b border-vintage-sepia pb-4 mb-8">
                <h3 className="text-xl font-bold text-vintage-gold font-mono uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-vintage-gold" />
                  <span>Kệ Thư Điển Thao</span>
                </h3>
                <span className="text-xs text-vintage-gray font-mono">
                  {filteredStories.length} tác phẩm tìm thấy
                </span>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-vintage-gold border-solid"></div>
                  <p className="mt-4 text-vintage-gray font-mono text-sm">Đang thắp đèn lục kệ sách...</p>
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="text-center py-24 bg-vintage-paper rounded-xl border border-vintage-sepia">
                  <PenTool className="w-12 h-12 text-vintage-sepia mx-auto mb-3" />
                  <p className="text-vintage-gray italic mb-2">Không tìm thấy bản thảo nào khát vọng như vậy...</p>
                  <p className="text-xs text-vintage-gray/60 font-mono">Bạn có thể viết mới một truyện hoặc đổi thẻ lọc!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredStories.map((story) => (
                    <StoryCard 
                      key={story.id}
                      story={story}
                      onClick={() => handleNavigate('story', story.id)}
                    />
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        {currentView === 'story' && activeStoryId && (
          <StoryDetail 
            storyId={activeStoryId}
            onBack={() => {
              loadStories(); // reload story data (visits, views)
              handleNavigate('home');
            }}
            onNavigateToChapter={(sId, chId) => handleNavigate('chapter', sId, chId)}
          />
        )}

        {currentView === 'chapter' && activeStoryId && activeChapterId && (
          <ChapterReader 
            storyId={activeStoryId}
            chapterId={activeChapterId}
            onBackToStory={() => handleNavigate('story', activeStoryId)}
            onNavigateToChapter={(sId, chId) => handleNavigate('chapter', sId, chId)}
          />
        )}

        {currentView === 'login' && (
          <AdminLogin 
            onBackToHome={() => handleNavigate('home')}
            onLoginSuccess={handleAdminLogin}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel 
            onBackToHome={() => {
              loadStories();
              handleNavigate('home');
            }}
          />
        )}
      </div>

      {/* Global Footer with visitor counters */}
      <Footer />
      
    </div>
  );
}
