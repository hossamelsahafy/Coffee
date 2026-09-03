import type { TaskConfig } from "payload";
import {
  orderCancellationSubject,
  orderCancellationHTML,
} from "@/lib/Emails/OrderCancellation";

export const CancelUnpaidOrder: TaskConfig = {
  slug: "cancelUnpaidOrder",

  inputSchema: [
    {
      name: "orderId",
      type: "text",
      required: true,
    },
  ],

  handler: async ({ input, req }) => {
    const order = await req.payload.findByID({
      collection: "orders",
      id: input.orderId,
    });

    if (
      order.payment?.method !== "stripe" ||
      order.payment?.status !== "pending"
    ) {
      return {
        output: {
          cancelled: false,
          reason: "already_paid_or_not_stripe",
        },
      };
    }

    if (order.status === "cancelled") {
      return {
        output: {
          cancelled: false,
          reason: "already_cancelled",
        },
      };
    }

    await req.payload.update({
      collection: "orders",
      id: order.id,
      data: {
        status: "cancelled",
        payment: {
          status: "failed",
        },
      },
      overrideAccess: true,
    });

    try {
      await req.payload.sendEmail({
        to: order.customer?.email,
        subject: orderCancellationSubject(order.orderNumber),
        html: orderCancellationHTML({
          firstName: order.customer?.firstName,
          orderNumber: order.orderNumber,
          total: order?.total,
          paymentMethod: "stripe",
          isAdmin: false,
        }),
      });
    } catch (emailError) {
      console.error(
        "Failed to send order cancellation email to customer:",
        emailError,
      );
    }

    try {
      await req.payload.sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: orderCancellationSubject(order.orderNumber),
        html: orderCancellationHTML({
          firstName: order.customer?.firstName,
          lastName: order.customer?.lastName,
          email: order.customer?.email,
          phone: order.customer?.phone,
          orderNumber: order.orderNumber,
          total: order.total,
          paymentMethod: "stripe",
          isAdmin: true,
        }),
      });
    } catch (emailError) {
      console.error(
        "Failed to send order cancellation email to admin:",
        emailError,
      );
    }

    return {
      output: {
        cancelled: true,
        orderId: order.id,
      },
    };
  },
};
