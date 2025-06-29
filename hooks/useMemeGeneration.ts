import { useState, useCallback } from 'react';
import { generateMemeInBrowser } from '@/lib/caption';
import { useToast } from '@/components/ui/use-toast';

type FontSize = 'small' | 'medium' | 'large';

export const useMemeGeneration = (image: File | null) => {
  const [memeBlob, setMemeBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateMeme = useCallback(
    async (text: string, fontSize: FontSize) => {
      if (!image) return;
      setIsGenerating(true);
      try {
        const memeBlob = await generateMemeInBrowser(image, text, fontSize);
        setMemeBlob(memeBlob);
        return URL.createObjectURL(memeBlob);
      } catch (error) {
        console.error('Error generating meme:', error);
        toast({
          title: 'Couldn\'t Add Caption',
          description: 'We couldn\'t add your caption to the image. Try a shorter caption or refresh the page.',
          className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
        });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [image, toast]
  );

  const generateAICaption = async () => {
    if (!image) return null;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to generate caption');
      }
      const data = await res.json();
      return data.caption;
    } catch (error) {
      console.error('Error generating caption:', error);
      toast({
        title: 'AI Caption Not Generated',
        description: 'Our AI is having trouble being creative right now. Try uploading a clearer image or try again in a moment.',
        className: 'bg-white dark:bg-white text-destructive dark:text-destructive border-destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    memeBlob,
    isGenerating,
    loading,
    generateMeme,
    generateAICaption,
  };
};
