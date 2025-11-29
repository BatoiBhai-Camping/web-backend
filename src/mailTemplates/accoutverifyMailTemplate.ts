// @ts-ignore
import mjml2html from "mjml";

const accountVerificationTemplate = (userName: string, link: string) => {
  const mjml = `<mjml>
  <mj-head>
    <mj-preview>Verify your account to get started</mj-preview>
    <mj-style>
      .button {
        background-color: #4f46e5;
        color: white !important;
        padding: 14px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
    </mj-style>
  </mj-head>

  <mj-body background-color="#f4f4f7">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        
        <!-- Logo -->
        <mj-text
                 font-size="34px"
                 font-family="Helvetica"
                 color="#4f46e5"
                 align="center"
                 font-weight="bold"
                 >
        	BatioBhai
        </mj-text>

        <mj-divider border-color="#e5e7eb" />

        <!-- Title -->
        <mj-text
          font-size="24px"
          font-family="Helvetica"
          color="#111827"
          align="left"
          font-weight="bold"
        >
          Verify your email address
        </mj-text>

        <!-- Greeting -->
        <mj-text
          font-size="16px"
          font-family="Helvetica"
          color="#374151"
          align="left"
        >
          Hi <strong>${userName}</strong>,
        </mj-text>

        <!-- Message -->
        <mj-text
          font-size="15px"
          font-family="Helvetica"
          color="#4b5563"
          align="left"
        >
          Thank you for creating an account With BatioBhai. To complete your registration and activate your account, please verify your email address by clicking the button below.
        </mj-text>

        <!-- Button -->
        <mj-button
          background-color="#4f46e5"
          color="white"
          border-radius="6px"
          font-size="16px"
          font-family="Helvetica"
          font-weight="bold"
          href=${link}
        >
          Verify Account
        </mj-button>

        <!-- Fallback Link -->
        <mj-text
          font-size="14px"
          color="#6b7280"
          font-family="Helvetica"
          align="left"
        >
          If the button above doesn’t work, copy and paste the link below into your browser:
        </mj-text>

        
        <mj-text
          font-size="14px"
          color="#4f46e5"
          font-family="Helvetica"
          align="left"
        >
          <span style="word-break: break-all;">${link}</span>
        </mj-text>
        <mj-divider border-color="#e5e7eb" />

        <!-- Footer -->
        <mj-text
          font-size="13px"
          color="#9ca3af"
          font-family="Helvetica"
          align="center"
        >
          If you didn’t create an account, you can safely ignore this email.
        </mj-text>

        <mj-text
          font-size="13px"
          color="#9ca3af"
          font-family="Helvetica"
          align="center"
        >
          © 2025 Your Company, Inc. All rights reserved.
        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;

  const { html } = mjml2html(mjml);
  return html;
};

export { accountVerificationTemplate };
