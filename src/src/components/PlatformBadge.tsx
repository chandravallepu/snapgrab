import {
  Youtube,
  Instagram,
  Music2,
  Facebook,
  Twitter,
  Bookmark,
  Ghost,
  MessageCircle,
  Video,
  Twitch,
  Film,
  Headphones,
  Link2,
} from "lucide-react";
import type { Platform } from "@/lib/types";
import { PLATFORM_INFO } from "@/lib/types";

export function PlatformBadge({ platform }: { platform: Platform }) {
  const info = PLATFORM_INFO[platform];

  const icons: Record<string, typeof Youtube> = {
    youtube: Youtube,
    instagram: Instagram,
    tiktok: Music2,
    facebook: Facebook,
    twitter: Twitter,
    pinterest: Bookmark,
    snapchat: Ghost,
    reddit: MessageCircle,
    vimeo: Video,
    twitch: Twitch,
    dailymotion: Film,
    soundcloud: Headphones,
    unknown: Link2,
  };

  const Icon = icons[info.icon] || Link2;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ color: info.color, backgroundColor: info.bgColor }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {info.name}
    </span>
  );
}
