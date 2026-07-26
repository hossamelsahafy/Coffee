export const forgotPasswordSubject = () => {
  return "Reset Your Coffee Store Password ☕";
};

export const forgotPasswordHTML = ({
  token,
  user,
}: {
  token: string;
  user: any;
}) => {
  const url = `${process.env.NEXT_PUBLIC_URL}/en/users/reset-password?token=${token}`;

  return `
  <div style="
    background:#121212;
    padding:40px 20px;
    font-family:Arial,sans-serif;
    color:#f5f5f5;
  ">
    <div style="
      max-width:600px;
      margin:auto;
      background:#1e1e1e;
      border-radius:20px;
      overflow:hidden;
      border:1px solid #3b2a21;
    ">

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

      <div style="padding:40px 30px;">
        <h2 style="
          color:#ffffff;
          margin-bottom:20px;
        ">
          Reset Your Password
        </h2>

        <p style="
          color:#cfcfcf;
          line-height:1.7;
          font-size:16px;
        ">
          Hey <strong>${user.email}</strong>,
          we received a request to reset your password.
        </p>

        <div style="text-align:center; margin:40px 0;">
          <a
            href="${url}"
            style="
              background:#d4a373;
              color:#121212;
              text-decoration:none;
              padding:16px 32px;
              border-radius:999px;
              font-weight:bold;
              display:inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="
          color:#8f8f8f;
          font-size:14px;
          line-height:1.6;
        ">
          If you didn’t request this password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
  `;
};
