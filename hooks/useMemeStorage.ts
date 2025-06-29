import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useMemeStorage = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveMeme = async (memeBlob: Blob | null, caption: string) => {
    if (!memeBlob) {
      toast({
        title: 'No Meme to Save',
        description: 'Looks like there\'s no meme ready to save. Try generating a caption first.',
        className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
      });
      return;
    }

    const file = new File([memeBlob], 'meme.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      setSaving(true);
      const res = await fetch('/api/save-meme', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save meme');
      }

      toast({
        title: 'Meme Saved!',
        description: 'Your meme is now in your collection.',
        className: 'bg-white dark:bg-white text-green-600 dark:text-green-500 border-green-600 dark:border-green-500',
      });
    } catch (error) {
      console.error('Error saving meme:', error);
      toast({
        title: 'Save Failed',
        description: 'We couldn\'t save your meme right now. Try again in a moment.',
        className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    saveMeme,
  };
};
