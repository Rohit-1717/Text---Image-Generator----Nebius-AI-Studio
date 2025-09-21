import  { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useApiStore } from "@/store/useApiStore";
import { Skeleton } from "@/components/ui/skeleton";
import DownloadButton from "../downloadButton/DownloadButton";

const shimmerClass =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

// ✅ Type for a single generated image
export interface GeneratedImage {
  _id: string;
  user: string;
  prompt: string;
  model: string;
  imageUrl: string;
  session: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Props include optional activeSession, but also allow parent to pass filtered images directly
interface GeneratedImagesProps {
  images?: GeneratedImage[]; // optional, parent can provide filtered images
  activeSession?: string | null;
}

export default function GeneratedImages({
  images: parentImages,
  activeSession,
}: GeneratedImagesProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const { images, pending, fetchGeneratedImages, loading } = useApiStore();

  // Auto-initialize session if not provided
  const [initializedSession, setInitializedSession] = useState<string | null>(
    activeSession ?? null
  );

  useEffect(() => {
    fetchGeneratedImages();
  }, [fetchGeneratedImages]);

  // If activeSession not provided, pick the latest session automatically
  useEffect(() => {
    if (!initializedSession && images.length > 0) {
      const latestSession = images[0].session; // assuming images[0] is latest
      setInitializedSession(latestSession);
    }
  }, [images, initializedSession]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const truncateText = (text: string | undefined, length: number) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  };

  // ✅ Filter images: prefer parentImages if passed
  const displayedImages =
    parentImages ??
    (initializedSession
      ? images.filter((img) => img.session === initializedSession)
      : images);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 h-[75vh] overflow-y-auto pr-2
          [scrollbar-width:thin] 
          [scrollbar-color:#3f3f46_#18181b] 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-zinc-900
          [&::-webkit-scrollbar-thumb]:bg-zinc-700 
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {/* Shimmer skeletons for loading */}
        {loading &&
          !displayedImages.length &&
          Array.from({ length: 6 }).map((_, idx) => (
            <Card
              key={idx}
              className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-lg flex flex-col"
            >
              <Skeleton
                className={`w-full h-48 md:h-56 lg:h-48 ${shimmerClass}`}
              />
              <CardContent className="p-4 space-y-2">
                <Skeleton className={`h-4 w-3/4 ${shimmerClass}`} />
                <Skeleton className={`h-4 w-1/2 ${shimmerClass}`} />
                <Skeleton className={`h-3 w-1/4 mt-2 ${shimmerClass}`} />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end">
                <Skeleton className={`h-8 w-24 rounded ${shimmerClass}`} />
              </CardFooter>
            </Card>
          ))}

        {/* Pending images */}
        {pending.map((p) => (
          <Card
            key={p._id}
            className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-lg flex flex-col"
          >
            <Skeleton
              className={`w-full h-48 md:h-56 lg:h-48 ${shimmerClass}`}
            />
            <CardContent className="p-4 space-y-2">
              <Skeleton className={`h-4 w-3/4 ${shimmerClass}`} />
              <Skeleton className={`h-4 w-1/2 ${shimmerClass}`} />
              <Skeleton className={`h-3 w-1/4 mt-2 ${shimmerClass}`} />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Skeleton className={`h-8 w-24 rounded ${shimmerClass}`} />
            </CardFooter>
          </Card>
        ))}

        {/* Actual images */}
        {displayedImages.map((image) => {
          const isExpanded = expandedIds.includes(image._id);
          return (
            <Card
              key={image._id}
              className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-lg flex flex-col"
            >
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-48 md:h-56 lg:h-48 object-cover block"
              />

              <CardContent className="flex-1 flex flex-col justify-between p-4">
                <div>
                  <h3 className="text-white font-semibold text-md">
                    {isExpanded
                      ? image.prompt ?? ""
                      : truncateText(image.prompt, 30)}
                  </h3>

                  {image.prompt && image.prompt.length > 30 && (
                    <button
                      className="text-zinc-500 text-sm mt-1 hover:underline"
                      onClick={() => toggleExpand(image._id)}
                    >
                      {isExpanded ? "Show less" : "More..."}
                    </button>
                  )}

                  <p className="text-zinc-400 text-sm mt-2">
                    Model: {image.model}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-end">
                <DownloadButton
                  imageId={image._id}
                  imageUrl={image.imageUrl}
                  prompt={image.prompt}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
