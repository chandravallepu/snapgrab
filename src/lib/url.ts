import type { Platform } from "./types";

export function detectPlatform(url: string): Platform {
  const lower = url.toLowerCase().trim();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("facebook.com") || lower.includes("fb.watch") || lower.includes("fb.com")) return "facebook";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("pinterest.com") || lower.includes("pin.it")) return "pinterest";
  if (lower.includes("snapchat.com")) return "snapchat";
  if (lower.includes("reddit.com")) return "reddit";
  if (lower.includes("vimeo.com")) return "vimeo";
  if (lower.includes("twitch.tv")) return "twitch";
  if (lower.includes("dailymotion.com") || lower.includes("dai.ly")) return "dailymotion";
  if (lower.includes("soundcloud.com")) return "soundcloud";
  return "unknown";
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}
