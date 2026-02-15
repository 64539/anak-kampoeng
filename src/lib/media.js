"use strict";

function normalizeUrl(url) {
  if (!url) return "";
  return url.trim();
}

export function isYouTubeUrl(url) {
  const value = normalizeUrl(url);
  if (!value) return false;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    return host.includes("youtube.com") || host.includes("youtu.be");
  } catch {
    return false;
  }
}

export function isSupportedEmbedUrl(url) {
  const value = normalizeUrl(url);
  if (!value) return false;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) return true;
    if (host.includes("tiktok.com")) return true;
    return false;
  } catch {
    return false;
  }
}

export function extractYouTubeVideoId(url) {
  const value = normalizeUrl(url);
  if (!value) return null;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      const path = parsed.pathname.replace(/^\/+/, "");
      return path || null;
    }

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/watch")) {
        const v = parsed.searchParams.get("v");
        return v || null;
      }
      if (parsed.pathname.startsWith("/embed/")) {
        const parts = parsed.pathname.split("/");
        return parts[2] || null;
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        const parts = parsed.pathname.split("/");
        return parts[2] || null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function buildYouTubeThumbnailUrl(videoId) {
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

