export const orderConfirmationSubject = (
  orderNumber: string,
  paymentMethod: string,
  paymentStatus?: string,
) => {
  if (paymentMethod === "stripe" && paymentStatus !== "paid") {
    return `Order Created – Payment Pending #${orderNumber} ☕`;
  }

  return `Order Confirmation #${orderNumber} ☕`;
};
export const orderConfirmationHTML = ({
  firstName,
  orderNumber,
  total,
  paymentMethod,
  orderState,
}: {
  firstName: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  orderState: "pending_payment" | "confirmed";
}) => {
  const isPending = orderState === "pending_payment";

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
        color:${isPending ? "#f0ad4e" : "#4caf50"};
        font-size:22px;
      ">
        ${
          isPending
            ? "Order Created – Awaiting Payment"
            : "Order Confirmed Successfully"
        }
      </h2>

      <p style="
        margin:0 0 20px 0;
        font-size:15px;
        line-height:1.6;
      ">
        Hi <strong style="color:#fff;">${firstName}</strong>, thanks for your order.
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
        border:1px solid ${isPending ? "#f0ad4e" : "#4caf50"};
        background:rgba(255,255,255,0.03);
      ">
        <p style="
          margin:0;
          font-size:14px;
          line-height:1.6;
          color:#cfcfcf;
        ">
          ${
            isPending
              ? "Please complete your payment within 24 hours or your order may be cancelled automatically."
              : "Your order is confirmed and is now being prepared. We’ll update you once it’s shipped."
          }
        </p>
      </div>

    </div>
  </div>
  `;
};
