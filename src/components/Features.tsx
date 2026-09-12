import { Zap, ShieldOff, Smartphone, Layers } from "lucide-react";
import { PLATFORM_INFO, SUPPORTED_PLATFORMS } from "@/lib/types";
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
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant", desc: "Paste a link, get your file in seconds" },
  { icon: ShieldOff, title: "No Sign-up", desc: "No accounts, no captchas, no tracking" },
  { icon: Smartphone, title: "Mobile First", desc: "Built for touch — works great on Android" },
  { icon: Layers, title: "12+ Platforms", desc: "All your favorite social media in one place" },
];

const PLATFORM_ICONS: Record<string, typeof Youtube> = {
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
};

export function Features() {
  return (
    <div className="mx-auto mt-12 w-full max-w-2xl px-4 sm:mt-16">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-400/20 hover:bg-white/[0.06]"
          >
            <f.icon className="mb-2 h-5 w-5 text-emerald-400" strokeWidth={2.5} />
            <h3 className="text-sm font-semibold text-white">{f.title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          Supported Platforms
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUPPORTED_PLATFORMS.map((p) => {
            const info = PLATFORM_INFO[p];
            const Icon = PLATFORM_ICONS[info.icon];
            return (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                style={{ color: info.color }}
              >
                {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
                {info.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
