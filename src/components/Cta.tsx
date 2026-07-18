"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import styles from "./Cta.module.css";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM = { name: "", email: "", company: "", message: "" };

export default function Cta() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function openModal() {
    setStatus("idle");
    setErrorMessage("");
    setForm(INITIAL_FORM);
    setIsOpen(true);
  }

  function closeModal() {
    if (status === "submitting") return;
    setIsOpen(false);
  }

  function updateField(field: keyof typeof INITIAL_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Let&apos;s build the system your business needs.</h2>
        <p className={styles.sub}>
          Tell us what you&apos;re building — we&apos;ll tell you how we&apos;d ship it.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={openModal} className={`dq-btn ${styles.primary}`}>
            Book a Demo
            <ArrowRight size={18} strokeWidth={1.75} />
          </button>
          <a href="mailto:vijay@devquery.in" className={styles.email}>
            vijay@devquery.in
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          onClick={closeModal}
        >
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.close}
              onClick={closeModal}
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.75} />
            </button>

            {status === "success" ? (
              <div className={styles.successState}>
                <h3 id="demo-modal-title" className={styles.modalTitle}>
                  Thanks — we&apos;ll be in touch.
                </h3>
                <p className={styles.modalSub}>
                  Your demo request is on its way. Expect a reply at {form.email} shortly.
                </p>
                <button type="button" className={`dq-btn ${styles.primary}`} onClick={closeModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 id="demo-modal-title" className={styles.modalTitle}>
                  Book a Demo
                </h3>
                <p className={styles.modalSub}>
                  Share a few details and we&apos;ll reach out to schedule your demo.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <label className={styles.field}>
                    <span className={styles.label}>Name</span>
                    <input
                      className={styles.input}
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Jane Doe"
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>Work email</span>
                    <input
                      className={styles.input}
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="jane@company.com"
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>Company</span>
                    <input
                      className={styles.input}
                      type="text"
                      value={form.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      placeholder="Acme Inc."
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>What are you building?</span>
                    <textarea
                      className={styles.textarea}
                      rows={4}
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      placeholder="Tell us about your project..."
                    />
                  </label>

                  {status === "error" && <p className={styles.errorText}>{errorMessage}</p>}

                  <button
                    type="submit"
                    className={`dq-btn ${styles.submit}`}
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending..." : "Request Demo"}
                    {status !== "submitting" && <ArrowRight size={18} strokeWidth={1.75} />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
