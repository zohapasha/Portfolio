import { NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_DESTINATION = "zohapasha16@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are all required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look valid." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message is too long (4000 character limit)." }, { status: 400 });
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
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? "Case Notes <onboarding@resend.dev>";

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: CONTACT_DESTINATION,
      replyTo: email,
      subject: `New case note from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return NextResponse.json({ error: "Delivery failed — please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending contact email:", err);
    return NextResponse.json({ error: "Delivery failed — please try again shortly." }, { status: 502 });
  }
}
