export const orderStatusSubject = (
  orderNumber: string,
  status: "shipped" | "delivered",
) => {
  return status === "shipped"
    ? `Your Order #${orderNumber} Has Been Shipped ☕`
    : `Your Order #${orderNumber} Has Been Delivered ☕`;
};

export const orderStatusHTML = ({
  firstName,
  orderNumber,
  status,
}: {
  firstName: string;
  orderNumber: string;
  status: "shipped" | "delivered";
}) => {
  const isShipped = status === "shipped";

  return `
  <div style="
    font-family:Arial,sans-serif;
    background:#121212;
    color:#ffffff;
    max-width:600px;
    margin:auto;
    border-radius:12px;
    overflow:hidden;
  ">
    <div style="
      background:#8B4513;
      padding:24px;
      text-align:center;
    ">
      <h1 style="margin:0;">☕ Coffee Store</h1>
    </div>

    <div style="padding:40px 30px;">
      <h2>
        ${isShipped ? "Your Order Has Been Shipped" : "Your Order Has Been Delivered"}
      </h2>

      <div style="
        background:#1e1e1e;
        padding:20px;
        border-radius:12px;
        margin-top:20px;
      ">
        <p>Hi ${firstName},</p>

        ${
          isShipped
            ? `
              <p>
                Your order <strong>#${orderNumber}</strong> has been shipped
                and is on its way to you.
              </p>
            `
            : `
              <p>
                Your order <strong>#${orderNumber}</strong> has been delivered.
              </p>

              <p>
                We hope you enjoy your coffee! ☕
              </p>
            `
        }

        <p style="margin-bottom:0;">
          Thank you for shopping with Coffee Store.
        </p>
      </div>
    </div>
  </div>
  `;
};
