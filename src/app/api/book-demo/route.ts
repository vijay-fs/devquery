import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 2000;

interface DemoRequestPayload {
  name: string;
  email: string;
  company?: string;
  message?: string;
}

/**
 * Validates and normalizes the incoming demo request body.
 * Returns a typed payload on success or an error message on failure.
 */
function parsePayload(body: unknown):
  | { ok: true; data: DemoRequestPayload }
  | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, company, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { ok: false, error: "Name is required." };
  }
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (company !== undefined && typeof company !== "string") {
    return { ok: false, error: "Invalid company value." };
  }
  if (message !== undefined && typeof message !== "string") {
    return { ok: false, error: "Invalid message value." };
  }

  return {
    ok: true,
    data: {
      name: name.trim().slice(0, MAX_FIELD_LENGTH),
      email: email.trim().slice(0, MAX_FIELD_LENGTH),
      company: company?.trim().slice(0, MAX_FIELD_LENGTH),
      message: message?.trim().slice(0, MAX_FIELD_LENGTH),
    },
  };
}

/** Escapes user input before interpolating it into the email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(payload: DemoRequestPayload): string {
  const rows: Array<[string, string]> = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.company || "—"],
    ["Message", payload.message || "—"],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px;font-weight:600;color:#0a1020;vertical-align:top;">${label}</td>
          <td style="padding:8px 12px;color:#333;white-space:pre-wrap;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;">
      <h2 style="color:#0a1020;">New "Book a Demo" request</h2>
      <table style="border-collapse:collapse;width:100%;">${body}</table>
    </div>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parsePayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const toAddress = process.env.DEMO_NOTIFICATION_TO ?? "vijay@devquery.in";
  const fromAddress =
    process.env.DEMO_NOTIFICATION_FROM ?? "DevQuery <noreply@devquery.in>";

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: parsed.data.email,
      subject: `New demo request from ${parsed.data.name}`,
      html: buildEmailHtml(parsed.data),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send your request. Please try again." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to send your request. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
