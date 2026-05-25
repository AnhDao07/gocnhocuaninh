export interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  status: 'Đang tiến hành' | 'Hoàn thành' | string;
  created_at: string;
  updated_at: string;
  featured?: boolean;
  views_count?: number;
  tags?: string[];
}

export interface Chapter {
  id: string;
  story_id: string;
  title: string;
  content: string;
  chapter_number: number;
  created_at: string;
}

export interface VisitorStats {
  total_visitors: number;
  active_readers: number;
}
