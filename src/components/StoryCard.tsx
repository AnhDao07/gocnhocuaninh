import React from 'react';
import { Story } from '../types';
import { BookOpen, User, Eye, Bookmark } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-vintage-paper rounded-xl overflow-hidden shadow-md border border-vintage-sepia hover:border-vintage-gold/50 cursor-pointer transition-all duration-300 flex flex-col md:flex-row h-full"
    >
      {/* Cover Image Container */}
      <div className="relative w-full md:w-44 h-56 md:h-full shrink-0 overflow-hidden bg-vintage-dark">
        <img 
          src={story.cover_url} 
          alt={story.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Featured Tag overlays */}
        {story.featured && (
          <div className="absolute top-3 left-3 bg-vintage-gold text-vintage-dark font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
            Nổi bật
          </div>
        )}
        {/* Status indicator */}
        <div className={`absolute bottom-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded shadow ${
          story.status === 'Hoàn thành' 
            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
            : 'bg-vintage-sepia text-vintage-gold border border-vintage-gold/30'
        }`}>
          {story.status}
        </div>
      </div>

      {/* Book description panel */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Header */}
          <div className="flex items-center gap-1.5 text-xs text-vintage-gray mb-1">
            <User className="w-3.5 h-3.5 text-vintage-gold" />
            <span className="font-medium hover:text-vintage-gold transition-colors">{story.author}</span>
          </div>

          <h3 className="text-xl font-bold text-vintage-text group-hover:text-vintage-gold transition-colors duration-300 tracking-tight leading-snug line-clamp-2">
            {story.title}
          </h3>

          <p className="text-sm text-vintage-gray mt-2.5 line-clamp-3 leading-relaxed">
            {story.description}
          </p>
        </div>

        {/* Footer info & tags */}
        <div className="mt-4 pt-4 border-t border-vintage-sepia/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {story.tags?.map((tag) => (
              <span 
                key={tag} 
                className="text-[11px] bg-vintage-sepia/50 text-vintage-gray px-2 py-0.5 rounded border border-vintage-sepia/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-vintage-gray font-mono">
            <Eye className="w-3.5 h-3.5 text-vintage-gold" />
            <span>{(story.views_count || 0).toLocaleString()} lượt xem</span>
          </div>
        </div>
      </div>
    </div>
  );
};
