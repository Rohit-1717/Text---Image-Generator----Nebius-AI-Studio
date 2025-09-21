import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useDownloadStore } from "@/store/useDownloadStore";

interface DownloadButtonProps {
  imageUrl: string;
  imageId: string;
  prompt: string;
}

const formats = ["PNG", "JPEG", "WEBP", "GIF", "SVG"];

const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageUrl,
  imageId,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("PNG");

  const downloadImage = useDownloadStore((state) => state.downloadImage);
  const downloading = useDownloadStore((state) => state.downloading[imageId]);

  const handleDownload = async (format: string = selectedFormat) => {
    const blob = await downloadImage(imageUrl, format, imageId);
    if (!blob) return;

    const fileName = `Morphix_Generated_Image${imageId}.${format.toLowerCase()}`;

    // ✅ Browser-managed download → appears in Downloads UI
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    // Required for Firefox
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Cleanup
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000);
  };

  return (
    <DropdownMenu>
      <div className="inline-flex rounded-lg overflow-hidden border border-zinc-700 shadow-sm">
        {/* Main download button */}
        <Button
          variant="default"
          size="sm"
          className="rounded-none"
          onClick={() => handleDownload()}
          disabled={downloading}
        >
          {downloading ? "Downloading..." : `Download (${selectedFormat})`}
        </Button>

        {/* Dropdown for format selection */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="rounded-none border-l border-zinc-700 px-2"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end">
        {formats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => setSelectedFormat(format)}
          >
            {format}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
