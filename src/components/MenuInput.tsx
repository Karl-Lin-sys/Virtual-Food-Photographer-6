import { useState, FormEvent } from 'react';
import { Send, FileText } from 'lucide-react';

interface MenuInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

export default function MenuInput({ onGenerate, isLoading }: MenuInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-studio-400" />
        <h3 className="text-sm font-medium uppercase tracking-widest text-studio-400">Insert Menu Text</h3>
      </div>
      <form onSubmit={handleSubmit} id="menu-form" className="relative group">
        <textarea
          id="menu-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Classic Margherita Pizza with San Marzano tomatoes, fresh mozzarella, and aromatic basil..."
          className="w-full h-48 p-6 bg-studio-900 border border-studio-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-studio-accent transition-all placeholder:text-studio-800 text-studio-accent"
          disabled={isLoading}
        />
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            id="generate-trigger"
            disabled={isLoading || !text.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              isLoading || !text.trim()
                ? 'bg-studio-800 text-studio-400 cursor-not-allowed'
                : 'bg-white text-black hover:scale-105 active:scale-95 shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Capture Studio Shots
              </>
            )}
          </button>
        </div>
      </form>
      <p className="text-xs text-studio-400 italic">
        * Provide your menu items and their key ingredients for the most accurate generation.
      </p>
    </div>
  );
}
