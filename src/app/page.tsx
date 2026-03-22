'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Upload, Download, Wand2 } from 'lucide-react';

// We import CupScene dynamically because it uses browser APIs (three.js) 
// that might fail during SSR
const CupScene = dynamic(() => import('@/components/canvas/CupScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><p>Loading 3D Scene...</p></div>,
});

type HistoryItem = {
  id: string;
  url: string;
  type: 'upload' | 'ai';
  screenshotUrl?: string; // Storing the combined 3D look
};

export default function Home() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingSaveType, setPendingSaveType] = useState<'upload' | 'ai' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cup_histories');
    if (saved) {
      try {
        setHistories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Sync to local storage when histories change
  useEffect(() => {
    localStorage.setItem('cup_histories', JSON.stringify(histories));
  }, [histories]);

  const captureScreenshot = (): string | null => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Get base64 representation of the canvas
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      setTextureUrl(rawUrl);
      setPendingSaveType('upload');
      setIsProcessing(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  // Called defensively when Cup texture is done painting
  const handleTextureLoaded = () => {
    if (pendingSaveType && textureUrl) {
      // Small delay extra-ensures the renderer has committed the frame
      setTimeout(() => {
        const screenshot = captureScreenshot();
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          url: textureUrl,
          screenshotUrl: screenshot || textureUrl,
          type: pendingSaveType,
        };
        // Prepend to show newest first
        setHistories((prev) => [newItem, ...prev]);
        setPendingSaveType(null);
        setIsProcessing(false);
      }, 200);
    }
  };

  const handleSaveExport = () => {
    const screenshot = captureScreenshot();
    if (screenshot) {
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = `cup-design-${Date.now()}.png`;
      link.click();
    }
  };

  const applyHistory = (item: HistoryItem) => {
    // When applying from history, we just view it, don't re-save.
    setPendingSaveType(null);
    setTextureUrl(item.url);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden relative">

      {/* Background Neon Blobs for Glass depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar / Left Control Panel - Glass Effect */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 flex flex-col z-10 shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)] relative">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] tracking-tight">
            Cup Customizer
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">Design your drink cup.</p>
        </div>

        {/* AI Generator Section */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-orange-400 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">
            <Wand2 className="w-4 h-4" /> AI Generator
          </h2>
          <textarea
            className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition-all placeholder:text-slate-600 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] text-slate-200"
            rows={3}
            placeholder="E.g. Vintage floral pattern with pastel colors..."
          />
          <Button className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] border-none rounded-lg h-11">
            Generate Design
          </Button>
        </div>

        {/* Gallery Section */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            Texture Gallery
          </h2>

          {histories.length === 0 ? (
            <div className="text-center text-sm text-slate-500 mt-8 border border-dashed border-slate-700 rounded-xl p-6 bg-white/5">
              No recent designs. Upload or generate one!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {histories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => applyHistory(item)}
                  title={`Apply ${item.type} texture`}
                  className="aspect-square bg-black/40 rounded-xl border border-white/5 hover:border-orange-400/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] cursor-pointer transition-all flex items-center justify-center overflow-hidden relative group shadow-inner"
                >
                  <img
                    src={item.screenshotUrl || item.url}
                    alt="Design screenshot"
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 ease-out opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end pb-3 text-orange-50 text-xs font-bold drop-shadow-md">
                    <span className="capitalize tracking-wider">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main 3D Canvas Area */}
      <main className="flex-1 relative bg-transparent overflow-hidden">

        {isProcessing && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
            <div className="animate-spin rounded-full h-14 w-14 border-[4px] border-orange-500 border-t-transparent shadow-[0_0_20px_rgba(249,115,22,0.6)]"></div>
          </div>
        )}

        <CupScene textureUrl={textureUrl} onTextureLoaded={handleTextureLoaded} />

        {/* Overlay Tools */}
        <div className="absolute top-6 right-6 flex gap-4 z-30">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <Button
            variant="outline"
            onClick={handleUploadClick}
            disabled={isProcessing}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 font-semibold h-11 px-6 transition-all"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload Image
          </Button>
          <Button
            onClick={handleSaveExport}
            disabled={isProcessing}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-950 font-bold h-11 px-6 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] border-none transition-all"
          >
            <Download className="w-4 h-4 mr-2" /> Save & Export
          </Button>
        </div>
      </main>
    </div>
  );
}
