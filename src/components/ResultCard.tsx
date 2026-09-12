import { useState } from "react";
import { Download, Music, FileVideo, ExternalLink, AlertCircle, Loader2, Check, ArrowRight } from "lucide-react";
import type { SnapGrabResponse } from "@/lib/types";
import { PlatformBadge } from "./PlatformBadge";

type Props = {
  result: SnapGrabResponse;
  loadingMp3: boolean;
  loadingMp4: boolean;
  onDownloadMp3: () => void;
  onDownloadMp4: () => void;
  videoQuality: string;
  onVideoQualityChange: (value: string) => void;
  audioBitrate: string;
  onAudioBitrateChange: (value: string) => void;
};

function triggerDownload(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ResultCard({
  result,
  loadingMp3,
  loadingMp4,
  onDownloadMp3,
  onDownloadMp4,
  videoQuality,
  onVideoQualityChange,
  audioBitrate,
  onAudioBitrateChange,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (result.downloadUrl) {
      try {
        await navigator.clipboard.writeText(result.downloadUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard not available
      }
    }
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl animate-[slideUp_0.4s_ease-out] px-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] shadow-2xl backdrop-blur-xl">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
          {result.thumbnail && !imageError ? (
            <img
              src={result.thumbnail}
              alt={result.title}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <FileVideo className="h-12 w-12 text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute left-3 top-3">
            <PlatformBadge platform={result.platform} />
          </div>
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6">
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-white sm:text-xl">
            {result.title}
          </h2>
          {result.author && (
            <p className="mt-1 text-sm text-slate-400">{result.author}</p>
          )}

          {/* Quality selectors */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-400">Video quality</span>
              <select
                value={videoQuality}
                onChange={(e) => onVideoQualityChange(e.target.value)}
                disabled={loadingMp4 || loadingMp3}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400/60 focus:outline-none disabled:opacity-60"
              >
                <option value="2160" className="bg-slate-900">4K (2160p)</option>
                <option value="1440" className="bg-slate-900">1440p</option>
                <option value="1080" className="bg-slate-900">1080p (HD)</option>
                <option value="720" className="bg-slate-900">720p</option>
                <option value="480" className="bg-slate-900">480p</option>
                <option value="360" className="bg-slate-900">360p</option>
                <option value="240" className="bg-slate-900">240p</option>
                <option value="144" className="bg-slate-900">144p</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-400">Audio quality</span>
              <select
                value={audioBitrate}
                onChange={(e) => onAudioBitrateChange(e.target.value)}
                disabled={loadingMp4 || loadingMp3}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400/60 focus:outline-none disabled:opacity-60"
              >
                <option value="320" className="bg-slate-900">320 kbps (Best)</option>
                <option value="256" className="bg-slate-900">256 kbps</option>
                <option value="128" className="bg-slate-900">128 kbps</option>
                <option value="96" className="bg-slate-900">96 kbps</option>
                <option value="64" className="bg-slate-900">64 kbps</option>
              </select>
            </label>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            If your chosen quality isn't available, the closest one will be used automatically.
          </p>

          {/* Download buttons */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onDownloadMp4}
              disabled={loadingMp4}
              className="group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-4 text-base font-bold text-[#0a0a0f] transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMp4 ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Fetching MP4...</span>
                </>
              ) : (
                <>
                  <FileVideo className="h-5 w-5" strokeWidth={2.5} />
                  <span>Download MP4</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadMp3}
              disabled={loadingMp3}
              className="group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-bold text-white transition-all duration-200 hover:bg-white/10 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMp3 ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  <span>Fetching MP3...</span>
                </>
              ) : (
                <>
                  <Music className="h-5 w-5 text-cyan-400" strokeWidth={2.5} />
                  <span>Download MP3</span>
                </>
              )}
            </button>
          </div>

          {/* Direct link */}
          {result.downloadUrl && !loadingMp4 && !loadingMp3 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
              <a
                href={result.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-1 items-center gap-2 text-sm text-slate-300 hover:text-white"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="truncate">{result.filename || "Direct download link"}</span>
              </a>
              <button
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          {/* Picker items (Instagram/TikTok multi-media posts) */}
          {result.status === "picker" && result.picker && result.picker.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-slate-400">
                {result.picker.length} items found — tap to download
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {result.picker.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40 transition-all hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    {item.thumb ? (
                      <img
                        src={item.thumb}
                        alt={`Item ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Download className="h-6 w-6 text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-2xl animate-[slideUp_0.4s_ease-out] px-4">
      <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        <div>
          <p className="font-semibold text-red-300">Couldn't process this link</p>
          <p className="mt-0.5 text-sm text-red-300/70">{message}</p>
        </div>
      </div>
    </div>
  );
}
