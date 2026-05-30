import { PhotoStyle } from '../types';
import { Camera, Layers, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StyleTogglesProps {
  currentStyle: PhotoStyle;
  onStyleChange: (style: PhotoStyle) => void;
}

const styles: { id: PhotoStyle; label: string; icon: any; description: string }[] = [
  { 
    id: 'rustic', 
    label: 'Rustic/Dark', 
    icon: Layers, 
    description: 'Moody, textured with wood and side lighting.' 
  },
  { 
    id: 'modern', 
    label: 'Bright/Modern', 
    icon: Camera, 
    description: 'Clean, minimalist shots with bright studio light.' 
  },
  { 
    id: 'top-down', 
    label: 'Social Media', 
    icon: Share2, 
    description: 'Flat-lay aesthetics perfect for Instagram posts.' 
  },
];

export default function StyleToggles({ currentStyle, onStyleChange }: StyleTogglesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium uppercase tracking-widest text-studio-400">Select Aesthetic</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            id={`style-btn-${style.id}`}
            onClick={() => onStyleChange(style.id)}
            className={`flex flex-col gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
              currentStyle === style.id
                ? 'bg-studio-800 border-studio-accent ring-1 ring-studio-accent shadow-lg'
                : 'bg-studio-900 border-studio-800 hover:border-studio-400 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <style.icon className={`h-5 w-5 ${currentStyle === style.id ? 'text-white' : 'text-studio-400'}`} />
              {currentStyle === style.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="h-2 w-2 rounded-full bg-white"
                />
              )}
            </div>
            <div>
              <div className="font-semibold text-sm">{style.label}</div>
              <div className="text-xs text-studio-400 mt-1">{style.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
