import { Upload, X } from "lucide-react";
import { Input } from "./ui/input";

export function ImageDropZone({
  preview,
  onChange,
  onClear,
}: {
  preview: string | null;
  onChange: (file: File) => void;
  onClear: () => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative min-h-48">
          <img
            src={preview}
            alt="Preview"
            className="object-cover rounded-xl border border-gray-300 dark:border-gray-700"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 h-5 w-5 rounded border-2 border-black/40 dark:border-white/40 bg-black/40 dark:bg-white/10 hover:bg-black/60 dark:hover:bg-white/20 group transition-all transform scale-100 hover:scale-110 flex items-center justify-center opacity-75 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5 text-white stroke-[3]" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="group flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-accent transition"
        >
          <Upload className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</p>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
