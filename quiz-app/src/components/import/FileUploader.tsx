'use client';

import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploaderProps {
  onFileLoaded: (file: File) => void;
  accept: string;
}

export function FileUploader({ onFileLoaded, accept }: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileLoaded(file);
    },
    [onFileLoaded]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileLoaded(file);
    },
    [onFileLoaded]
  );

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-2">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Hỗ trợ: .xlsx, .csv, .json
        </p>
        <label className="cursor-pointer">
          <span className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Chọn file
          </span>
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </CardContent>
    </Card>
  );
}
