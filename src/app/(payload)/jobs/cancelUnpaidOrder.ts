import type { TaskConfig, TaskHandler } from "payload";

import {
  orderCancellationSubject,
  orderCancellationHTML,
} from "@/lib/Emails/OrderCancellation";

import { emitOrderUpdated } from "@/lib/OrderEvents";

type CancelUnpaidOrderInput = {
  orderId: string;
};

const cancelUnpaidOrderHandler: TaskHandler<"cancelUnpaidOrder"> = async ({
  input,
  req,
}) => {
  const { orderId } = input as CancelUnpaidOrderInput;

  const order = await req.payload.findByID({
    collection: "orders",
    id: orderId,
    overrideAccess: true,
  });
  // console.log("🔎 CANCEL JOB ORDER:", {
  //   orderId: order.id,
  //   status: order.status,
  //   paymentMethod: order.payment?.method,
  //   paymentStatus: order.payment?.status,
  // });
  if (order.status === "cancelled") {
    return {
      output: {
        cancelled: false,
        reason: "already_cancelled",
      },
    };
  }

  // Only cancel unpaid Stripe orders.
  if (
    order.payment?.method !== "stripe" ||
    (order.payment?.status !== "pending" && order.payment?.status !== "failed")
  ) {
    return {
      output: {
        cancelled: false,
        reason: "already_paid_or_not_stripe",
      },
    };
  }

  const updatedOrder = await req.payload.update({
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

  // Notify the user's global Orders SSE connection.
  const userId = typeof order.user === "object" ? order.user.id : order.user;

  if (userId) {
    emitOrderUpdated(String(userId), updatedOrder);
  }

  // Customer cancellation email.
  try {
    await req.payload.sendEmail({
      to: order.customer?.email ?? undefined,
      subject: orderCancellationSubject(order.orderNumber),
      html: orderCancellationHTML({
        firstName: order.customer?.firstName ?? undefined,
        orderNumber: order.orderNumber,
        total: order.total ?? 0,
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

  // Admin cancellation email.
  try {
    await req.payload.sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: orderCancellationSubject(order.orderNumber),
      html: orderCancellationHTML({
        firstName: order.customer?.firstName ?? undefined,
        lastName: order.customer?.lastName ?? undefined,
        email: order.customer?.email ?? undefined,
        phone: order.customer?.phone ?? undefined,
        orderNumber: order.orderNumber,
        total: order.total ?? 0,
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
};

export const CancelUnpaidOrder: TaskConfig<"cancelUnpaidOrder"> = {
  slug: "cancelUnpaidOrder",

  inputSchema: [
    {
      name: "orderId",
      type: "text",
      required: true,
    },
  ],

  handler: cancelUnpaidOrderHandler,
};
