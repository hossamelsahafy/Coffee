export const contactAdminSubject = () => {
  return "New Contact Form Submission ☕";
};

export const contactAdminHTML = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}) => {
  return `
    <div style="
      max-width:600px;
      margin:auto;
      background:#121212;
      color:#ffffff;
      font-family:Arial,sans-serif;
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
        <h2 style="color:#ffffff;">
          New Contact Message
        </h2>

        <p style="color:#cfcfcf;">
          A customer submitted the contact form.
        </p>

        <div style="
          background:#1e1e1e;
          padding:20px;
          border-radius:12px;
        ">
          <p><strong>First Name:</strong> ${firstName}</p>
          <p><strong>Last Name:</strong> ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>

          <h3>Message</h3>
          <p>${message}</p>
        </div>
      </div>
    </div>
  `;
};
