export const orderCancellationSubject = (orderNumber: string) => {
  return `Order Cancelled – Order #${orderNumber} ☕`;
};

export const orderCancellationHTML = ({
  firstName,
  lastName,
  email,
  phone,
  orderNumber,
  total,
  paymentMethod,
  isAdmin,
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
        color:#e57373;
        font-size:22px;
      ">
        Order Cancelled
      </h2>

      <p style="
        margin:0 0 20px 0;
        font-size:15px;
        line-height:1.6;
      ">
        ${
          isAdmin
            ? `Order <strong style="color:#fff;">#${orderNumber}</strong> has been automatically cancelled because the customer did not complete the payment within the 24-hour payment period.`
            : `Hi <strong style="color:#fff;">${firstName}</strong>, your order <strong style="color:#fff;">#${orderNumber}</strong> has been cancelled because the payment was not completed within 24 hours.`
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

        ${
          isAdmin
            ? `
        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Customer:</strong> ${firstName || ""} ${lastName || ""}
        </p>

        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Email:</strong> ${email || ""}
        </p>

        <p style="margin:6px 0;">
          <strong style="color:#d4a373;">Phone:</strong> ${phone || ""}
        </p>
        `
            : ""
        }

      </div>

      <div style="
        padding:16px;
        border-radius:12px;
        border:1px solid #e57373;
        background:rgba(229,115,115,0.08);
      ">
        <p style="
          margin:0;
          font-size:14px;
          line-height:1.6;
          color:#cfcfcf;
        ">
          ${
            isAdmin
              ? "The customer did not complete the Stripe payment within the allowed 24-hour period, so the order status has been automatically changed to CANCELLED."
              : "Your payment was not completed within the allowed 24-hour period, so your order has been automatically cancelled. If you still want the items, you can place a new order at any time."
          }
        </p>
      </div>

    </div>
  </div>
  `;
};
