'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  preview?: string;
}

const ImageUpload = ({ onImageSelect, preview }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      setConverting(true);
      let processedFile = file;

      // Handle HEIC files
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
        console.log('Converting HEIC file...');
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        }) as Blob;

        processedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        });
      }

      // Validate file type after processing
      if (processedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          onImageSelect(processedFile, preview);
          setConverting(false);
        };
        reader.readAsDataURL(processedFile);
      } else {
        console.error('Unsupported file type:', file.type);
        setConverting(false);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setConverting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {converting ? (
        <div className="w-full h-64 border-2 border-dashed border-blue-500 rounded-lg flex flex-col items-center justify-center space-y-4 text-emerald-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div className="text-center">
            <p className="text-lg font-medium">Converting HEIC...</p>
            <p className="text-sm">Please wait a moment</p>
          </div>
        </div>
      ) : preview ? (
        <div className="relative w-full aspect-square max-w-md mx-auto">
          <Image
            src={preview}
            alt="Food preview"
            fill
            className="object-cover rounded-lg"
          />
          <button
            onClick={openFileSelector}
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white font-medium"
          >
            Change Photo
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
          className={`
            w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            flex flex-col items-center justify-center space-y-4 text-slate-600
            ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'}
          `}
        >
          <div className="text-6xl">📸</div>
          <div className="text-center">
            <p className="text-lg font-medium">Take or upload a photo</p>
            <p className="text-sm">Drag and drop or tap to select</p>
            <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, HEIC, and more</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;