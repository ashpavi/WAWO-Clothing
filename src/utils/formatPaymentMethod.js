const PAYMENT_METHOD_LABELS = {
  card: "Credit Card",
  bankTransfer: "Bank Transfer",
  cod: "Cash on Delivery",
  
};

export function formatPaymentMethod(method) {
  return PAYMENT_METHOD_LABELS[method] || method;
}