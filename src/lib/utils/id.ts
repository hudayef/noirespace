export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(1000 + Math.random() * 9000)
  return `ORD-${date}-${random}`
}

export function generateBookingNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(1000 + Math.random() * 9000)
  return `BK-${date}-${random}`
}

export function generatePaymentNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.floor(1000 + Math.random() * 9000)
  return `PAY-${date}-${random}`
}
