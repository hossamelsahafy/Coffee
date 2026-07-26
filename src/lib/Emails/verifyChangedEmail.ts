export const verifyEmailChangeSubject = () => {
  return "Your 6-Digit Email Verification Code ☕";
};

export const verifyEmailChangeHTML = ({
  token,
  user,
}: {
  token: string; // This now receives the 6-digit code string (e.g., "582914")
  user: any;
}) => {
  return `
  <div style="
    background-color:#1e140f; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #3b2a21;
  ">
    <!-- Header Block -->
    <div style="
      background:#3b2a21;
      padding:30px;
      text-align:center;
    ">
      <h1 style="
        margin:0;
        color:#d4a373;
        font-size:32px;
      ">
        ☕ Coffee Store
      </h1>
    </div>

    <!-- Body Block -->
    <div style="padding:40px 30px; background-color: #1e140f;">
      <h2 style="
        color:#ffffff;
        margin-top:0;
        margin-bottom:20px;
        font-size: 22px;
      ">
        Verify Your New Email Address
      </h2>

      <p style="
        color:#cfcfcf;
        line-height:1.7;
        font-size:16px;
      ">
        Hey <strong>${user.firstName || "there"}</strong>,
      </p>
      
      <p style="
        color:#cfcfcf;
        line-height:1.7;
        font-size:16px;
      ">
        You requested to change your account email address. Use the 6-digit verification code below to confirm this change. This code is valid for 15 minutes.
      </p>

      <!-- Numeric Code Graphic Box -->
      <div style="text-align:center; margin:40px 0;">
        <div style="
          background-color: #3b2a21;
          color: #d4a373;
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 6px;
          padding: 20px 40px;
          border-radius: 12px;
          display: inline-block;
          border: 1px solid #d4a373;
          font-family: monospace;
        ">
          ${token}
        </div>
      </div>

      <p style="
        color:#8f8f8f;
        font-size:14px;
        line-height:1.6;
        margin-bottom: 0;
      ">
        If you didn't request this update, no action is needed. Your email will remain unchanged.
      </p>
    </div>
  </div>
  `;
};
