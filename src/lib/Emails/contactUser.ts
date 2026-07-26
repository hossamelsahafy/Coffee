export const contactUserSubject = () => {
  return "We Received Your Message ☕";
};

export const contactUserHTML = ({ firstName }: { firstName: string }) => {
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
        <h2 style="
          color:#ffffff;
          margin-bottom:20px;
        ">
          Message Received
        </h2>

        <p style="
          color:#cfcfcf;
          line-height:1.7;
          font-size:16px;
        ">
          Hey <strong>${firstName}</strong>,
          thank you for contacting us.
          We've received your message and our team will get back to you as soon as possible.
        </p>

        <div style="
          margin-top:30px;
          padding:20px;
          background:#1e1e1e;
          border-radius:12px;
          color:#cfcfcf;
        ">
          We appreciate your interest in Coffee Store ☕
        </div>
      </div>
    </div>
  `;
};
