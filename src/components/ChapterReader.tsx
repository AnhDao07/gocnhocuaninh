import React, { useEffect, useState } from 'react';
import { Chapter, Story } from '../types';
import { db } from '../db';
import { ArrowLeft, ChevronLeft, ChevronRight, Type, BookOpen, Settings, Layout, ZoomIn, ZoomOut } from 'lucide-react';

interface ChapterReaderProps {
  storyId: string;
  chapterId: string;
  onBackToStory: () => void;
  onNavigateToChapter: (storyId: string, chapterId: string) => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({
  storyId,
  chapterId,
  onBackToStory,
  onNavigateToChapter
}) => {
  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings
  const [fontSize, setFontSize] = useState<number>(() => {
    return Number(localStorage.getItem('goc_nho_font_size') || '18');
  });
  const [themeMode, setThemeMode] = useState<'sepia' | 'slate' | 'charcoal'>(() => {
    return (localStorage.getItem('goc_nho_theme_mode') as 'sepia' | 'slate' | 'charcoal') || 'sepia';
  });

  useEffect(() => {
    async function loadChapterData() {
      setLoading(true);
      try {
        const fetchStory = await db.getStoryById(storyId);
        if (fetchStory) setStory(fetchStory);

        const fetchCh = await db.getChapterById(chapterId);
        if (fetchCh) {
          setChapter(fetchCh);

          // Save current read milestone to localStorage
          localStorage.setItem(
            `goc_nho_progress_${storyId}`,
            JSON.stringify({
              chapterId: chapterId,
              title: fetchCh.title,
              timestamp: Date.now()
            })
          );
        }

        const fetchAllChs = await db.getChaptersForStory(storyId);
        setAllChapters(fetchAllChs);
      } catch (e) {
        console.error('Lỗi khi tải chương:', e);
      } finally {
        setLoading(false);
      }
    }
    loadChapterData();
  }, [storyId, chapterId]);

  // Handle font size change with persistent localStorage
  const adjustFontSize = (delta: number) => {
    const nextSize = Math.max(14, Math.min(32, fontSize + delta));
    setFontSize(nextSize);
    localStorage.setItem('goc_nho_font_size', nextSize.toString());
  };

  const adjustTheme = (mode: 'sepia' | 'slate' | 'charcoal') => {
    setThemeMode(mode);
    localStorage.setItem('goc_nho_theme_mode', mode);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-vintage-gold border-solid"></div>
        <p className="mt-4 text-vintage-gray font-mono text-sm">Đang thắp nến gom nghiên chữ...</p>
      </div>
    );
  }

  if (!chapter || !story) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center px-4">
        <p className="text-xl text-[#f87171] font-semibold">Ối! Nội dung chương chưa chuẩn bị kịp...</p>
        <button 
          onClick={onBackToStory}
          className="mt-6 inline-flex items-center gap-2 bg-vintage-sepia text-vintage-gold border border-vintage-gold/20 px-5 py-2.5 rounded-lg hover:bg-vintage-gold hover:text-vintage-dark transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại lầu sách / lục truyện
        </button>
      </div>
    );
  }

  // Find index for Previous and Next pagination
  const currentIndex = allChapters.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // Format Content paragraphs with automatic spacing and indents
  const formattedParagraphs = chapter.content
    .split(/\n\s*\n|\n/) // support multiple double line-breaks or single ones
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Background and text styles for different reading modes
  const themeClasses = {
    sepia: 'bg-[#0f0e0d] border-[#2a2622] text-[#d4cebd]', // Sophisticated Dark theme background
    slate: 'bg-[#12141c] border-[#1f2330] text-[#e2e8f0]', // calm modern slate
    charcoal: 'bg-[#050505] border-[#161616] text-[#b5af9f]' // extra deep velvet dark
  };

  const activeThemeClass = themeClasses[themeMode];

  return (
    <div className={`min-h-screen text-vintage-text transition-colors duration-300 ${activeThemeClass.split(' ')[0]}`}>
      
      {/* Top Reading Bar Controls */}
      <div className="sticky top-[0px] z-40 bg-zinc-950/80 backdrop-blur border-b border-white/5 px-4 sm:px-6 py-3 shadow">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToStory}
            className="flex items-center gap-2 text-xs sm:text-sm text-vintage-gray hover:text-vintage-gold transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mục lục truyện</span>
          </button>

          <span className="text-xs text-vintage-gray font-serif truncate max-w-[150px] sm:max-w-[300px]">
            {story.title}
          </span>

          {/* Reader Preferences Bar */}
          <div className="flex items-center gap-2.5">
            {/* Font Increase/Decrease Buttons */}
            <div className="flex bg-black/40 border border-white/10 rounded-md p-0.5">
              <button 
                onClick={() => adjustFontSize(-1)}
                className="p-1 text-vintage-gray hover:text-white hover:bg-white/5 rounded transition"
                title="Giảm kích thước chữ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="px-1.5 flex items-center text-[11px] font-bold font-mono text-vintage-gold">
                {fontSize}px
              </div>
              <button 
                onClick={() => adjustFontSize(1)}
                className="p-1 text-vintage-gray hover:text-white hover:bg-white/5 rounded transition"
                title="Tăng kích thước chữ"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Reading Background Color Pickers */}
            <div className="hidden sm:flex self-stretch items-center gap-1.5 bg-black/40 border border-white/10 rounded-md p-1">
              <button
                onClick={() => adjustTheme('sepia')}
                className={`w-4.5 h-4.5 rounded-full bg-[#0f0e0d] border ${themeMode === 'sepia' ? 'border-[#c5a16f]' : 'border-transparent'}`}
                title="Chế độ Sophisticated Dark"
              />
              <button
                onClick={() => adjustTheme('slate')}
                className={`w-4.5 h-4.5 rounded-full bg-[#12141c] border ${themeMode === 'slate' ? 'border-sky-400' : 'border-transparent'}`}
                title="Chế độ Đêm Xám"
              />
              <button
                onClick={() => adjustTheme('charcoal')}
                className={`w-4.5 h-4.5 rounded-full bg-[#050505] border ${themeMode === 'charcoal' ? 'border-zinc-400' : 'border-transparent'}`}
                title="Chế độ Tối Thượng"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reading Article Paper layout */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <article className="story-font select-text">
          
          {/* Cover / Preface subtitle */}
          <div className="text-center mb-12 pb-8 border-b border-vintage-sepia/30">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-vintage-gold tracking-tight leading-loose">
              {chapter.title}
            </h1>
            <p className="text-sm font-sans tracking-wide text-vintage-gray mt-3 flex items-center justify-center gap-2 uppercase">
              <span>{story.author}</span>
              <span>•</span>
              <span>Giống: {chapter.chapter_number}</span>
            </p>
          </div>

          {/* Reading Paragraph Panels */}
          <div 
            className="chapter-content leading-relaxed text-justify antialiased"
            style={{ 
              fontSize: `${fontSize}px`, 
              color: themeMode === 'sepia' ? '#eedfc5' : themeMode === 'slate' ? '#e2e8f0' : '#cfcfcf'
            }}
          >
            {formattedParagraphs.map((para, index) => (
              <p 
                key={index} 
                style={{ marginBottom: `${fontSize * 1.0}px`, lineHeight: 1.95 }}
                className="story-font"
              >
                {para}
              </p>
            ))}
          </div>

        </article>

        {/* Dynamic Pagination Controls */}
        <div className="mt-16 pt-8 border-t border-vintage-sepia flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-sm">
          
          <button
            onClick={() => prevChapter && onNavigateToChapter(storyId, prevChapter.id)}
            disabled={!prevChapter}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition-all ${
              prevChapter
                ? 'bg-vintage-paper text-vintage-gold border-vintage-sepia hover:bg-vintage-sepia/40 hover:text-white cursor-pointer'
                : 'text-vintage-gray/40 border-vintage-sepia/20 cursor-not-allowed opacity-50 bg-black/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Chương trước</span>
          </button>

          <button
            onClick={onBackToStory}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vintage-sepia/40 border border-vintage-sepia/60 text-vintage-text px-5 py-3 rounded-lg hover:bg-vintage-sepia hover:text-vintage-gold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Xem danh sách chương</span>
          </button>

          <button
            onClick={() => nextChapter && onNavigateToChapter(storyId, nextChapter.id)}
            disabled={!nextChapter}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border transition-all ${
              nextChapter
                ? 'bg-vintage-paper text-vintage-gold border-vintage-sepia hover:bg-vintage-sepia/40 hover:text-white cursor-pointer'
                : 'text-vintage-gray/40 border-vintage-sepia/20 cursor-not-allowed opacity-50 bg-black/10'
            }`}
          >
            <span>Chương sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </main>

    </div>
  );
};
