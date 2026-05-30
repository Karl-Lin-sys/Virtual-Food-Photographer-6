import { useState, useEffect } from 'react';
import { Camera, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MenuInput from './components/MenuInput';
import StyleToggles from './components/StyleToggles';
import PhotoGallery from './components/PhotoGallery';
import { PhotoStyle, GeneratedPhoto } from './types';

export default function App() {
  const [style, setStyle] = useState<PhotoStyle>('rustic');
  const [photos, setPhotos] = useState<GeneratedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (menuText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuText, style })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Studio session failed.');
      }

      const data = await response.json();
      setPhotos(data.photos);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPhotos([]);
    setError(null);
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-white/3 blur-[100px] rounded-full" />
      </div>

      <header className="px-6 py-12 md:px-12 md:py-20 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-studio-900 border border-studio-800 rounded-full w-fit"
            >
              <Sparkles className="h-3 w-3 text-studio-400" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-studio-400">AI Food Studio v1.0</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.9]">
              Virtual Food <br /><span className="text-studio-400">Photographer</span>
            </h1>
            <p className="max-w-md text-studio-400 text-lg leading-relaxed mt-2">
              The ultimate high-fidelity digital darkroom for modern restaurant owners. Choose an aesthetic, upload your menu, and develop professional imagery instantly.
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-2">
             <div className="h-16 w-[1px] bg-studio-800" />
             <div className="flex items-center gap-3 text-studio-400">
                <Camera className="h-5 w-5" />
                <span className="text-sm font-medium">Digital Studio Active</span>
             </div>
          </div>
        </div>
      </header>

      <main className="px-6 pb-24 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Controls Section */}
          <section id="studio-controls" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MenuInput onGenerate={handleGenerate} isLoading={isLoading} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-12"
            >
              <StyleToggles currentStyle={style} onStyleChange={setStyle} />
            </motion.div>
          </section>

          {/* Results Section */}
          <section id="studio-gallery" className="space-y-12">
            <div className="flex items-center justify-between border-b border-studio-800 pb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-medium">Studio Gallery</h2>
                <span className="px-2 py-0.5 bg-studio-900 border border-studio-800 rounded text-[10px] text-studio-400 font-mono">
                  {photos.length} Captured
                </span>
              </div>
              
              {photos.length > 0 && !isLoading && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-studio-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Session
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 bg-red-950/20 border border-red-900/50 rounded-2xl flex items-center gap-4 text-red-200"
                >
                  <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold">Development Error</span>
                    <span className="text-sm opacity-80">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PhotoGallery photos={photos} isLoading={isLoading} />
          </section>
        </div>
      </main>

      <footer className="px-6 py-12 border-t border-studio-900 text-center">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-studio-800">
          Powered by Gemini 3.1 Flash Image Engine &bull; AI Studio Production
        </p>
      </footer>
    </div>
  );
}
