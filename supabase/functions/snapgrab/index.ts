import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Instance list sourced from cobalt.directory (updated 2026-09-10).
// Sorted by score/uptime — community instances first (higher service coverage),
// then official imput.net instances as fallback.
// Turnstile-protected instances are included; cobalt returns a clear error
// if a challenge is required, and we move on to the next instance.
const COBALT_INSTANCES = [
  "https://bergung-api.hoffnungfuerdiezukunft.net",
  "https://nuko-c.meowing.de",
  "https://api.cobalt.rpkiinval.id",
  "https://cobalt-omega.wolfy.love",
  "https://apicobalt.mgytr.top",
  "https://cobalt-alpha.wolfy.love",
  "https://lime.clxxped.lol",
  "https://cobaltapi.kittycat.boo",
  "https://api.qwkuns.me",
  "https://cobaltapi.squair.xyz",
  "https://cobalt-api.lamps-dev.dev",
  "https://api-cobalt.eversiege.network",
  "https://kitty.tame.gg",
  "https://kityune.imput.net",
  "https://nachos.imput.net",
  "https://sunny.imput.net",
];

type Platform =
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

function detectPlatform(url: string): Platform {
  const lower = url.toLowerCase();
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

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  twitter: "Twitter/X",
  pinterest: "Pinterest",
  snapchat: "Snapchat",
  reddit: "Reddit",
  vimeo: "Vimeo",
  twitch: "Twitch",
  dailymotion: "Dailymotion",
  soundcloud: "SoundCloud",
  unknown: "Unknown",
};

async function fetchOEmbed(
  oembedUrl: string,
  fallbackTitle: string
): Promise<{ title: string; thumbnail: string; author?: string }> {
  const resp = await fetch(oembedUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!resp.ok) throw new Error(`oEmbed failed: ${resp.status}`);
  const data = await resp.json();
  return {
    title: data.title || fallbackTitle,
    thumbnail: data.thumbnail_url || data.thumbnail || "",
    author: data.author_name,
  };
}

async function fetchOpenGraph(url: string): Promise<{ title: string; thumbnail: string; author?: string } | null> {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SnapGrab/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    const getMeta = (property: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, "i"),
        new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, "i"),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) return m[1];
      }
      return null;
    };

    const ogTitle = getMeta("og:title");
    const ogImage = getMeta("og:image") || getMeta("og:image:secure_url");
    const ogSite = getMeta("og:site_name");
    const twitterTitle = getMeta("twitter:title");
    const twitterImage = getMeta("twitter:image");

    const title = ogTitle || twitterTitle;
    const thumbnail = ogImage || twitterImage;

    if (title || thumbnail) {
      return {
        title: title || "Media Post",
        thumbnail: thumbnail || "",
        author: ogSite || undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchMetadata(
  url: string,
  platform: Platform
): Promise<{ title: string; thumbnail: string; author?: string }> {
  const fallbackTitle = `${PLATFORM_LABELS[platform]} Video`;

  try {
    if (platform === "youtube") {
      return await fetchOEmbed(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
        fallbackTitle
      );
    }

    if (platform === "instagram") {
      return await fetchOEmbed(
        `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "tiktok") {
      return await fetchOEmbed(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "vimeo") {
      return await fetchOEmbed(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "dailymotion") {
      return await fetchOEmbed(
        `https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "soundcloud") {
      return await fetchOEmbed(
        `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`,
        fallbackTitle
      );
    }

    if (platform === "reddit") {
      return await fetchOEmbed(
        `https://www.reddit.com/oembed?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "facebook") {
      return await fetchOEmbed(
        `https://www.facebook.com/plugins/post/oembed.json?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "twitter") {
      return await fetchOEmbed(
        `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }

    if (platform === "pinterest") {
      return await fetchOEmbed(
        `https://api.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`,
        fallbackTitle
      );
    }
  } catch (err) {
    console.error(`oEmbed failed for ${platform}:`, err);
  }

  // OpenGraph fallback for all platforms
  const og = await fetchOpenGraph(url);
  if (og) return og;

  return { title: fallbackTitle, thumbnail: "" };
}

async function fetchFromCobalt(url: string, mode: "auto" | "audio", platform: string): Promise<any> {
  const body: any = {
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

  let lastRealError: any = null;
  let blockedCount = 0;
  let networkErrorCount = 0;
  let attemptedCount = 0;

  for (const instance of COBALT_INSTANCES) {
    attemptedCount++;
    try {
      const resp = await fetch(`${instance}/`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "SnapGrab/1.0",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });

      // 401/403 = instance blocked the request (bot protection, IP filter, etc.)
      // Skip silently — don't let it become the user-facing error.
      if (resp.status === 401 || resp.status === 403) {
        blockedCount++;
        continue;
      }

      // 429 = rate limited — skip to next instance
      if (resp.status === 429) {
        blockedCount++;
        continue;
      }

      // Other HTTP errors — track but keep going
      if (!resp.ok) {
        lastRealError = { code: `http_${resp.status}`, message: `HTTP ${resp.status}` };
        continue;
      }

      const data = await resp.json();

      if (data.status === "error") {
        const errCode = data.error?.code || "unknown";
        // Turnstile/auth errors mean this instance needs a challenge — skip to next
        if (errCode.startsWith("api.auth") || errCode.includes("turnstile")) {
          blockedCount++;
          continue;
        }
        // Content-specific errors (unsupported link, private video, etc.) — return immediately
        // since no other instance will handle it differently
        if (errCode.includes("link") || errCode.includes("content") || errCode.includes("unsupported") || errCode.includes("private")) {
          return {
            status: "error",
            error: { code: errCode, message: data.error?.context?.service ? `This ${data.error.context.service} link isn't supported or may be private.` : "This link isn't supported or may be private." },
          };
        }
        lastRealError = data.error;
        continue;
      }

      if (data.status === "tunnel" || data.status === "redirect") {
        return {
          status: "success",
          downloadUrl: data.url,
          filename: data.filename,
        };
      }

      if (data.status === "picker" && data.picker) {
        return {
          status: "picker",
          picker: data.picker.map((item: any) => ({
            type: item.type,
            url: item.url,
            thumb: item.thumb,
          })),
          audio: data.audio,
          audioFilename: data.audioFilename,
        };
      }

      if (data.status === "local-processing") {
        return {
          status: "success",
          downloadUrl: data.tunnel?.[0] || null,
          filename: data.output?.filename,
        };
      }

      lastRealError = { code: "api.unknown_response" };
    } catch (err) {
      networkErrorCount++;
      lastRealError = { code: "network_error", message: err.message };
      continue;
    }
  }

  // Build the user-facing error message based on what actually happened
  let failMessage: string;
  if (blockedCount === attemptedCount) {
    failMessage = "All download servers are currently busy or rate-limited. Please try again in a moment.";
  } else if (networkErrorCount === attemptedCount) {
    failMessage = "Couldn't connect to any download servers. Please check your connection and try again.";
  } else if (lastRealError?.message) {
    failMessage = `Couldn't process this link: ${lastRealError.message}`;
  } else {
    failMessage = "All download servers are currently busy. Please try again in a moment.";
  }

  return {
    status: "error",
    error: { code: lastRealError?.code || "api.all_instances_failed", message: failMessage },
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url, mode } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const platform = detectPlatform(url);

    if (platform === "unknown") {
      return new Response(
        JSON.stringify({ error: "Unsupported URL. Please paste a link from YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Snapchat, Reddit, Vimeo, Twitch, Dailymotion, or SoundCloud." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const metadata = await fetchMetadata(url, platform);
    const cobaltResult = await fetchFromCobalt(url, mode || "auto", platform);

    return new Response(
      JSON.stringify({
        platform,
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        author: metadata.author,
        ...cobaltResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
