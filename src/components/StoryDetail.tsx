import React, { useEffect, useState } from 'react';
import { Story, Chapter } from '../types';
import { db } from '../db';
import { ArrowLeft, BookOpen, Clock, Eye, User, FileText, ChevronRight } from 'lucide-react';

interface StoryDetailProps {
  storyId: string;
  onBack: () => void;
  onNavigateToChapter: (storyId: string, chapterId: string) => void;
}

export const StoryDetail: React.FC<StoryDetailProps> = ({
  storyId,
  onBack,
  onNavigateToChapter
}) => {
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedProgress, setSavedProgress] = useState<{ chapterId: string; chapterTitle: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const fetchedStory = await db.getStoryById(storyId);
        if (fetchedStory) {
          setStory(fetchedStory);
          const fetchedChapters = await db.getChaptersForStory(storyId);
          setChapters(fetchedChapters);

          // Restore last read chapter from localStorage
          const cachedProgress = localStorage.getItem(`goc_nho_progress_${storyId}`);
          if (cachedProgress) {
            try {
              const progressObj = JSON.parse(cachedProgress);
              // Verify if the chapter actually still exists in our current story index
              const matchingChapter = fetchedChapters.find(c => c.id === progressObj.chapterId);
              if (matchingChapter) {
                setSavedProgress({
                  chapterId: progressObj.chapterId,
                  chapterTitle: matchingChapter.title
                });
              }
            } catch (e) {
              console.warn('Sai định dạng progress cache:', e);
            }
          }
        }
      } catch (e) {
        console.error('Lỗi nạp thông tin truyện:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storyId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-vintage-gold border-solid"></div>
        <p className="mt-4 text-vintage-gray font-mono text-sm">Đang tìm bút tích thảo mộc...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center px-4">
        <p className="text-xl text-[#f87171] font-semibold">Ôi! Không tìm thấy truyện yêu cầu...</p>
        <button 
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 bg-vintage-sepia text-vintage-gold border border-vintage-gold/20 px-5 py-2.5 rounded-lg hover:bg-vintage-gold hover:text-vintage-dark transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Return Button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-vintage-gray hover:text-vintage-gold font-medium mb-8 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại mục lục chính
      </button>

      {/* Book Cover Banner Card */}
      <div className="bg-vintage-paper rounded-2xl border border-vintage-sepia overflow-hidden shadow-xl p-6 sm:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Cover Preview */}
        <div className="w-full md:w-56 shrink-0 h-80 rounded-xl overflow-hidden shadow-md bg-vintage-dark border border-vintage-sepia">
          <img 
            src={story.cover_url} 
            alt={story.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story details metadata */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-vintage-sepia text-vintage-gold px-2.5 py-1 rounded-sm border border-vintage-gold/20">
                {story.status}
              </span>
              <div className="flex gap-1">
                {story.tags?.map(t => (
                  <span key={t} className="text-[11px] bg-vintage-dark text-vintage-gray px-2 py-0.5 rounded border border-vintage-sepia">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-vintage-text tracking-tight mb-2">
              {story.title}
            </h2>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 py-4 border-y border-vintage-sepia/60 text-sm my-4 font-mono">
              <div className="flex items-center gap-2 text-vintage-gray">
                <User className="w-4 h-4 text-vintage-gold" />
                <span>Tác giả: </span>
                <span className="text-vintage-text font-sans font-medium">{story.author}</span>
              </div>
              <div className="flex items-center gap-2 text-vintage-gray">
                <Eye className="w-4 h-4 text-vintage-gold" />
                <span>Số lượt đọc: </span>
                <span className="text-vintage-text font-sans font-medium">{(story.views_count || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-vintage-gray col-span-2">
                <Clock className="w-4 h-4 text-vintage-gold" />
                <span>Cập nhật ngày: </span>
                <span className="text-vintage-text font-sans">
                  {new Date(story.updated_at).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <p className="text-sm text-vintage-gray leading-relaxed text-justify italic font-serif">
              "{story.description}"
            </p>
          </div>

          {/* Quick Start / Resume Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {savedProgress ? (
              <button
                onClick={() => onNavigateToChapter(storyId, savedProgress.chapterId)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-vintage-gold text-vintage-dark font-bold px-6 py-3.5 rounded-xl shadow-lg hover:brightness-110 hover:scale-102 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" /> 
                ĐỌC TIẾP: {savedProgress.chapterTitle.replace(/^Chương \d+:\s*/, '')}
              </button>
            ) : null}

            <button
              onClick={() => chapters.length > 0 ? onNavigateToChapter(storyId, chapters[0].id) : undefined}
              disabled={chapters.length === 0}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                chapters.length > 0 
                  ? 'bg-vintage-sepia text-vintage-gold border border-vintage-gold/50 cursor-pointer hover:bg-vintage-gold hover:text-vintage-dark' 
                  : 'bg-vintage-sepia/20 text-vintage-gray cursor-not-allowed border border-transparent'
              }`}
            >
              <FileText className="w-5 h-5" /> 
              {chapters.length > 0 ? 'ĐỌC TỪ ĐẦU TRUYỆN' : 'CHƯA CÓ CHƯƠNG NÀO'}
            </button>
          </div>
        </div>

      </div>

      {/* Chapters directory */}
      <div className="mt-12 bg-vintage-paper rounded-2xl border border-vintage-sepia p-6 sm:p-8 shadow-lg">
        <div className="flex items-center justify-between border-b border-vintage-sepia pb-4 mb-6">
          <h3 className="text-2xl font-bold text-vintage-gold logo-font tracking-wide">
            Mục lục chương
          </h3>
          <span className="text-xs text-vintage-gray font-mono">
            Tổng cộng: {chapters.length} chương
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-vintage-sepia mx-auto mb-3" />
            <p className="text-vintage-gray italic">Bản thảo đang được chỉnh sửa, vui lòng ghé lại sau hoặc quay lại sau giây lát!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chapter) => {
              const isLastRead = savedProgress?.chapterId === chapter.id;
              return (
                <div 
                  key={chapter.id}
                  onClick={() => onNavigateToChapter(storyId, chapter.id)}
                  className={`group p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all duration-300 ${
                    isLastRead
                      ? 'bg-vintage-gold/5 border-vintage-gold/40 shadow-sm shadow-vintage-gold/10'
                      : 'bg-vintage-dark/45 border-vintage-sepia/70 hover:bg-vintage-sepia/30 hover:border-vintage-gold/30'
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className={`text-base font-semibold group-hover:text-vintage-gold transition-colors truncate ${
                      isLastRead ? 'text-vintage-gold' : 'text-vintage-text'
                    }`}>
                      {chapter.title}
                    </span>
                    <span className="text-xs text-vintage-gray font-mono">
                      Cập nhật: {new Date(chapter.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    {isLastRead && (
                      <span className="text-[10px] bg-vintage-gold text-vintage-dark px-1.5 py-0.5 rounded font-bold font-mono">
                        Vừa đọc
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-vintage-gray group-hover:text-vintage-gold group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
