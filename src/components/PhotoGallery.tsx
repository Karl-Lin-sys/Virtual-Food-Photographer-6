import { GeneratedPhoto } from '../types';
import PhotoCard from './PhotoCard';
import { CameraOff } from 'lucide-react';

interface PhotoGalleryProps {
  photos: GeneratedPhoto[];
  isLoading: boolean;
}

export default function PhotoGallery({ photos, isLoading }: PhotoGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-studio-900 rounded-3xl animate-pulse flex items-center justify-center border border-studio-800">
             <div className="flex flex-col items-center gap-2 opacity-20">
                <div className="h-8 w-8 border-2 border-studio-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-mono tracking-tighter uppercase">Developing Plate...</span>
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-studio-800 rounded-3xl">
        <CameraOff className="h-12 w-12 text-studio-800 mb-4" />
        <h3 className="text-xl font-medium text-studio-400">No photos developed yet</h3>
        <p className="text-sm text-studio-800 mt-2">Upload your menu above to begin the studio session.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} photo={photo} index={index} />
      ))}
    </div>
  );
}
