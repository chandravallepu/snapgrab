export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
      <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute top-1/3 -right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/6 blur-[100px]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
