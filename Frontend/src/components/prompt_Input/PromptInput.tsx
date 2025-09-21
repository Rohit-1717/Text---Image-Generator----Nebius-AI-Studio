import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, SendHorizontal } from "lucide-react";
import { useApiStore } from "@/store/useApiStore";

interface PromptInputProps {
  selectedModel: string;
}

export default function PromptInput({ selectedModel }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const generateImage = useApiStore((state) => state.generateImage);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = window.innerHeight / 3;
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [prompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    console.log("Submitting prompt:", prompt);
    console.log("Selected model:", selectedModel);
    console.log("File:", file ? file.name : "No file");

    setLoading(true);

    try {
      const result = await generateImage(
        selectedModel,
        prompt,
        file || undefined
      );
      console.log("Image generated successfully:", result);
      // Don't call onResult, DB fetch will handle it
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setPrompt("");
      setFile(null);
      setLoading(false);
      console.log("Form reset and loading state cleared");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 py-3 bg-zinc-950">
      <div className="max-w-4xl mx-auto w-full rounded-3xl border border-zinc-700 bg-zinc-900 px-3 py-2 flex flex-col">
        <textarea
          ref={textareaRef}
          placeholder="Turn Your Imagination Into Reality"
          className="w-full resize-none bg-transparent text-white placeholder-zinc-400 outline-none text-sm sm:text-base leading-relaxed max-h-[33vh] overflow-y-auto
             [scrollbar-width:thin] 
             [scrollbar-color:#3f3f46_#18181b] 
             [&::-webkit-scrollbar]:w-2
             [&::-webkit-scrollbar-track]:bg-zinc-900
             [&::-webkit-scrollbar-thumb]:bg-zinc-700 
             [&::-webkit-scrollbar-thumb]:rounded-full"
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <div className="flex items-center justify-between mt-2">
          <label className="cursor-pointer p-2 text-zinc-400 hover:text-white shrink-0">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-600 text-zinc-400 hover:text-white hover:border-white transition">
              <Plus className="w-5 h-5" />
            </div>
          </label>

          <Button
            aria-label="submit"
            type="submit"
            disabled={loading}
            className="rounded-(--radius) bg-zinc-800 hover:bg-zinc-700 text-white shrink-0 px-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden md:inline">Generating...</span>
              </div>
            ) : (
              <>
                <span className="hidden md:block">Generate</span>
                <SendHorizontal
                  className="relative mx-auto size-5 md:hidden"
                  strokeWidth={2}
                />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
