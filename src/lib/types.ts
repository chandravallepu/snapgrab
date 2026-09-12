export type Platform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "pinterest"
  | "snapchat"
  | "reddit"
  | "vimeo"
  | "twitch"
  | "dailymotion"
  | "soundcloud"
  | "unknown";

export type DownloadMode = "auto" | "audio";

export type CobaltPickerItem = {
  type: "photo" | "video" | "gif";
  url: string;
  thumb?: string;
};

export type SnapGrabResponse = {
  platform: Platform;
  title: string;
  thumbnail: string;
  author?: string;
  status: "success" | "picker" | "error";
  downloadUrl?: string;
  filename?: string;
  picker?: CobaltPickerItem[];
  audio?: string;
  audioFilename?: string;
  error?: { code?: string; message?: string } | string;
};

export type PlatformInfo = {
  name: string;
  color: string;
  bgColor: string;
  icon: string;
};

export const PLATFORM_INFO: Record<Platform, PlatformInfo> = {
  youtube: { name: "YouTube", color: "#FF0000", bgColor: "rgba(255,0,0,0.12)", icon: "youtube" },
  instagram: { name: "Instagram", color: "#E1306C", bgColor: "rgba(225,48,108,0.12)", icon: "instagram" },
  tiktok: { name: "TikTok", color: "#00F2EA", bgColor: "rgba(0,242,234,0.12)", icon: "tiktok" },
  facebook: { name: "Facebook", color: "#1877F2", bgColor: "rgba(24,119,242,0.12)", icon: "facebook" },
  twitter: { name: "Twitter/X", color: "#1DA1F2", bgColor: "rgba(29,161,242,0.12)", icon: "twitter" },
  pinterest: { name: "Pinterest", color: "#E60023", bgColor: "rgba(230,0,35,0.12)", icon: "pinterest" },
  snapchat: { name: "Snapchat", color: "#FFFC00", bgColor: "rgba(255,252,0,0.12)", icon: "snapchat" },
  reddit: { name: "Reddit", color: "#FF4500", bgColor: "rgba(255,69,0,0.12)", icon: "reddit" },
  vimeo: { name: "Vimeo", color: "#19B7EA", bgColor: "rgba(25,183,234,0.12)", icon: "vimeo" },
  twitch: { name: "Twitch", color: "#9146FF", bgColor: "rgba(145,70,255,0.12)", icon: "twitch" },
  dailymotion: { name: "Dailymotion", color: "#0066DC", bgColor: "rgba(0,102,220,0.12)", icon: "dailymotion" },
  soundcloud: { name: "SoundCloud", color: "#FF5500", bgColor: "rgba(255,85,0,0.12)", icon: "soundcloud" },
  unknown: { name: "Unknown", color: "#64748b", bgColor: "rgba(100,116,139,0.12)", icon: "link" },
};

export const SUPPORTED_PLATFORMS: Platform[] = [
  "youtube",
  "instagram",
  "tiktok",
  "facebook",
  "twitter",
  "pinterest",
  "snapchat",
  "reddit",
  "vimeo",
  "twitch",
  "dailymotion",
  "soundcloud",
];
