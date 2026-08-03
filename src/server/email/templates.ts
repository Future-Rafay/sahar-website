function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

export function staffInvitationEmail(input: { invitationUrl: string }) {
  const url = escapeHtml(input.invitationUrl);

  return {
    subject: "You are invited to Sahar",
    text: `You have been invited to Sahar staff. Set your password: ${input.invitationUrl}`,
    html: `<h1>You are invited to Sahar</h1><p>Use the link below to set your staff password.</p><p><a href="${url}">Accept invitation</a></p><p>This link expires in 48 hours.</p>`,
  };
}

export function orderConfirmationEmail(input: { orderNumber: string }) {
  const orderNumber = escapeHtml(input.orderNumber);

  return {
    subject: `Sahar order ${input.orderNumber}`,
    text: `Your Sahar order ${input.orderNumber} is confirmed.`,
    html: `<h1>Order confirmed</h1><p>Your Sahar order <strong>${orderNumber}</strong> is confirmed.</p>`,
  };
}

export function orderStatusEmail(input: {
  orderNumber: string;
  status: string;
  locale: "DE" | "EN";
}) {
  const orderNumber = escapeHtml(input.orderNumber);
  const labels: Record<string, { DE: string; EN: string }> = {
    PREPARING: { DE: "wird zubereitet", EN: "is being prepared" },
    READY_FOR_PICKUP: { DE: "ist abholbereit", EN: "is ready for pickup" },
    OUT_FOR_DELIVERY: { DE: "ist unterwegs", EN: "is out for delivery" },
    COMPLETED: { DE: "ist abgeschlossen", EN: "is completed" },
  };
  const text = labels[input.status]?.[input.locale] ?? input.status;
  const subject = input.locale === "DE" ? `Bestellung ${input.orderNumber}: ${text}` : `Order ${input.orderNumber}: ${text}`;
  return {
    subject,
    text: input.locale === "DE" ? `Ihre Sahar-Bestellung ${input.orderNumber} ${text}.` : `Your Sahar order ${input.orderNumber} ${text}.`,
    html: `<h1>${subject}</h1><p><strong>${orderNumber}</strong> ${escapeHtml(text)}.</p>`,
  };
}
