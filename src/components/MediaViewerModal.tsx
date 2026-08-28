import React from 'react';
import { MediaRecord } from '../types';
import { X, Calendar, Tag, Heart } from 'lucide-react';

interface MediaViewerModalProps {
  media: MediaRecord | null;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Media Canvas / Preview */}
        <div className={`h-64 sm:h-72 bg-gradient-to-tr ${media.colorBg} flex items-center justify-center relative overflow-hidden`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {media.url ? (
            <img 
              src={media.url} 
              alt={media.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-7xl animate-bounce duration-1000">
              {media.emoji}
            </div>
          )}

          {media.type === 'video' && (
            <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
              <span>▶ Vídeo Gravado</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-[#1E5FA6] rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {media.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {media.date}
            </span>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-[#154578]">
              {media.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {media.description}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span className="flex items-center gap-1 text-pink-500 font-semibold">
              <Heart className="w-3.5 h-3.5 fill-pink-500" /> Memória da Família do Ian
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
