-- ==========================================
-- GÓC NHỎ CỦA NINH - SUPABASE DATABASE SCHEMA
-- ==========================================

-- Enable UUID extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORIES TABLE
CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    status VARCHAR(50) DEFAULT 'Đang tiến hành',
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CHAPTERS TABLE
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    chapter_number NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for speed optimization
CREATE INDEX idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX idx_chapters_number ON public.chapters(chapter_number);

-- 3. PROFILES TABLE (Holds roles and profiles mapped to Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'visitor' NOT NULL, -- 'admin' OR 'visitor'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. VISITOR STATISTICS TABLE
CREATE TABLE public.views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pathname TEXT,
    visitor_ip TEXT
);

-- ==========================================
-- ROW LEVEL SECURITY RULES (RLS)
-- ==========================================

-- Stories: Read access for everyone, Write for Admins only
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép đọc mọi câu chuyện công khai" 
ON public.stories FOR SELECT 
USING (true);

CREATE POLICY "Chỉ Admin có quyền chỉnh sửa truyện" 
ON public.stories FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Chapters: Read access for everyone, Write for Admins only
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép đọc mọi chương truyện" 
ON public.chapters FOR SELECT 
USING (true);

CREATE POLICY "Chỉ Admin mới được chép chương mới" 
ON public.chapters FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- ==========================================
-- FUNCTIONS & STORED PROCEDURES
-- ==========================================

-- Function to safely increment story view tallies
CREATE OR REPLACE FUNCTION public.increment_story_views(story_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.stories
    SET views_count = views_count + 1
    WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to automate profile creation during Supabase user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    CASE 
      -- Assign first signup or specific email domain as administrator
      WHEN new.email = 'goodgirldao@gmail.com' THEN 'admin'
      WHEN new.email LIKE '%@gocnhoninh.vn' THEN 'admin'
      ELSE 'visitor'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to hook signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
