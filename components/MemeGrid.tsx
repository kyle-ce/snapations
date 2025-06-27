"use client";

import { useState } from "react";
import { MemeCard } from "./MemeCard";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Trash2, Edit2, X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { LoaderCircle } from "lucide-react";

interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
}

interface MemeGridProps {
  memes: Meme[];
  pageSize?: number;
}

export function MemeGrid({ memes, pageSize = 12 }: MemeGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [selectedMemes, setSelectedMemes] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const totalPages = Math.ceil(memes.length / pageSize);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentMemes = memes.slice(startIndex, endIndex);

  const handleSelectMeme = (id: string) => {
    setSelectedMemes(prev =>
      prev.includes(id) ? prev.filter(memeId => memeId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentMemes = memes.slice(startIndex, endIndex);
    setSelectedMemes(prev =>
      prev.length === currentMemes.length ? [] : currentMemes.map(meme => meme.id)
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedMemes.length) return;

    setIsDeleting(true);
    try {
      const results = await Promise.all(
        selectedMemes.map(id =>
          fetch(`/api/delete-meme/${id}`, { method: 'DELETE' })
        )
      );

      const failed = results.filter(res => !res.ok).length;
      if (failed) {
        toast({
          title: "Delete Failed",
          description: `We couldn't delete ${failed} of your meme${failed > 1 ? 's' : ''}. Try again in a moment.`,
          className: "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive"
        });
      } else {
        toast({
          title: "Memes Removed",
          description: `${selectedMemes.length} meme${selectedMemes.length > 1 ? 's' : ''} deleted from your collection.`,
          className: "bg-white dark:bg-white text-green-600 dark:text-green-500 border-green-600 dark:border-green-500"
        });
      }

      // Reset selection mode
      setEditMode(false);
      setSelectedMemes([]);
      
      // Refresh the page (you'll need to implement this in the parent component)
      window.location.reload();
    } catch (error) {
      console.error('Error deleting memes:', error);
      toast({
        title: "Delete Failed",
        description: "We couldn't delete your memes right now. Try again in a moment.",
        className: "bg-white dark:bg-white text-destructive dark:text-destructive border-destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditMode(!editMode);
            setSelectedMemes([]);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          {editMode ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
        {editMode && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={isDeleting}
            >
              {selectedMemes.length === currentMemes.length ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={!selectedMemes.length || isDeleting}
            >
              {isDeleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedMemes.length})
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {currentMemes.map((meme) => (
          <div 
            key={meme.id} 
            className={`group relative rounded-xl transition-all duration-200 
              ${editMode ? 'cursor-pointer [animation:gentle-shake_0.5s_ease-in-out_infinite]' : ''} 
              ${selectedMemes.includes(meme.id) ? '!animate-none' : ''}`}
            onClick={() => editMode && handleSelectMeme(meme.id)}
          >
            <MemeCard
              key={meme.id}
              id={meme.id}
              imageUrl={meme.imageUrl}
              caption={meme.caption}
              hideDelete={editMode}
              selected={selectedMemes.includes(meme.id)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 animate-in fade-in duration-500 delay-300">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
