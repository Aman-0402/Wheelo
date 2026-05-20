export function buildWhatsAppUrl(phone, inquiry = null) {
  const base = `https://wa.me/${phone.replace(/\D/g, '')}`
  if (!inquiry) return base

  const msg = [
    `Hi Wheelo! I just submitted an inquiry.`,
    ``,
    `Name: ${inquiry.full_name}`,
    `Phone: ${inquiry.phone}`,
    inquiry.vehicle_name ? `Vehicle: ${inquiry.vehicle_name}` : null,
    `Pickup: ${inquiry.pickup_date}`,
    `Drop: ${inquiry.drop_date}`,
    `City: ${inquiry.city}`,
  ]
    .filter(Boolean)
    .join('\n')

  return `${base}?text=${encodeURIComponent(msg)}`
}
