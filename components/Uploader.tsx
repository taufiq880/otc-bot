import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface UploaderProps {
  onImageSelected: (base64: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onImageSelected, onClear, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!preview ? (
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-400 bg-slate-800/50 hover:bg-slate-800'}
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <div className="p-4 bg-slate-700 rounded-full mb-4">
            <UploadCloud className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-300 font-medium text-lg">Click or Drag Chart Screenshot</p>
          <p className="text-slate-500 text-sm mt-2">Supports JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-600 bg-slate-900 group">
          <img 
            src={preview} 
            alt="Chart Analysis" 
            className="w-full h-auto max-h-[500px] object-contain mx-auto"
          />
          {!isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                    onClick={clearImage}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold flex items-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all"
                >
                    <X className="w-5 h-5 mr-2" />
                    Upload New Chart
                </button>
            </div>
          )}
          {isLoading && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-600 flex items-center shadow-xl">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-3"></div>
                    <span className="text-slate-200 text-sm font-medium">Processing Image...</span>
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Uploader;