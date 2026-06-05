import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeCreatePayment = {
  path: "/payments/stripe",
  method: "post" as const,
  handler: async (req: any) => {
    try {
      const payload = req.payload;
      const auth = await payload.auth({
        headers: req.headers,
      });

      const user = auth?.user;
      if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const orderId = body?.orderId;

      if (!orderId) {
        return Response.json({ error: "orderId is required" }, { status: 400 });
      }

      const result = await payload.find({
        collection: "orders",
        where: {
          and: [
            {
              id: {
                equals: orderId,
              },
            },
            {
              user: {
                equals: user.id,
              },
            },
          ],
        },
        limit: 1,
      });

      if (!result.docs.length) {
        return Response.json(
          {
            error: [
              {
                en: "Order not found",
                ar: "لم يتم العثور على الطلب",
              },
            ],
          },
          { status: 404 },
        );
      }
      const order = result.docs[0];

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.subtotal) * 100),
        currency: "usd",
        metadata: {
          orderId: String(order.id),
          userId: String(user.id),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      await payload.update({
        collection: "orders",
        id: order.id,
        data: {
          payment: {
            status: "pending",
            method: "stripe",
            stripePaymentIntentId: paymentIntent.id,
          },
        },
      });

      return Response.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  },
};
