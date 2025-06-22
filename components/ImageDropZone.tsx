import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "./ui/button";
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
        <div className="relative h-48">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain rounded-xl border border-gray-300 dark:border-gray-700"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <FaTimes className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="group flex flex-col items-center justify-center w-full h-48 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-accent transition"
        >
          <FaCloudUploadAlt className="w-10 h-10 mb-2 text-muted-foreground group-hover:text-foreground" />
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
