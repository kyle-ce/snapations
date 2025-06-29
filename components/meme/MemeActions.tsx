import { Button } from "@/components/ui/button";
import { LoaderCircle, Copy, Wand2 } from "lucide-react";

interface MemeActionsProps {
  mode: "ai" | "manual" | undefined;
  loading: boolean;
  copying: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  disabled: boolean;
  session: boolean;
}

export function MemeActions({
  mode,
  loading,
  copying,
  isGenerating,
  onGenerate,
  onCopy,
  disabled,
  session,
}: MemeActionsProps) {
  return (
    <div className="grid gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-2">
        {mode === "ai" && (
          <Button
            onClick={onGenerate}
            disabled={loading || disabled}
            title={
              !session ? "Sign in to use AI caption generation" : undefined
            }
            className="flex-1"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Caption
              </>
            )}
          </Button>
        )}
        <Button
          onClick={onCopy}
          disabled={copying || disabled || isGenerating}
          size={mode === "ai" ? "icon" : "default"}
          className={mode === "ai" ? "" : "w-full"}
          title="Copy meme to clipboard"
        >
          {copying ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : isGenerating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {mode === "manual" && <span className="ml-2">Copy Meme</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
