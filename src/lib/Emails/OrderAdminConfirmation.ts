export const orderAdminSubject = (orderNumber: string) => {
  return `New Order #${orderNumber} ☕`;
};

export const orderAdminHTML = ({
  firstName,
  lastName,
  email,
  phone,
  orderNumber,
  total,
  paymentMethod,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
}) => {
  let currency = "USD";
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
      <h2>New Order Received</h2>

      <div style="
        background:#1e1e1e;
        padding:20px;
        border-radius:12px
        margin-top: 5px;
      ">
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod} ${currency}</p>
        <p><strong>Total:</strong> ${total} ${currency}</p>
      </div>
    </div>
  </div>
  `;
};
