import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-10 px-5 pt-8 pb-2 sm:pt-12">
      <div className="mx-auto flex max-w-2xl items-center justify-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/25 sm:h-12 sm:w-12">
          <Zap className="h-6 w-6 text-[#0a0a0f] sm:h-7 sm:w-7" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Snap<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Grab</span>
        </h1>
      </div>
      <p className="mt-2 text-center text-sm text-slate-400 sm:text-base">
        Download videos & audio from 12+ platforms — fast, free, no sign-up
      </p>
    </header>
  );
}
