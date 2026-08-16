import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_DESTINATION = "zohapasha16@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_MESSAGE = 4000;
const MAX_NAME = 200;

/**
 * A crude per-IP limit. This lives in module memory, so on a serverless host it
 * is per-instance and resets on cold start — it will not stop a determined
 * distributed flood. It is here to stop the ordinary case: one bot or one angry
 * person emptying a 100-a-day sending quota in a minute. Anything stronger
 * needs a shared store (Upstash, Vercel KV) and is worth adding only if this
 * actually gets abused.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this address. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  // Honeypot: a field hidden from people but attractive to form bots. Answer
  // with a success shape so the bot has no signal that it was caught.
  if ((body.company ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email) || email.length > MAX_NAME) {
    return NextResponse.json({ error: "That email address doesn't look valid." }, { status: 400 });
  }
  if (name.length > MAX_NAME) {
    return NextResponse.json({ error: "That name is too long." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Message is too long (${MAX_MESSAGE} character limit).` },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — contact form cannot deliver mail.");
    return NextResponse.json(
      { error: "The contact form isn't configured yet — email delivery is offline." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  // `||`, not `??`: an unset-but-present env var is an empty string, and `??`
  // only falls back on null/undefined — so a blank RESEND_FROM_ADDRESS sent an
  // empty `from` and Resend rejected it with "the domain is invalid".
  const fromAddress =
    process.env.RESEND_FROM_ADDRESS?.trim() || "Portfolio <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: CONTACT_DESTINATION,
      // Replying in the mail client goes straight back to the sender.
      replyTo: `${name} <${email}>`,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return NextResponse.json(
        { error: "Delivery failed — please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending contact email:", err);
    return NextResponse.json(
      { error: "Delivery failed — please try again shortly." },
      { status: 502 }
    );
  }
}
