import { useState, useRef, useCallback } from "react";
import { Clipboard, Loader2, Search, X } from "lucide-react";
import { detectPlatform, isValidUrl, normalizeUrl } from "@/lib/url";
import { PLATFORM_INFO } from "@/lib/types";

type Props = {
  onFetch: (url: string) => void;
  loading: boolean;
};

export function UrlInput({ onFetch, loading }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const platform = detectPlatform(value);
  const showPlatform = value.length > 4 && platform !== "unknown";
  const canSubmit = isValidUrl(normalizeUrl(value)) && !loading;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      onFetch(normalizeUrl(value));
    },
    [canSubmit, value, onFetch]
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text.trim());
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-2xl px-4">
      <div
        className={`relative flex items-center gap-2 rounded-2xl border bg-white/5 p-2 transition-all duration-300 ${
          focused
            ? "border-emerald-400/60 bg-white/10 shadow-lg shadow-emerald-500/10"
            : "border-white/10"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-400">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Paste a video link from any supported platform..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-white placeholder:text-slate-500 focus:outline-none sm:text-base"
        />

        {showPlatform && !loading && (
          <span
            className="hidden shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold sm:inline-block"
            style={{
              color: PLATFORM_INFO[platform].color,
              backgroundColor: PLATFORM_INFO[platform].bgColor,
            }}
          >
            {PLATFORM_INFO[platform].name}
          </span>
        )}

        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Clear input"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}

        {!value && !loading && (
          <button
            type="button"
            onClick={handlePaste}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Clipboard className="h-4 w-4" />
            <span className="hidden sm:inline">Paste</span>
          </button>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 text-sm font-semibold text-[#0a0a0f] transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
        >
          <span>Grab</span>
        </button>
      </div>

      {!focused && !value && (
        <p className="mt-3 text-center text-xs text-slate-500">
          No login needed. No captchas. Just paste and download.
        </p>
      )}
    </form>
  );
}
