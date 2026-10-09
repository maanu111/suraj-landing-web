"use client";

import { useState, type FormEvent } from "react";
import SelectField from "./select-field";

type Props = {
  /** Dropdown options and destination number, all editable from /admin. */
  services: string[];
  budgets: string[];
  whatsapp: string;
  brand: string;
};

export default function WhatsAppForm({ services, budgets, whatsapp, brand }: Props) {
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"info" | "error">("info");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Hidden inputs are exempt from native constraint validation, so the two
    // custom dropdowns are checked here instead.
    if (!service || !budget) {
      setTone("error");
      setStatus(`Please choose a ${!service ? "service" : "budget range"} before sending.`);
      return;
    }

    // Admin value wins; the env var stays as a fallback.
    const number = (whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
    if (!number) {
      setTone("error");
      setStatus("WhatsApp isn’t connected yet — add a number under Enquiry form in /admin.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const message = [
      `Hello ${brand || "Studio"} — I’d like to discuss a project.`,
      "",
      `Name: ${form.get("name")}`,
      `Company: ${form.get("company") || "—"}`,
      `Email: ${form.get("email")}`,
      `Service: ${form.get("service")}`,
      `Budget: ${form.get("budget")}`,
      "",
      `Brief: ${form.get("project")}`,
    ].join("\n");

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setTone("info");
    setStatus("Your WhatsApp message is ready in a new tab.");
  }

  return (
    <form className="form" data-reveal="right" onSubmit={handleSubmit}>
      <div className="form-top">
        <b>Step 1 of 1</b>
        <span>Takes about 40 seconds</span>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Ananya Mehta" required />
        </div>
        <div className="field">
          <label htmlFor="company">
            Company <em>optional</em>
          </label>
          <input id="company" name="company" autoComplete="organization" placeholder="Brand or agency" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="ananya@brand.com" required />
      </div>

      <div className="field-row">
        <SelectField
          name="service"
          label="What do you need?"
          placeholder="Select a service"
          options={services}
          value={service}
          onChange={setService}
        />
        <SelectField
          name="budget"
          label="Ballpark budget"
          placeholder="Select a range"
          options={budgets}
          value={budget}
          onChange={setBudget}
        />
      </div>

      <div className="field">
        <label htmlFor="project">A little about the project</label>
        <textarea
          id="project"
          name="project"
          rows={4}
          placeholder="e.g. We're launching a serum in March — need a 30s hero film plus six vertical cutdowns for Meta."
          required
        />
      </div>

      <button type="submit" className="btn btn-fill">
        Send enquiry on WhatsApp <i aria-hidden="true">↗</i>
      </button>

      <p className="form-status" role="status" aria-live="polite" data-tone={tone}>
        {status || "Opens a pre-filled message in WhatsApp — nothing is sent until you hit send there."}
      </p>
    </form>
  );
}
