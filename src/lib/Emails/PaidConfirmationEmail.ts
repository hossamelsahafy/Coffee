export const paymentSuccessSubject = (orderNumber: string) => {
  return `Payment Successful – Order #${orderNumber} ☕`;
};
export const paymentSuccessHTML = ({
  firstName,
  orderNumber,
  total,
  paymentMethod,
  isAdmin,
}: {
  firstName?: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  isAdmin?: boolean;
}) => {
  return `
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

  <div style="
    background:#121212;
    padding:40px 20px;
  ">

    <div style="
      max-width:520px;
      margin:0 auto;
      background:#1e1e1e;
      border-radius:16px;
      padding:30px;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
      color:#cfcfcf;
    ">

      <h2 style="
        margin:0 0 15px 0;
        color:#4caf50;
        font-size:22px;
      ">
        Payment Successful 🎉
      </h2>

      <p style="
        margin:0 0 20px 0;
        font-size:15px;
        line-height:1.6;
      ">
        ${
          isAdmin
            ? `A payment has been successfully received for order <strong style="color:#fff;">#${orderNumber}</strong>.`
            : `Hi <strong style="color:#fff;">${firstName}</strong>, your payment was successful.`
        }
      </p>

      <div style="
        background:#151515;
        padding:16px;
        border-radius:12px;
        margin-bottom:20px;
      ">
        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Order #:</strong> ${orderNumber}
        </p>

        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Total:</strong> $${total}
        </p>

        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Payment:</strong> ${paymentMethod}
        </p>
      </div>

      <div style="
        padding:16px;
        border-radius:12px;
        border:1px solid #4caf50;
        background:rgba(76,175,80,0.08);
      ">
        <p style="
          margin:0;
          font-size:14px;
          line-height:1.6;
          color:#cfcfcf;
        ">
          ${
            isAdmin
              ? "Order status has been automatically updated to PROCESSING."
              : "We’re now preparing your order and will notify you once it ships."
          }
        </p>
      </div>

    </div>
  </div>
  `;
};
