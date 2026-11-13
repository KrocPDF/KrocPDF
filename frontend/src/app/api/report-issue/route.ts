import { NextResponse } from 'next/server';

interface ReportIssuePayload {
  email: string;
  category: string;
  subject: string;
  message: string;
  environment?: {
    userAgent?: string;
    url?: string;
    timestamp?: string;
  };
}

// Target email address configured underneath — never exposed to client bundles
const RECIPIENT_EMAIL = process.env.REPORT_ISSUE_EMAIL || 'krocpdf@gmail.com';

export async function POST(req: Request) {
  try {
    const body: ReportIssuePayload = await req.json();
    const { email, category, subject, message, environment } = body;

    // Basic validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid reply email address is required.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json(
        { error: 'Subject cannot be empty.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a detailed description of the issue.' },
        { status: 400 }
      );
    }

    const cleanCategory = category || 'Bug Report';
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const now = new Date().toISOString();

    const formattedBody = [
      `From: ${email}`,
      `Category: ${cleanCategory}`,
      `Timestamp: ${now}`,
      environment?.userAgent ? `User-Agent: ${environment.userAgent}` : null,
      environment?.url ? `Origin URL: ${environment.url}` : null,
      '',
      '--- MESSAGE ---',
      cleanMessage,
      '--- END MESSAGE ---',
    ]
      .filter(Boolean)
      .join('\n');

    // 1. If Resend API Key is set in production environment, dispatch email directly
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'KrocPDF Feedback <notifications@krocpdf.app>',
            to: [RECIPIENT_EMAIL],
            reply_to: email,
            subject: `[KrocPDF ${cleanCategory}] ${cleanSubject}`,
            text: formattedBody,
          }),
        });

        if (!resendRes.ok) {
          const errData = await resendRes.text();
          console.error('[Report-Issue] Resend API error:', errData);
        }
      } catch (sendErr) {
        console.error('[Report-Issue] Error calling email service:', sendErr);
      }
    }

    // Always log receipt server-side for redundancy
    console.log(
      `[Report-Issue] Successfully received issue report:\nTo: ${RECIPIENT_EMAIL}\nReply-To: ${email}\nCategory: ${cleanCategory}\nSubject: ${cleanSubject}\n`
    );

    // Return success to the client without exposing the underlying email address
    return NextResponse.json({
      success: true,
      message: 'Issue report successfully received. The team has been notified.',
    });
  } catch (err: unknown) {
    console.error('[Report-Issue] Internal error processing request:', err);
    return NextResponse.json(
      { error: 'Failed to process issue submission. Please try again.' },
      { status: 500 }
    );
  }
}
