import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-16 px-5 pb-8 pt-4">
      <div className="mx-auto max-w-2xl text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <span>SnapGrab — for personal use only. Respect copyright.</span>
        </p>
        <p className="mt-1.5 flex items-center justify-center gap-1 text-xs text-slate-600">
          Built with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> for fast downloads
        </p>
      </div>
    </footer>
  );
}
