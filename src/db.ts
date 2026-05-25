import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Story, Chapter } from './types';

// Detect credentials in Vite environment
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseInstance: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance && isSupabaseConfigured) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('Lỗi khi khởi tạo Supabase Client:', e);
    }
  }
  return supabaseInstance;
}

// ==========================================
// MOCK & LOCALSTORAGE ALTERNATIVE ENGINE
// ==========================================
const DEFAULT_STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Tiếng Gọi Từ Đáy Giếng Cổ',
    author: 'Ninh Vũ',
    description: 'Một câu chuyện ly kỳ đậm chất liêu trai chí dị Việt Nam. Lấy bối cảnh tại một ngôi làng cổ nằm nép mình bên dãy núi Tây Bắc mờ sương, những sự kiện dị thường bắt đầu xảy ra ngay sau khi chiếc giếng cổ hơn trăm tuổi của dòng họ Nguyễn được khai mở lại. Ninh - một phóng viên trẻ đam mê khảo cổ học quyết định dấn thân để vén màn bức màn sương u linh đang bao trùm lấy vùng quê hẻo lánh này...',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    status: 'Đang tiến hành',
    featured: true,
    views_count: 1420,
    tags: ['Kỳ bí', 'Trinh thám', 'Kinh dị', 'Việt Nam'],
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story-2',
    title: 'Dạ Khúc Bên Bờ Sông Đỏ',
    author: 'Khánh An',
    description: 'Phong cách trinh thám suy luận kết hợp chất thơ Nhật Bản cổ điển. Tại vùng ven Hà Nội dòng Sông Hồng cuộn đỏ, những cái chết bí ẩn của các nhạc công vĩ cầm tài năng vào đúng đêm trăng rằm dấy lên nỗi khiếp sợ tột cùng trong giới học thuật âm nhạc. Manh mối duy nhất chỉ là một nhành hoa bỉ ngạn đặt lại trên tay những nạn nhân t xấu số cùng một bản nhạc phổ dang dở chưa hề được lưu lại...',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    status: 'Đang tiến hành',
    featured: true,
    views_count: 895,
    tags: ['Trinh thám', 'Kịch tính', 'Hàn lâm'],
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'story-3',
    title: 'Vườn Hoa Trong Sương Chiều Nhật Bản',
    author: 'Miyazaki Haru (Dịch: Ninh)',
    description: 'Tác phẩm phảng phất vẻ đẹp u hoài của Haruki Murakami kết hợp phong vị nhẹ nhàng của Light Novel lãng mạn. Kể về cuộc hành trình phiêu lãng của Ren - một cậu thanh niên mang trong mình khả năng nhìn thấy ký ức cuối cùng của những cổ vật cũ kĩ. Khi cậu dọn đến ngôi nhà thuê rẻ tiền ở một thị trấn nông thôn hẻo lánh dưới chân núi Phú Sĩ, cậu gặp gỡ một cô gái vô ảnh chỉ xuất hiện mỗi hoàng hôn...',
    cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    status: 'Hoàn thành',
    featured: false,
    views_count: 2410,
    tags: ['Light Novel', 'Lãng mạn', 'Lắng đọng', 'Kỳ ảo'],
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_CHAPTERS: Chapter[] = [
  // Story 1 Chapters
  {
    id: 'ch-1-1',
    story_id: 'story-1',
    title: 'Chương 1: Sương Mờ Ngõ Cũ',
    chapter_number: 1,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Ngôi làng lọt thỏm giữa lòng thung lũng, nơi mây mù và sương núi bám chặt lấy mái ngói rêu phong bất kể ngày đêm. Ninh kéo cao cổ chiếc măng-tô sặc mùi ẩm mốc, bước đi rón rén từng nhịp trên con ngõ dài lát đá rêu xanh trơn trượt.

Hơi thở của anh ngưng tụ thành từng luồng khói trắng mong manh giữa tiết trời đại ngàn cắt da cắt thịt. Đây là làng Cổ Khê - xứ sở mà bản đồ quy hoạch bỏ quên, nơi thời gian ngỡ như đã ngưng đọng lại tự hàng trăm năm trước. Điều duy nhất giữ chân kẻ lạ mặt như anh tìm về nơi thâm u này chính là những lá thư giấu tên bí ẩn, cảnh báo về một điềm báo hắc ám vừa trỗi dậy dưới đáy giếng cổ của dòng họ Nguyễn.

"Người trẻ tuổi, đừng đi sâu vào ngõ tối buổi hoàng hôn." Giọng nói khàn đục đột ngột vang lên từ hàng hiên khuất dưới bóng cây đại cổ thụ.

Ninh giật mình ngoảnh lại. Một cụ già tóc bạc phơ, đôi mắt đầm đục không chút thần khí đang chăm chú nhìn anh. Đôi tay run rẩy gầy guộc như cành củi khô bám chặt vào bậu cửa gỗ mục nát.

"Cháu chào cụ, cháu đang tìm nhà cụ Trưởng tộc họ Nguyễn. Cụ có thể chỉ lối giúp cháu được không ạ?" Ninh lễ phép tiến tới gần.

Cụ già không trả lời ngay, cụ ngước đôi mắt hướng ra xa, nơi đỉnh núi đang bị nuốt chửng bởi ráng chiều đỏ quạch như máu. Tiếng gió tru lên từng hồi qua từng thớ kẽ nứt của vách đá. Cụ thì thào run rẩy:

"Nó đã thức giấc rồi... Tiếng nước róc rách vọng ra lúc nửa đêm, đừng nghe, cũng đừng dòm xuống đáy sâu..."

Nói đoạn, cụ đẩy sầm cánh cửa gỗ cũ kỹ, khóa chặt then cài bên trong, để mặc Ninh bơ vơ giữa bóng tối đang nhanh chóng bao trùm lấy vạn vật.`
  },
  {
    id: 'ch-1-2',
    story_id: 'story-1',
    title: 'Chương 2: Tiếng Nước Róc Rách Lúc Nửa Đêm',
    chapter_number: 2,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Gian phòng khách nhà Trưởng tộc Nguyễn u tịch lạ thường. Ánh đèn dầu lù mù tỏa ra thứ ánh sáng vàng vọt, hắt những cái bóng vặn vẹo khổng lồ lên vách tường gỗ sơn son đã mòn màu.

Ninh ngồi xếp hai chân trên chiếc chiếu cói bạc màu, đối diện là Trưởng tộc Nguyễn Minh - một người đàn ông ngoài ngũ tuần có gương mặt nghiêm nghị, trán hằn sâu những vết chân chim chứa đựng nhiều tâm sự khó giãi bày. Căn nhà này nằm biệt lập ở cuối làng, áp sát chân núi đứng sừng sững gác đêm.

"Cậu Ninh, phóng viên trẻ ở thủ đô xa xôi sao lại chú ý đến ngôi làng cũ kỹ này?" Chiêu một hớp trà đặc đắng ngắt, ông Minh chậm rãi cất lời phá vỡ sự im lặng ngột ngạt.

Ninh không vòng vo, anh mở ba-lô lấy ra bức thư viết bằng mực tàu đỏ úa vàng rồi đẩy nhẹ sang phía đối diện:

"Bởi vì cháu nhận được thư này. Trong đó mô tả tường tận sự kiện chiếc giếng đá cổ dòng họ Nguyễn bỗng dưng rỉ nước đỏ nhạt và phát ra những tiếng kêu oán thán sau mùa trăng trước."

Bàn tay cầm chén trà của ông Minh khẽ run lên. Một vài giọt nước trà sóng sánh đổ ra mặt bàn gỗ mục. Sắc mặt ông biến đổi liên tục, từ kinh ngạc sang trầm mặc hắc ám, rồi thở dài thườn thượt.

"Đồn nhảm... chỉ là lời đồn nhảm nhí của đám trẻ ranh rảnh rỗi mà thôi..." Ông Minh buông lời gạt đi, song ánh mắt sâu hoắm lại lộ rõ sự lảng tránh tột bực.

Đêm đó, Ninh được sắp xếp nghỉ lại tại gian buồng phía sau, ngay cạnh bờ tường đá bao quanh sân vườn. Gió núi rít gào qua kẽ ngói, chiếc giường tre mộc mạc cứ cót két theo từng nhịp chuyển mình của anh. Ninh trằn trọc nhìn lên trần nhà tối tăm, lòng đầy mối hoài nghi dồn nén.

*Điong... Điong... róc rách...*

Khoảng hai giờ sáng, một chuỗi âm thanh thanh mảnh, dịu nhẹ vọng vào màng nhĩ. Toàn thân Ninh lập tức căng cứng. Tiếng nước nhỏ giọt đều đặn và róc rách len lỏi giữa khoảng không tịch mịch. Âm thanh vọng sang từ góc sân sau - nơi chiếc giếng cổ bọc bằng lưới thép rỉ sét ngự trị.

Ninh khều tay mò mẫm lấy chiếc đèn pin nhỏ, khẽ khàng trèo xuống giường, từng bước chân bước đi trên nền đất nện ẩm ướt để không phát ra tiếng động. Trái tim lồng ngực đập liên hồi u u u u...`
  },
  {
    id: 'ch-1-3',
    story_id: 'story-1',
    title: 'Chương 3: Bóng Trắng Hiện Hình',
    chapter_number: 3,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Khí lạnh buốt xương lập tức xộc thẳng vào cuống họng của Ninh ngay khi anh đặt chân ra khoảng sân vườn phủ đầy rêu phong. Không gian ban đêm khoác lên mình lớp áo bóng tối huyền ảo, những bức tường đá xám xịt tựa hồ như những ngôi mộ cổ khổng lồ đang thức giấc canh gác ngôi nhà.

Ninh tắt đèn pin, nương theo ánh trăng non yếu ớt treo lơ lửng giữa tầng mây mờ mịt. Chiếc giếng đá cổ sừng sững nằm góc trong cùng, tấp nập sương mù quẩn quanh chân bệ đá cổ. Tiếp tục tiến lại gần, tiếng động róc rách quái lạ khi nãy chợt biến mất tăm, trả lại một sự im thin thít rợn người.

Bất thình lình, một vệt sáng trắng lập lờ bay bổng lướt ngang qua bậu giếng. 

Ninh dụi mắt nhìn kỹ. Đó không phải ảo giác. Vệt sáng ngưng tụ thành một hình bóng thiếu nữ mảnh mai, mái tóc xõa dài buông xuống vách đá, khoác chiếc áo dài trắng phấp phới tựa như mây trời. Bóng dáng ấy đứng yên lơ lửng ngay mép mọc giếng, cúi đầu xuống đáy sâu thẳm u mờ.

Ninh run rẩy đưa tay bật chiếc đèn pin bật lên, luồng ánh sáng vàng rọi thẳng về phía miệng giếng.

*Roạt!*

Hình bóng ấy bỗng biến mất dạng vào hư không trong tích tắc. Trên bậu đá trơn láng ướt đẫm nước giếng, chỉ còn lại một đóa hoa dại màu trắng tuyết còn đọng nước sương dập dờn tỏa hương thơm thanh tịnh quái dị. Ninh lò dò bước tới giáp miệng giếng dòm xuống đáy sâu hun hút tăm tối, chỉ thấy bóng trăng vỡ vụn loang loáng trên mặt nước đen ngòm mờ ảo như một khuôn mặt đang mỉm cười dị dạng...`
  },

  // Story 2 Chapters
  {
    id: 'ch-2-1',
    story_id: 'story-2',
    title: 'Chương 1: Tiếng Đàn Trong Đêm Trăng Máu',
    chapter_number: 1,
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Ánh trăng rằm đỏ nhạt tựa hồ sắc rượu vang thượng hạng, hắt những tia sáng kỳ ảo lên vòm cầu Long Biên cổ kính sừng sững bắc qua sông. Dưới gầm cầu, nước sông Hồng cuộn đỏ sầm sập chảy siết o o o o o gầm vang như tiếng thở dốc gào thét của con quái thú khổng lồ ẩn hình.

Đúng nửa đêm, tiếng vĩ cầm trầm bổng, nức nở bỗng u oán vút lên giữa nền trời cô tịch, ngợp tràn hương sương lạnh giá. 

Giai điệu réo rắt u sầu dội thẳng vào màn sương, rồi im bặt sau một tiếng đứt dây đàn "phựt" vang xa nhức buốt. Ngày hôm sau, người dân chài Cổ Loa phát hiện xác của Lâm - danh cầm trẻ tuổi nổi danh thủ đô, trôi dạt vào bãi bồi cát trắng rậm rạp bên sông. 

Thám tử tư Khánh An nhấp chén cà phê không đường đắng nghắt, đôi mắt đờ đẫn mệt mỏi nhìn xuống những bản ảnh hiện trường vụ án sặc mùi tăm tối...`
  },

  // Story 3 Chapters
  {
    id: 'ch-3-1',
    story_id: 'story-3',
    title: 'Chương 1: Cổ Vật Và Thiếu Nữ Vô Hình',
    chapter_number: 1,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Mỗi vật cũ kỹ đều sở hữu một linh hồn riêng. Bản thân chúng đã đón nhận biết bao vui buồn hờn giận của những chủ nhân xưa cũ qua hàng chục năm ròng rã, để rồi tích tụ thành những dải băng ký ức mỏng manh mà tinh khiết.

Ren nhìn ngắm chiếc đồng hồ quả quýt bằng đồng rỉ đồng đen mờ mờ trên kệ tủ cũ kỹ nhà trọ mới thuê. Khi các ngón tay gầy guộc chạm nhẹ vào mặt kính nứt nẻ, một luồng ánh sáng ấm áp đột ngột lan tỏa trong trí óc cậu: một chiều tuyết rơi lạnh giá tại Kyoto năm 1974, một cô gái trẻ khóc thút thít tiễn biệt người yêu rời ga tàu lửa...

"Cậu nhìn thấy được đúng không?" 

Một tiếng nói trong trẻo tựa chuông gió khẽ khàng cất lên đằng sau lưng. Ren sửng sốt quay lại. Một bóng hình cô gái mặc kimono hoa anh đào nhạt đang ngồi vắt vẻo bên cửa sổ ngập sương chiều Nhật Bản, cơ thể cô trong suốt lấp lánh như sương khói mờ sương...`
  }
];

// Initialize LocalStorage DB
function initLocalDB() {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('goc_nho_stories')) {
      localStorage.setItem('goc_nho_stories', JSON.stringify(DEFAULT_STORIES));
    }
    if (!localStorage.getItem('goc_nho_chapters')) {
      localStorage.setItem('goc_nho_chapters', JSON.stringify(DEFAULT_CHAPTERS));
    }
    if (!localStorage.getItem('goc_nho_visitors')) {
      localStorage.setItem('goc_nho_visitors', '14068'); // starting baseline
    }
  }
}

initLocalDB();

// ==========================================
// DB SERVICE METHODS (HYBRID REAL/MOCK)
// ==========================================
export const db = {
  // Visitor counting
  async getVisitorStats(): Promise<{ total_visitors: number; active_readers: number }> {
    try {
      const response = await fetch('/api/stats/visitors');
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Không thể gọi API visitor, dùng mock local:', e);
    }

    // Baseline fallback
    const localCount = parseInt(localStorage.getItem('goc_nho_visitors') || '14068', 10);
    // Add stable fake online readers based on minutes/hours
    const activeFake = Math.floor(12 + Math.sin(Date.now() / 60000) * 5 + Math.random() * 2);
    return {
      total_visitors: localCount,
      active_readers: Math.max(2, activeFake)
    };
  },

  async incrementVisitor(): Promise<number> {
    try {
      const response = await fetch('/api/stats/increment', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        return data.total_visitors;
      }
    } catch (e) {
      console.warn('Lỗi gọi API tăng count:', e);
    }

    const current = parseInt(localStorage.getItem('goc_nho_visitors') || '14068', 10);
    const updated = current + 1;
    localStorage.setItem('goc_nho_visitors', updated.toString());
    return updated;
  },

  // Query Stories
  async getStories(searchQuery = ''): Promise<Story[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('stories').select('*').order('updated_at', { ascending: false });
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        const { data, error } = await query;
        if (!error && data) return data as Story[];
        console.error('Lỗi Supabase stories:', error);
      } catch (e) {
        console.error('Lỗi Supabase stories catch:', e);
      }
    }

    // Fallback to LocalStorage
    const localStr = localStorage.getItem('goc_nho_stories');
    const list: Story[] = localStr ? JSON.parse(localStr) : DEFAULT_STORIES;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return list.filter(s => s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q) || s.tags?.some(t => t.toLowerCase().includes(q)));
    }
    // Sort recently updated
    return [...list].sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  async getStoryById(id: string): Promise<Story | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
        if (!error && data) {
          // Increment views asynchronously
          supabase.rpc('increment_story_views', { story_id: id }).then();
          return data as Story;
        }
      } catch (e) {
        console.error('Lỗi kết nối Supabase:', e);
      }
    }

    const localStr = localStorage.getItem('goc_nho_stories');
    const list: Story[] = localStr ? JSON.parse(localStr) : DEFAULT_STORIES;
    const story = list.find(s => s.id === id) || null;
    if (story) {
      story.views_count = (story.views_count || 0) + 1;
      localStorage.setItem('goc_nho_stories', JSON.stringify(list));
    }
    return story;
  },

  // Write Story (Admin)
  async saveStory(storyData: Omit<Story, 'created_at' | 'updated_at'>): Promise<Story> {
    const supabase = getSupabase();
    const isNew = !storyData.id || storyData.id.startsWith('temp_');
    const finalId = isNew ? (supabase ? undefined : 'story-' + Date.now()) : storyData.id;

    const payload: Partial<Story> = {
      title: storyData.title,
      author: storyData.author,
      description: storyData.description,
      cover_url: storyData.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
      status: storyData.status || 'Đang tiến hành',
      featured: storyData.featured,
      tags: storyData.tags || [],
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        if (isNew) {
          const { data, error } = await supabase.from('stories').insert([{ ...payload, views_count: 0 }]).select().single();
          if (error) throw error;
          return data as Story;
        } else {
          const { data, error } = await supabase.from('stories').update(payload).eq('id', storyData.id).select().single();
          if (error) throw error;
          return data as Story;
        }
      } catch (e) {
        console.error('Lỗi lưu Supabase:', e);
        // continue to local storage as fallback
      }
    }

    // Local Storage operation
    const localStr = localStorage.getItem('goc_nho_stories');
    const list: Story[] = localStr ? JSON.parse(localStr) : DEFAULT_STORIES;

    let savedStory: Story;
    if (isNew) {
      savedStory = {
        ...payload,
        id: finalId!,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Story;
      list.push(savedStory);
    } else {
      const idx = list.findIndex(s => s.id === storyData.id);
      if (idx !== -1) {
        savedStory = {
          ...list[idx],
          ...payload,
          updated_at: new Date().toISOString()
        } as Story;
        list[idx] = savedStory;
      } else {
        throw new Error('Không tìm thấy truyện để sửa');
      }
    }

    localStorage.setItem('goc_nho_stories', JSON.stringify(list));
    return savedStory;
  },

  async deleteStory(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Suppress reference constraint in mock mode
        await supabase.from('chapters').delete().eq('story_id', id);
        const { error } = await supabase.from('stories').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Erro delete supabase:', e);
      }
    }

    const localStr = localStorage.getItem('goc_nho_stories');
    let list: Story[] = localStr ? JSON.parse(localStr) : DEFAULT_STORIES;
    list = list.filter(s => s.id !== id);
    localStorage.setItem('goc_nho_stories', JSON.stringify(list));

    // delete internal chapters
    const chaptersStr = localStorage.getItem('goc_nho_chapters');
    if (chaptersStr) {
      let chList: Chapter[] = JSON.parse(chaptersStr);
      chList = chList.filter(c => c.story_id !== id);
      localStorage.setItem('goc_nho_chapters', JSON.stringify(chList));
    }
    return true;
  },

  // Query Chapters
  async getChaptersForStory(storyId: string): Promise<Chapter[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('chapters').select('*').eq('story_id', storyId).order('chapter_number', { ascending: true });
        if (!error && data) return data as Chapter[];
      } catch (e) {
        console.error('Error fetching chapters Supabase:', e);
      }
    }

    const chaptersStr = localStorage.getItem('goc_nho_chapters');
    const list: Chapter[] = chaptersStr ? JSON.parse(chaptersStr) : DEFAULT_CHAPTERS;
    return list
      .filter(c => c.story_id === storyId)
      .sort((a,b) => a.chapter_number - b.chapter_number);
  },

  async getChapterById(id: string): Promise<Chapter | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('chapters').select('*').eq('id', id).single();
        if (!error && data) return data as Chapter;
      } catch (e) {
        console.error('Error fetching chapter Supabase:', e);
      }
    }

    const chaptersStr = localStorage.getItem('goc_nho_chapters');
    const list: Chapter[] = chaptersStr ? JSON.parse(chaptersStr) : DEFAULT_CHAPTERS;
    return list.find(c => c.id === id) || null;
  },

  // Write Chapter (Admin)
  async saveChapter(chapterData: Omit<Chapter, 'id' | 'created_at'> & { id?: string }): Promise<Chapter> {
    const supabase = getSupabase();
    const isNew = !chapterData.id || chapterData.id.startsWith('temp_');
    const finalId = isNew ? (supabase ? undefined : 'chapter-' + Date.now()) : chapterData.id;

    const payload = {
      story_id: chapterData.story_id,
      title: chapterData.title,
      content: chapterData.content,
      chapter_number: Number(chapterData.chapter_number)
    };

    if (supabase) {
      try {
        if (isNew) {
          const { data, error } = await supabase.from('chapters').insert([payload]).select().single();
          if (error) throw error;
          // Refresh story updated_at
          await supabase.from('stories').update({ updated_at: new Date().toISOString() }).eq('id', chapterData.story_id);
          return data as Chapter;
        } else {
          const { data, error } = await supabase.from('chapters').update(payload).eq('id', chapterData.id).select().single();
          if (error) throw error;
          await supabase.from('stories').update({ updated_at: new Date().toISOString() }).eq('id', chapterData.story_id);
          return data as Chapter;
        }
      } catch (e) {
        console.error('Error writing chapter Supabase:', e);
      }
    }

    // Local Storage operation
    const chaptersStr = localStorage.getItem('goc_nho_chapters');
    const list: Chapter[] = chaptersStr ? JSON.parse(chaptersStr) : DEFAULT_CHAPTERS;

    let savedChapter: Chapter;
    if (isNew) {
      savedChapter = {
        ...payload,
        id: finalId!,
        created_at: new Date().toISOString()
      } as Chapter;
      list.push(savedChapter);
    } else {
      const idx = list.findIndex(c => c.id === chapterData.id);
      if (idx !== -1) {
        savedChapter = {
          ...list[idx],
          ...payload
        } as Chapter;
        list[idx] = savedChapter;
      } else {
        throw new Error('Không tìm thấy chương để sửa');
      }
    }

    localStorage.setItem('goc_nho_chapters', JSON.stringify(list));

    // Update parent story updated_at
    const storiesStr = localStorage.getItem('goc_nho_stories');
    if (storiesStr) {
      const sList: Story[] = JSON.parse(storiesStr);
      const sIdx = sList.findIndex(s => s.id === chapterData.story_id);
      if (sIdx !== -1) {
        sList[sIdx].updated_at = new Date().toISOString();
        localStorage.setItem('goc_nho_stories', JSON.stringify(sList));
      }
    }

    return savedChapter;
  },

  async deleteChapter(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('chapters').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Error deleting chapter Supabase:', e);
      }
    }

    const chaptersStr = localStorage.getItem('goc_nho_chapters');
    let list: Chapter[] = chaptersStr ? JSON.parse(chaptersStr) : DEFAULT_CHAPTERS;
    list = list.filter(c => c.id !== id);
    localStorage.setItem('goc_nho_chapters', JSON.stringify(list));
    return true;
  }
};
