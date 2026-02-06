/**
 * Default MJML Email Templates
 *
 * These templates are used as initial defaults for the EmailTemplates global.
 * They can be customized by admins in the CMS.
 */

// Default MJML template for waiting list
export const defaultWaitingListMjml = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f5">
    <mj-section padding="20px 0">
      <mj-column>
        <mj-text align="center" font-size="24px" color="#4F46E5" font-weight="bold">
          Welcome!
        </mj-text>
        <mj-text>Hi {{name}}</mj-text>
        <mj-text>
          Thanks for joining our waitlist. We're working hard to launch something amazing, and you'll be among the first to know when we're ready.
        </mj-text>
        <mj-text>We'll send you an email as soon as we launch.</mj-text>
        <mj-text padding-top="30px">
          &mdash; Nexiam Support
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

// Default MJML template for contact form
export const defaultContactFormMjml = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f5">
    <mj-section padding="20px 0">
      <mj-column>
        <mj-text align="center" font-size="24px" color="#4F46E5" font-weight="bold">
          Message Received
        </mj-text>
        <mj-text>Hi {{name}}</mj-text>
        <mj-text>
          Thank you for reaching out to us! Your request has been successfully received. Our team will review the details and will get back to you shortly.
        </mj-text>
        <mj-text padding-top="30px">
          &mdash; Nexiam Support
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
