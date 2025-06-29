import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TextQuote, Type, Heading } from 'lucide-react';

type FontSize = 'small' | 'medium' | 'large';
type CaptionMode = 'ai' | 'manual' | undefined;

interface CaptionControlsProps {
  mode: CaptionMode;
  setMode: (mode: CaptionMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  caption: string;
  setCaption: (caption: string) => void;
}

export function CaptionControls({
  mode,
  setMode,
  fontSize,
  setFontSize,
  caption,
  setCaption,
}: CaptionControlsProps) {
  return (
    <>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(val) => {
          if (val) setMode(val as CaptionMode);
        }}
        className="w-full animate-in fade-in slide-in-from-bottom-1 duration-500"
      >
        <ToggleGroupItem value="ai" className="flex-1 relative">
          AI Caption
        </ToggleGroupItem>
        <ToggleGroupItem value="manual" className="flex-1">
          Write My Own
        </ToggleGroupItem>
      </ToggleGroup>

      {mode === 'manual' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            <TooltipProvider>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setFontSize('small')}
                      className={`p-1.5 rounded transition-colors ${
                        fontSize === 'small'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <TextQuote className="h-3.5 w-3.5" />
                      <span className="sr-only">Small Font</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex items-center gap-2"
                  >
                    <TextQuote className="h-4 w-4" />
                    <span>Small Font</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setFontSize('medium')}
                      className={`p-1.5 rounded transition-colors ${
                        fontSize === 'medium'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Type className="h-3.5 w-3.5" />
                      <span className="sr-only">Medium Font</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex items-center gap-2"
                  >
                    <Type className="h-4 w-4" />
                    <span>Medium Font</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`p-1.5 rounded transition-colors ${
                        fontSize === 'large'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Heading className="h-3.5 w-3.5" />
                      <span className="sr-only">Large Font</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="flex items-center gap-2"
                  >
                    <Heading className="h-4 w-4" />
                    <span>Large Font</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-2"
            placeholder="Enter your caption..."
          />
        </div>
      )}
    </>
  );
}
