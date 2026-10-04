export interface CreateTransactionParams {
  orderId: string
  orderNumber: string
  amount: number
  customer: {
    name: string
    email: string
    phone?: string | null
  }
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

export interface TransactionResult {
  paymentNumber: string
  redirectUrl: string
  token?: string
  rawResponse: Record<string, unknown>
}

export interface WebhookVerificationResult {
  isValid: boolean
  orderNumber: string
  transactionStatus: "paid" | "waiting" | "failed" | "expired"
  rawPayload: Record<string, unknown>
}

export interface PaymentAdapter {
  createTransaction(params: CreateTransactionParams): Promise<TransactionResult>
  verifyWebhook(payload: Record<string, unknown>): Promise<WebhookVerificationResult>
}
