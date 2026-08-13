import { useId, useState } from "react";
import { usePageMeta } from "../hooks/usePageMeta";

// Web3Forms access key for raddadnetwork@mail.com. This is a public token
// meant to be used client-side (not a secret), per Web3Forms' own design.
const WEB3FORMS_ACCESS_KEY = "40caf691-617c-46da-9d47-6d9ae6b51cb5";

export default function Contact() {
  usePageMeta("Contact", "Get in touch with the Rad Dad Network.");

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Message from ${form.name || "the Rad Dad Network site"}`,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message ?? "Submission failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">Get in Touch</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Have a question, a show idea, or just want to say hi? Send us a message, we'd love to
        hear from you. Interested in joining the network? Mention it below and we'll follow up.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
        <div>
          <label htmlFor={nameId} className="block text-sm font-semibold text-neutral-900">
            Name
          </label>
          <input
            id={nameId}
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={updateField("name")}
            className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor={emailId} className="block text-sm font-semibold text-neutral-900">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={updateField("email")}
            className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor={messageId} className="block text-sm font-semibold text-neutral-900">
            Message
          </label>
          <textarea
            id={messageId}
            required
            rows={5}
            value={form.message}
            onChange={updateField("message")}
            className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>

        <p aria-live="polite" className="text-sm">
          {status === "success" && (
            <span className="text-green-600">
              Thanks for reaching out, we'll get back to you soon.
            </span>
          )}
          {status === "error" && (
            <span className="text-red-600">
              Something went wrong sending your message. Please try again in a bit.
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
