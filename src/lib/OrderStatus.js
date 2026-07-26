import {
  FaClock,
  FaCog,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaUndo,
  FaMoneyBillWave,
} from "react-icons/fa";

export const ORDER_STATUS = {
  pending: {
    icon: FaClock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  processing: {
    icon: FaCog,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  shipped: {
    icon: FaTruck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  delivered: {
    icon: FaCheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  cancelled: {
    icon: FaTimesCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
};

export const PAYMENT_STATUS = {
  pending: {
    icon: FaCreditCard,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  paid: {
    icon: FaCheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  failed: {
    icon: FaTimesCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  refunded: {
    icon: FaUndo,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  cash_on_delivery: {
    icon: FaMoneyBillWave,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
};
