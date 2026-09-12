import type { DownloadMode, SnapGrabResponse, Platform } from "./types";
import { PLATFORM_INFO } from "./types";
import { detectPlatform } from "./url";

// Your own self-hosted Cobalt instance (deployed on Railway).
// Set this in .env (local dev) and in your Vercel/Netlify project's
// Environment Variables (production) — same variable name, same value.
const COBALT_API_URL = import.meta.env.VITE_COBALT_API_URL as string;

function buildCobaltBody(url: string, mode: DownloadMode, platform: Platform) {
  const body: Record<string, unknown> = {
    url,
    downloadMode: mode === "audio" ? "audio" : "auto",
    filenameStyle: "pretty",
  };

  if (mode === "audio") {
    body.audioFormat = "mp3";
    body.audioBitrate = "320";
  } else {
    body.videoQuality = "1080";
    if (platform === "youtube") {
      body.youtubeVideoCodec = "h264";
      body.youtubeVideoContainer = "mp4";
    }
    if (platform === "tiktok") {
      body.allowH265 = false;
    }
  }

  return body;
}

export async function fetchDownload(
  url: string,
  mode: DownloadMode,
): Promise<SnapGrabResponse> {
  const platform = detectPlatform(url);
  const fallbackTitle = `${PLATFORM_INFO[platform].name} ${mode === "audio" ? "Audio" : "Video"}`;

  if (!COBALT_API_URL) {
    return {
      platform,
      title: "",
      thumbnail: "",
      status: "error",
      error: {
        message:
          "Download server isn't configured. Set VITE_COBALT_API_URL in your deployment's environment variables.",
      },
    };
  }

  if (platform === "unknown") {
    return {
      platform,
      title: "",
      thumbnail: "",
      status: "error",
      error: {
        message:
          "Unsupported URL. Please paste a link from YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Snapchat, Reddit, Vimeo, Twitch, Dailymotion, or SoundCloud.",
      },
    };
  }

  let response: Response;
  try {
    response = await fetch(`${COBALT_API_URL.replace(/\/$/, "")}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(buildCobaltBody(url, mode, platform)),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    return {
      platform,
      title: fallbackTitle,
      thumbnail: "",
      status: "error",
      error: {
        message:
          "Couldn't reach the download server. It may be asleep or offline — try again in a few seconds.",
      },
    };
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        message =
          typeof errorBody.error === "string"
            ? errorBody.error
            : errorBody.error.message || errorBody.error.code || message;
      }
    } catch {
      // response body wasn't JSON
    }
    return {
      platform,
      title: fallbackTitle,
      thumbnail: "",
      status: "error",
      error: { message },
    };
  }

  const data = await response.json();

  if (data.status === "error") {
    const err = data.error;
    const message =
      typeof err === "string"
        ? err
        : err?.message || err?.code || "Download failed. Try again or use a different link.";
    return {
      platform,
      title: fallbackTitle,
      thumbnail: "",
      status: "error",
      error: { message },
    };
  }

  if (data.status === "tunnel" || data.status === "redirect") {
    return {
      platform,
      title: fallbackTitle,
      thumbnail: "",
      status: "success",
      downloadUrl: data.url,
      filename: data.filename,
    };
  }

  if (data.status === "picker" && data.picker) {
    return {
      platform,
      title: fallbackTitle,
      thumbnail: data.picker[0]?.thumb || "",
      status: "picker",
      picker: data.picker.map(
        (item: { type: string; url: string; thumb?: string }) => ({
          type: item.type as "photo" | "video" | "gif",
          url: item.url,
          thumb: item.thumb,
        }),
      ),
      audio: data.audio,
      audioFilename: data.audioFilename,
    };
  }

  if (data.status === "local-processing") {
    return {
      platform,
      title: fallbackTitle,
      thumbnail: "",
      status: "success",
      downloadUrl: data.tunnel?.[0] || undefined,
      filename: data.output?.filename,
    };
  }

  return {
    platform,
    title: fallbackTitle,
    thumbnail: "",
    status: "error",
    error: { message: "Unexpected response from the download server." },
  };
}
