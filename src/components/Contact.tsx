import { useState, FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", name, email, message }),
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div id="contact" className="mx-auto mt-16 w-full max-w-md scroll-mt-6 px-4 text-center">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
          <h3 className="mt-3 text-sm font-semibold text-white">Message sent</h3>
          <p className="mt-1 text-xs text-slate-400">Thanks — we'll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="contact" className="mx-auto mt-16 w-full max-w-md scroll-mt-6 px-4">
      <div className="flex items-center justify-center gap-2">
        <Mail className="h-5 w-5 text-emerald-400" strokeWidth={2.5} />
        <h2 className="text-lg font-bold text-white">Contact us</h2>
      </div>
      <p className="mt-1 text-center text-sm text-slate-400">
        Found a bug or have a question? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-400/40"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-400/40"
        />
        <textarea
          required
          rows={4}
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-400/40"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {status === "error" && (
          <p className="text-center text-xs text-rose-400">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
