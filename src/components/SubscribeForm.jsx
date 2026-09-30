import { useState } from "react";

export default function SubscribeForm({ accentColor }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
        <p className="font-semibold text-neutral-900">You're subscribed!</p>
        <p className="mt-1 text-sm text-neutral-600">We'll email you the picks as soon as they're in.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor="subscribe-email" className="sr-only">
          Email address
        </label>
        <input
          id="subscribe-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2"
          style={{ "--tw-ring-color": accentColor }}
        />
        {status === "error" && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: accentColor }}
      >
        {status === "loading" ? "Subscribing…" : "Get Picks by Email"}
      </button>
    </form>
  );
}
