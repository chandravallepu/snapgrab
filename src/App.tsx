import { useState, useCallback } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { ResultCard, ErrorCard } from "@/components/ResultCard";
import { Features } from "@/components/Features";
import { HowToUse } from "@/components/HowToUse";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { fetchDownload } from "@/lib/api";
import { detectPlatform } from "@/lib/url";
import { PLATFORM_INFO } from "@/lib/types";
import type { SnapGrabResponse } from "@/lib/types";

function App() {
  const [result, setResult] = useState<SnapGrabResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMp3, setLoadingMp3] = useState(false);
  const [loadingMp4, setLoadingMp4] = useState(false);
  const [lastUrl, setLastUrl] = useState("");
  const [videoQuality, setVideoQuality] = useState("1080");
  const [audioBitrate, setAudioBitrate] = useState("320");

  const handleFetch = useCallback((url: string) => {
    setError(null);
    setResult(null);

    const platform = detectPlatform(url);
    if (platform === "unknown") {
      setError(
        "Unsupported URL. Please paste a link from YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Snapchat, Reddit, Vimeo, Twitch, Dailymotion, or SoundCloud."
      );
      return;
    }

    setLastUrl(url);
    setResult({
      platform,
      title: `${PLATFORM_INFO[platform].name} Video`,
      thumbnail: "",
      status: "success",
    });
  }, []);

  const handleDownloadMp3 = useCallback(async () => {
    if (!lastUrl) return;
    setError(null);
    setLoadingMp3(true);

    const res = await fetchDownload(lastUrl, "audio", { audioBitrate });
    setLoadingMp3(false);

    if (res.status === "error") {
      const msg = typeof res.error === "string"
        ? res.error
        : res.error?.message || "Couldn't get MP3. Try again.";
      setError(msg);
    } else if (res.downloadUrl) {
      triggerDownload(res.downloadUrl, res.filename);
    }
  }, [lastUrl, audioBitrate]);

  const handleDownloadMp4 = useCallback(async () => {
    if (!lastUrl) return;
    setError(null);
    setLoadingMp4(true);

    const res = await fetchDownload(lastUrl, "auto", { videoQuality });
    setLoadingMp4(false);

    if (res.status === "error") {
      const msg = typeof res.error === "string"
        ? res.error
        : res.error?.message || "Couldn't get that quality. Try a different one.";
      setError(msg);
    } else if (res.downloadUrl) {
      setResult(res);
      triggerDownload(res.downloadUrl, res.filename);
    } else {
      setResult(res);
    }
  }, [lastUrl, videoQuality]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <UrlInput onFetch={handleFetch} loading={loadingMp4} />

      {error && <ErrorCard message={error} />}
      {result && !error && (
        <ResultCard
          result={result}
          loadingMp3={loadingMp3}
          loadingMp4={loadingMp4}
          onDownloadMp3={handleDownloadMp3}
          onDownloadMp4={handleDownloadMp4}
          videoQuality={videoQuality}
          onVideoQualityChange={setVideoQuality}
          audioBitrate={audioBitrate}
          onAudioBitrateChange={setAudioBitrate}
        />
      )}

      {!result && !error && <Features />}
      <HowToUse />
      <Contact />
      <Footer />
    </div>
  );
}

function triggerDownload(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default App;
