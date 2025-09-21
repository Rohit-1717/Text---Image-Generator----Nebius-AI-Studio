import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className="h-7 w-7 p-0 flex items-center justify-center rounded-full"
      onClick={handleCopy}
    >
      {copied ? <Check size={16} /> : <Clipboard size={16} />}
    </Button>
  );
}
