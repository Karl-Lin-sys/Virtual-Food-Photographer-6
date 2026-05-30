import { GeneratedPhoto } from '../types';
import { Download, LayoutPanelTop } from 'lucide-react';
import { motion } from 'motion/react';

interface PhotoCardProps {
  photo: GeneratedPhoto;
  index: number;
}

export default function PhotoCard({ photo, index }: PhotoCardProps) {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.menuItemName.replace(/\s+/g, '-').toLowerCase()}-${photo.style}.png`;
    link.click();
  };

  return (
    <motion.div
      id={`photo-card-${photo.id}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative bg-studio-900 rounded-3xl overflow-hidden border border-studio-800 hover:border-studio-400 transition-colors"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={photo.url}
          alt={photo.menuItemName}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={downloadImage}
            className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-transform"
            title="Download Photo"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-studio-400">
            {photo.style} Series
          </span>
          <LayoutPanelTop className="h-3 w-3 text-studio-800" />
        </div>
        <h4 className="text-lg font-medium tracking-tight text-white">{photo.menuItemName}</h4>
      </div>
    </motion.div>
  );
}
