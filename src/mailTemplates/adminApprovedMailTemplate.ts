// @ts-ignore
import mjml2html from "mjml";

const adminApprovalTemplate = (adminName: string, loginLink: string) => {
  const mjml = `<mjml>
  <mj-head>
    <mj-preview>Your admin account has been verified successfully</mj-preview>
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
          Admin Account Verified Successfully! 🎉
        </mj-text>

        <!-- Greeting -->
        <mj-text
          font-size="16px"
          font-family="Helvetica"
          color="#374151"
          align="left"
        >
          Hi <strong>${adminName}</strong>,
        </mj-text>

        <!-- Message -->
        <mj-text
          font-size="15px"
          font-family="Helvetica"
          color="#4b5563"
          align="left"
        >
          Great news! Your admin account has been successfully verified and is now active. You now have full administrative access to the BatioBhai platform and can manage all system features.
        </mj-text>

        <!-- Button -->
        <mj-button
          background-color="#4f46e5"
          color="white"
          border-radius="6px"
          font-size="16px"
          font-family="Helvetica"
          font-weight="bold"
          href=${loginLink}
        >
          Access Admin Dashboard
        </mj-button>

        <!-- Additional Info -->
        <mj-text
          font-size="15px"
          font-family="Helvetica"
          color="#4b5563"
          align="left"
        >
          As an administrator, you have access to manage users, agents, and all platform settings. If you need any assistance, please don't hesitate to contact our support team.
        </mj-text>

        <mj-divider border-color="#e5e7eb" />

        <!-- Footer -->
        <mj-text
          font-size="13px"
          color="#9ca3af"
          font-family="Helvetica"
          align="center"
        >
          Welcome to BatioBhai Admin Panel! We're excited to have you on board.
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

export { adminApprovalTemplate };
