import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useClipboard = () => {
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  const copyBlobToClipboard = async (blob: Blob | null) => {
    if (!blob) {
      toast({
        title: 'No Image to Copy',
        description: 'Generate a meme first before copying to clipboard.',
        className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
      });
      return;
    }

    try {
      setCopying(true);
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      
      toast({
        title: 'Copied!',
        description: 'Meme copied to clipboard',
        className: 'bg-white dark:bg-white text-green-600 dark:text-green-500 border-green-600 dark:border-green-500',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy the meme to clipboard. Try again or save the image instead.',
        className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
      });
    } finally {
      setCopying(false);
    }
  };

  return {
    copying,
    copyBlobToClipboard,
  };
};
