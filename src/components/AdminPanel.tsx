import React, { useState, useEffect } from 'react';
import { Story, Chapter } from '../types';
import { db, isSupabaseConfigured } from '../db';
import { Plus, Edit2, Trash2, BookOpen, FileText, Landmark, Save, ArrowLeft, Image, Sparkles, Check } from 'lucide-react';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // States for Editing Stories
  const [storyId, setStoryId] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyAuthor, setStoryAuthor] = useState('');
  const [storyCoverUrl, setStoryCoverUrl] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyStatus, setStoryStatus] = useState('Đang tiến hành');
  const [storyTagsString, setStoryTagsString] = useState('');

  // States for Editing Chapters
  const [chapterId, setChapterId] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [chapterContent, setChapterContent] = useState('');

  // Loading & Message flags
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'crit' } | null>(null);
  const [activeTab, setActiveTab] = useState<'stories' | 'chapters'>('stories');

  // Load baseline values
  useEffect(() => {
    loadStories();
  }, []);

  const showMsg = (text: string, type: 'success' | 'crit' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadStories = async () => {
    setLoading(true);
    try {
      const list = await db.getStories();
      setStories(list);
    } catch (e) {
      console.error('Error loading stories:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async (sId: string) => {
    try {
      const list = await db.getChaptersForStory(sId);
      setChapters(list);
    } catch (e) {
      console.error('Lỗi nạp chương:', e);
    }
  };

  // Select a novel to operate chapters or details on
  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setStoryId(story.id);
    setStoryTitle(story.title);
    setStoryAuthor(story.author);
    setStoryCoverUrl(story.cover_url);
    setStoryDescription(story.description);
    setStoryStatus(story.status);
    setStoryTagsString(story.tags?.join(', ') || '');

    // Load chapters
    loadChapters(story.id);
    // Reset chapter editors
    handleResetChapterForm();
  };

  const handleResetStoryForm = () => {
    setSelectedStory(null);
    setStoryId('');
    setStoryTitle('');
    setStoryAuthor('');
    setStoryCoverUrl('');
    setStoryDescription('');
    setStoryStatus('Đang tiến hành');
    setStoryTagsString('');
    setChapters([]);
    handleResetChapterForm();
  };

  const handleResetChapterForm = () => {
    setSelectedChapter(null);
    setChapterId('');
    setChapterTitle('');
    setChapterNumber(chapters.length + 1);
    setChapterContent('');
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyAuthor) {
      showMsg('Vui lòng điền đủ Tiêu truyện và Tên tác giả!', 'crit');
      return;
    }

    setLoading(true);
    try {
      const payload: Omit<Story, 'created_at' | 'updated_at'> = {
        id: storyId || 'temp_' + Date.now(),
        title: storyTitle,
        author: storyAuthor,
        description: storyDescription,
        cover_url: storyCoverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
        status: storyStatus,
        tags: storyTagsString.split(',').map(t => t.trim()).filter(t => t.length > 0)
      };

      const result = await db.saveStory(payload);
      showMsg(`Đã lưu câu chuyện "${result.title}" thành công!`);
      await loadStories();
      handleSelectStory(result);
    } catch (e: any) {
      showMsg('Thất bại khi lưu truyện: ' + e.message, 'crit');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Vạn phần lưu ý! Bạn có thực sự muốn xóa tác phẩm này cùng tất cả chương truyện đi kèm không? Hành động này không thể hoàn tác.')) return;
    setLoading(true);
    try {
      await db.deleteStory(id);
      showMsg('Đã xóa bỏ tác phẩm khỏi lầu sách!');
      handleResetStoryForm();
      await loadStories();
    } catch (e: any) {
      showMsg('Thất bại khi xóa truyện: ' + e.message, 'crit');
    } finally {
      setLoading(false);
    }
  };

  // Chapter operation blocks
  const handleSelectChapter = (ch: Chapter) => {
    setSelectedChapter(ch);
    setChapterId(ch.id);
    setChapterTitle(ch.title);
    setChapterNumber(ch.chapter_number);
    setChapterContent(ch.content);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) {
      showMsg('Vui lòng chọn cốt truyện chính trước khi tạo chương!', 'crit');
      return;
    }
    if (!chapterTitle || !chapterContent) {
      showMsg('Vui lòng soạn Tiêu đề chương và Nội dung truyền kỳ!', 'crit');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: chapterId || undefined,
        story_id: storyId,
        title: chapterTitle,
        chapter_number: Number(chapterNumber),
        content: chapterContent
      };

      const saved = await db.saveChapter(payload);
      showMsg(`Đã khắc ấn thành công "${saved.title}"!`);
      handleResetChapterForm();
      await loadChapters(storyId);
    } catch (e: any) {
      showMsg('Lỗi chép thảo chương truyện: ' + e.message, 'crit');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn thiêu hủy bản thảo chương này chứ?')) return;
    setLoading(true);
    try {
      await db.deleteChapter(id);
      showMsg('Tẩy xóa bản thảo chương xưa thành công!');
      handleResetChapterForm();
      await loadChapters(storyId);
    } catch (e: any) {
      showMsg('Lỗi tẩy xóa chương truyện: ' + e.message, 'crit');
    } finally {
      setLoading(false);
    }
  };

  // Helper feature: Clean copy-pasted novel text
  const handleFormatChapterContent = () => {
    if (!chapterContent) return;
    // Strip leading indent gaps, trim sentences, remove multiple empty lines
    const cleaned = chapterContent
      .split('\n')
      .map(line => line.trim())
      .filter((line, i, arr) => line !== '' || (arr[i - 1] !== '' && i > 0)) // keep max 1 blank line
      .join('\n\n');
    setChapterContent(cleaned);
    showMsg('Đã chuẩn hóa định dạng dòng và thụt lề!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Banner / Info Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="logo-font text-3xl font-bold text-vintage-gold flex items-center gap-2">
            Khu quản trị thảo bản
          </h2>
          <p className="text-xs text-vintage-gray mt-1">
            Chỉnh sửa thư tịch, cập nhật tiến trình viết truyện tại Góc nhỏ của Ninh.
          </p>
        </div>

        <button 
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm text-vintage-gray hover:text-white px-4 py-2 rounded-lg bg-vintage-sepia/70 border border-vintage-sepia hover:border-vintage-gold/30 transition-all cursor-pointer self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang chủ độc giả
        </button>
      </div>

      {/* Database Setup Check Banner */}
      <div className={`p-4 rounded-xl border mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${
        isSupabaseConfigured 
          ? 'bg-green-950/20 border-green-800/40 text-green-300' 
          : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${isSupabaseConfigured ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">
              {isSupabaseConfigured ? 'Kết nối cơ sở dữ liệu Supabase: HOẠT ĐỘNG' : 'Đang sử dụng bộ nhớ giả lập LocalStorage'}
            </p>
            <p className="text-xs opacity-85 mt-0.5 max-w-xl">
              {isSupabaseConfigured 
                ? 'Mọi thay đổi của bạn sẽ được lưu trực tiếp vào cơ sở dữ liệu Supabase PostgreSQL thực tế.' 
                : 'Bạn đang chỉnh sửa trong chế độ giả lập. Dữ liệu lưu an toàn vào trình duyệt của bạn (localStorage) để trải nghiệm liền mạch mà không bị treo lỗi.'}
            </p>
          </div>
        </div>
        {!isSupabaseConfigured && (
          <span className="text-[10px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold px-2.5 py-1 rounded">
            Chế độ Bản Thử
          </span>
        )}
      </div>

      {/* Toast Alert */}
      {message && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-xl border flex items-center gap-2 animate-bounce ${
          message.type === 'crit' 
            ? 'bg-red-950 text-red-100 border-red-800' 
            : 'bg-emerald-950 text-emerald-100 border-emerald-800'
        }`}>
          {message.type !== 'crit' && <Check className="w-4 h-4 text-emerald-400" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Bento-style workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Story list */}
        <div className="bg-vintage-paper rounded-xl border border-vintage-sepia p-5 flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-4 border-b border-vintage-sepia/70 mb-4">
            <h3 className="font-bold text-vintage-gold logo-font tracking-wide">
              Danh thư mục ({stories.length})
            </h3>
            <button
              onClick={handleResetStoryForm}
              className="p-1.5 rounded-md hover:bg-vintage-sepia/50 text-vintage-gold transition"
              title="Thêm truyện mới"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto space-y-3 flex-grow pr-1.5 scrollbar">
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleSelectStory(story)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-200 flex gap-3 ${
                  storyId === story.id
                    ? 'bg-vintage-sepia/50 border-vintage-gold text-white'
                    : 'bg-vintage-dark/40 border-vintage-sepia text-vintage-gray hover:bg-vintage-sepia/30 hover:border-vintage-gold/20'
                }`}
              >
                <img 
                  src={story.cover_url} 
                  alt={story.title} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-14 object-cover rounded bg-black border border-vintage-sepia"
                />
                <div className="flex flex-col justify-between truncate">
                  <div>
                    <h4 className="font-bold text-sm text-vintage-text truncate">{story.title}</h4>
                    <span className="text-xs block opacity-80 mt-0.5">Tác giả: {story.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono mt-1 opacity-75">
                    <span>{story.status}</span>
                    <span>•</span>
                    <span>{(story.views_count || 0).toLocaleString()} lượt đọc</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleResetStoryForm}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg text-sm bg-vintage-sepia border border-vintage-gold/20 text-vintage-gold font-bold hover:bg-vintage-gold hover:text-vintage-dark transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Tác Phẩm Mới
          </button>
        </div>

        {/* Right Columns: Editing Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sub-navigation editor tabs */}
          <div className="flex border-b border-vintage-sepia bg-vintage-paper rounded-t-xl overflow-hidden">
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition ${
                activeTab === 'stories'
                  ? 'bg-vintage-sepia/40 text-vintage-gold border-b-2 border-vintage-gold'
                  : 'text-vintage-gray hover:bg-vintage-sepia/25 hover:text-vintage-text'
              }`}
            >
              Cốt Truyện Chính {storyId ? '(Sửa)' : '(Thêm mới)'}
            </button>
            <button
              onClick={() => {
                if (!storyId) {
                  showMsg('Vui lòng chọn hoặc lưu một cốt truyện trước!', 'crit');
                  return;
                }
                setActiveTab('chapters');
              }}
              disabled={!storyId}
              className={`flex-1 py-4 text-center font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 ${
                !storyId ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                activeTab === 'chapters'
                  ? 'bg-vintage-sepia/40 text-vintage-gold border-b-2 border-vintage-gold'
                  : 'text-vintage-gray hover:bg-vintage-sepia/25 hover:text-vintage-text'
              }`}
            >
              Mục lục Chương {storyId ? `(${chapters.length} chương)` : ''}
            </button>
          </div>

          {/* Form Story Container */}
          {activeTab === 'stories' && (
            <form onSubmit={handleSaveStory} className="bg-vintage-paper rounded-b-xl border border-t-0 border-vintage-sepia p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Book Title */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Tiêu Đề Truyện *</label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Ví dụ: Tiếng Gọi Từ Đáy Giếng Cổ..."
                    className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold/50 font-semibold"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Tên Tác Giả / Dịch Giả *</label>
                  <input
                    type="text"
                    value={storyAuthor}
                    onChange={(e) => setStoryAuthor(e.target.value)}
                    placeholder="Ví dụ: Ninh Vũ..."
                    className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold/50 font-semibold"
                  />
                </div>

                {/* Novel Cover image */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Đường Dẫn Ảnh Bìa (URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={storyCoverUrl}
                      onChange={(e) => setStoryCoverUrl(e.target.value)}
                      placeholder="Nhập liên kết ảnh bìa từ các nguồn Unsplash, Pinterest..."
                      className="flex-grow bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:focus:border-vintage-gold/50 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setStoryCoverUrl(`https://images.unsplash.com/photo-${['1543002588-bfa74002ed7e', '1512820790803-83ca734da794', '1506880018603-83d5b814b5a6', '1476275466078-4007374efbbe'][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=600`)}
                      className="shrink-0 bg-vintage-sepia hover:bg-vintage-gold hover:text-vintage-dark transition-all text-vintage-gold p-2.5 rounded-lg border border-vintage-gold/20"
                      title="Sử dụng ảnh ngẫu nhiên từ Unsplash làm bìa"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Description Box */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Tóm Tắt Tác Phẩm (Bi kịch/Bí ẩn)</label>
                  <textarea
                    rows={4}
                    value={storyDescription}
                    onChange={(e) => setStoryDescription(e.target.value)}
                    placeholder="Soạn chi tiết nội dung giới thiệu cốt truyện..."
                    className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg p-4 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold/50 leading-relaxed font-serif text-sm"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Nhãn / Thể Loại (Cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    value={storyTagsString}
                    onChange={(e) => setStoryTagsString(e.target.value)}
                    placeholder="Kỳ bí, Trinh thám, Kinh dị..."
                    className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text placeholder-vintage-gray/50"
                  />
                </div>

                {/* Status Novel */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Trạng Thái Bản Thảo</label>
                  <select
                    value={storyStatus}
                    onChange={(e) => setStoryStatus(e.target.value)}
                    className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text select-style focus:outline-none focus:border-vintage-gold font-semibold"
                  >
                    <option value="Đang tiến hành">Đang tiến hành</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>

              </div>

              {/* Story Editor Buttons */}
              <div className="flex flex-wrap items-center justify-between pt-6 border-t border-vintage-sepia/75 gap-4">
                {storyId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteStory(storyId)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-400 bg-red-950/25 border border-red-900/30 px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa tác phẩm
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-vintage-gold text-vintage-dark font-bold rounded-lg cursor-pointer hover:bg-white hover:scale-[1.02] transition"
                >
                  <Save className="w-4 h-4" /> {storyId ? 'Lưu Thay Đổi' : 'Đăng Truyện Mới'}
                </button>
              </div>

            </form>
          )}

          {/* Form Chapters Panel container */}
          {activeTab === 'chapters' && (
            <div className="bg-vintage-paper rounded-b-xl border border-t-0 border-vintage-sepia p-6 space-y-8">
              
              {/* Existing chapters map strip */}
              <div className="border-b border-vintage-sepia pb-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-vintage-gray mb-3.5 font-mono">
                  Danh sách bản thảo các chương ({chapters.length})
                </h4>
                {chapters.length === 0 ? (
                  <p className="text-sm text-vintage-gray italic py-2">Chưa có chương nào được viết cho tác phẩm này. Hãy chấp bút chương đầu tiên nhé!</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {chapters.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectChapter(c)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono border transition ${
                          chapterId === c.id
                            ? 'bg-vintage-gold text-vintage-dark border-vintage-gold'
                            : 'bg-vintage-dark text-vintage-gray border-vintage-sepia hover:text-vintage-text hover:border-vintage-gold/55'
                        }`}
                      >
                        Ch. {c.chapter_number}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleResetChapterForm}
                      className="px-3 py-1.5 rounded-md text-[10px] uppercase font-bold bg-[#1e2029] border border-sky-400/30 text-sky-400 hover:bg-sky-400/10 transition"
                    >
                      + Chương mới
                    </button>
                  </div>
                )}
              </div>

              {/* Editing block Chapter */}
              <form onSubmit={handleSaveChapter} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-vintage-gold font-mono uppercase">
                    {chapterId ? 'Sửa chương truyện' : 'Viết chương mới'}
                  </h4>
                  {chapterId && (
                    <button
                      type="button"
                      onClick={handleResetChapterForm}
                      className="text-xs text-vintage-gray hover:text-white"
                    >
                      Hủy để tạo chương mới
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Tiêu Đề Chương *</label>
                    <input
                      type="text"
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                      placeholder="Ví dụ: Chương 1: Sương Mờ Ngõ Cũ..."
                      className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold/50 font-semibold"
                    />
                  </div>

                  {/* Chapter code index */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-vintage-gray mb-1.5 font-bold font-mono">Thứ Tự Chương (Số) *</label>
                    <input
                      type="number"
                      step="any"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(parseFloat(e.target.value) || 1)}
                      className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg px-4 py-2.5 text-vintage-text font-mono focus:outline-none focus:border-vintage-gold"
                    />
                  </div>

                  {/* Content markup space */}
                  <div className="sm:col-span-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs uppercase tracking-wider text-vintage-gray font-bold font-mono">Nội Dung Thảo Bản Chương *</label>
                      <button
                        type="button"
                        onClick={handleFormatChapterContent}
                        className="text-xs text-vintage-gold hover:text-white transition flex items-center gap-1 font-semibold"
                        title="Tự động dọn khoảng trắng thừa, căn chỉnh dòng cho thanh sạch"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Chuẩn hóa ngắt dòng
                      </button>
                    </div>
                    <textarea
                      rows={14}
                      value={chapterContent}
                      onChange={(e) => setChapterContent(e.target.value)}
                      placeholder="Nội dung chương viết tại đây... Cách nhau 1 dòng trống để tự sinh đoạn văn."
                      className="w-full bg-vintage-dark border border-vintage-sepia rounded-lg p-4 text-vintage-text placeholder-vintage-gray/50 focus:outline-none focus:border-vintage-gold/50 leading-loose style-textarea font-serif text-base"
                    />
                  </div>

                </div>

                {/* Chapter submit controls */}
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-vintage-sepia gap-4">
                  {chapterId ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(chapterId)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-400 bg-red-950/25 border border-red-900/30 px-4 py-2 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa chương
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-vintage-gold text-vintage-dark font-bold rounded-lg cursor-pointer hover:bg-white hover:scale-[1.02] transition"
                  >
                    <Save className="w-4 h-4" /> {chapterId ? 'Cập Nhật Chương' : 'Đăng Chương Thư'}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
