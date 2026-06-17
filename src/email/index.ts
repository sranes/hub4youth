import type { Payload } from 'payload'

import { formatPrice } from '@/utilities/formatPrice'

const BRAND = 'hub4youth'
const BRAND_COLOR = '#534AB7'

/** Wrap body content in a simple, email-client-safe branded shell. */
function shell(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f5f7;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background:${BRAND_COLOR};padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold;">${BRAND}</td></tr>
          <tr><td style="padding:28px;">
            <h1 style="margin:0 0 16px;font-size:20px;">${heading}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:18px 28px;background:#fafafa;color:#888;font-size:12px;">
            ${BRAND} — online IT courses for students &amp; professionals.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

async function safeSend(
  payload: Payload,
  opts: { to: string; subject: string; html: string },
): Promise<void> {
  try {
    await payload.sendEmail(opts)
  } catch (err) {
    payload.logger.error(`Failed to send email to ${opts.to}: ${(err as Error).message}`)
  }
}

const notifyAddress = (): string | undefined => process.env.ENQUIRY_NOTIFY_EMAIL || undefined

export type EnquiryEmailData = {
  name: string
  email: string
  phone?: string
  course?: string
  message?: string
}

export async function sendEnquiryEmails(
  payload: Payload,
  data: EnquiryEmailData,
): Promise<void> {
  const { name, email, phone, course, message } = data

  await safeSend(payload, {
    to: email,
    subject: `We received your enquiry — ${BRAND}`,
    html: shell(
      `Thanks, ${name}!`,
      `<p style="line-height:1.6;">We've received your enquiry${
        course ? ` about <strong>${course}</strong>` : ''
      } and a course advisor will be in touch shortly.</p>
       <p style="line-height:1.6;">In the meantime, feel free to browse our courses or reply to this email with any questions.</p>`,
    ),
  })

  const admin = notifyAddress()
  if (admin) {
    await safeSend(payload, {
      to: admin,
      subject: `New enquiry: ${name}`,
      html: shell(
        'New website enquiry',
        `<table role="presentation" cellpadding="6" style="font-size:14px;line-height:1.5;">
           <tr><td><strong>Name</strong></td><td>${name}</td></tr>
           <tr><td><strong>Email</strong></td><td>${email}</td></tr>
           ${phone ? `<tr><td><strong>Phone</strong></td><td>${phone}</td></tr>` : ''}
           ${course ? `<tr><td><strong>Course</strong></td><td>${course}</td></tr>` : ''}
           ${message ? `<tr><td valign="top"><strong>Message</strong></td><td>${message}</td></tr>` : ''}
         </table>`,
      ),
    })
  }
}

export type EnrollmentEmailData = {
  name: string
  email: string
  courseTitle: string
  amount: number
  currency: string
}

export async function sendEnrollmentConfirmation(
  payload: Payload,
  data: EnrollmentEmailData,
): Promise<void> {
  const { name, email, courseTitle, amount, currency } = data
  const price = formatPrice(amount, currency)

  await safeSend(payload, {
    to: email,
    subject: `You're enrolled in ${courseTitle} — ${BRAND}`,
    html: shell(
      `You're in, ${name}!`,
      `<p style="line-height:1.6;">Your enrollment in <strong>${courseTitle}</strong> is confirmed and your payment of <strong>${price}</strong> has been received.</p>
       <p style="line-height:1.6;">Our team will email you the joining details and schedule shortly. Welcome to ${BRAND}!</p>`,
    ),
  })

  const admin = notifyAddress()
  if (admin) {
    await safeSend(payload, {
      to: admin,
      subject: `New enrollment: ${courseTitle} — ${name}`,
      html: shell(
        'New paid enrollment',
        `<table role="presentation" cellpadding="6" style="font-size:14px;line-height:1.5;">
           <tr><td><strong>Name</strong></td><td>${name}</td></tr>
           <tr><td><strong>Email</strong></td><td>${email}</td></tr>
           <tr><td><strong>Course</strong></td><td>${courseTitle}</td></tr>
           <tr><td><strong>Amount</strong></td><td>${price}</td></tr>
         </table>`,
      ),
    })
  }
}
