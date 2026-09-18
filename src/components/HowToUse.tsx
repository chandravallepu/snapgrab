import { Link2, MousePointerClick, Settings2, Download } from "lucide-react";

const STEPS = [
  {
    icon: Link2,
    title: "Copy the link",
    desc: "Open the video/reel on YouTube, Instagram, or any supported app, tap Share, then Copy Link.",
  },
  {
    icon: MousePointerClick,
    title: "Paste & Grab",
    desc: "Paste the link into the box above and tap the Grab button.",
  },
  {
    icon: Settings2,
    title: "Pick a quality",
    desc: "Choose your preferred video or audio quality from the dropdown (optional — a default is picked for you).",
  },
  {
    icon: Download,
    title: "Download",
    desc: "Tap Download MP4 or Download MP3. The file saves straight to your device.",
  },
];

export function HowToUse() {
  return (
    <div id="how-it-works" className="mx-auto mt-16 w-full max-w-2xl scroll-mt-6 px-4">
      <h2 className="text-center text-lg font-bold text-white">How it works</h2>
      <p className="mt-1 text-center text-sm text-slate-400">
        Four steps, no app to install, no account needed.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-400">
                {i + 1}
              </span>
              <s.icon className="h-4 w-4 text-emerald-400" strokeWidth={2.5} />
              <h3 className="text-sm font-semibold text-white">{s.title}</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
