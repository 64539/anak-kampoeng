"use client";

import { useEffect, useRef, useState } from "react";
import { extractYouTubeVideoId, isYouTubeUrl } from "@/lib/media";

interface VideoPlayerProps {
  sourceType: "image" | "video";
  mediaType: "upload" | "embed";
  mediaUrl: string;
  thumbnailUrl?: string | null;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({
  sourceType,
  mediaType,
  mediaUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (sourceType !== "video") {
    return null;
  }

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center bg-black text-gray-400 text-sm ${className || ""}`}
      >
        Video tidak dapat diputar.
      </div>
    );
  }

  const renderThumbnailOverlay = () => {
    if (!thumbnailUrl) {
      return null;
    }
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
        <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
          <span className="block w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-white ml-1" />
        </div>
      </div>
    );
  };

  const youTubeId = isYouTubeUrl(mediaUrl) ? extractYouTubeVideoId(mediaUrl) : null;
  const youTubeEmbedUrl =
    youTubeId && mediaType === "embed"
      ? `https://www.youtube.com/embed/${youTubeId}?autoplay=${autoPlay ? 1 : 0}&controls=1`
      : null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black overflow-hidden ${className || ""}`}
    >
      {!isInView && thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover"
        />
      )}
      {isInView && mediaType === "embed" && youTubeEmbedUrl && (
        <>
          {thumbnailUrl && isLoading && (
            <img
              src={thumbnailUrl}
              alt={title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <iframe
            src={youTubeEmbedUrl}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video"}
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
      {isInView && mediaType === "embed" && !youTubeEmbedUrl && (
        <iframe
          src={mediaUrl}
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          title={title || "Video"}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}
      {isInView && mediaType === "upload" && (
        <video
          src={mediaUrl}
          className="w-full h-full"
          controls
          autoPlay={autoPlay}
          playsInline
          poster={thumbnailUrl || undefined}
          preload="metadata"
          onLoadedData={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      )}
      {(isLoading || !isInView) && !hasError && !thumbnailUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-gray-400 text-xs">
          Memuat video...
        </div>
      )}
      {renderThumbnailOverlay()}
    </div>
  );
}

