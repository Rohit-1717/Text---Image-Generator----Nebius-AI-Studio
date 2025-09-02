"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize but respect max height (1/3 of screen)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = window.innerHeight / 3; // 1/3rd of screen
      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";
    }
  }, [prompt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prompt:", prompt, "File:", file);
    setPrompt("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4 py-3 bg-zinc-950">
      <div className="max-w-4xl mx-auto w-full rounded-3xl border border-zinc-700 bg-zinc-900 px-3 py-2 flex flex-col">
        {/* Expanding textarea (up to 1/3rd of page) */}
        <textarea
          ref={textareaRef}
          placeholder="Message Morphix..."
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
        />

        {/* Actions row */}
        <div className="flex items-center justify-between mt-2">
          {/* File upload */}
          <label className="cursor-pointer p-2 text-zinc-400 hover:text-white shrink-0">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Paperclip className="w-5 h-5" />
          </label>

          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-zinc-800 hover:bg-zinc-700 text-white shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
