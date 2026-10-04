import crypto from "crypto"
import type { PaymentAdapter, CreateTransactionParams, TransactionResult, WebhookVerificationResult } from "../payment.types"
import { generatePaymentNumber } from "@/lib/utils/id"

export class MidtransAdapter implements PaymentAdapter {
  private serverKey: string
  private isProduction: boolean

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || ""
    this.isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true"
  }

  private getBaseUrl(): string {
    return this.isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions"
  }

  async createTransaction(params: CreateTransactionParams): Promise<TransactionResult> {
    const paymentNumber = generatePaymentNumber()

    if (!this.serverKey) {
      return {
        paymentNumber,
        redirectUrl: `/api/payment/mock-redirect?orderNumber=${params.orderNumber}`,
        rawResponse: { mode: "mock" },
      }
    }

    const payload = {
      transaction_details: {
        order_id: params.orderNumber,
        gross_amount: params.amount,
      },
      customer_details: {
        first_name: params.customer.name,
        email: params.customer.email,
        phone: params.customer.phone || undefined,
      },
      item_details: params.items.map((it) => ({
        id: it.id,
        price: it.price,
        quantity: it.quantity,
        name: it.name.slice(0, 50),
      })),
    }

    const authHeader = Buffer.from(`${this.serverKey}:`).toString("base64")

    const res = await fetch(this.getBaseUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error_messages?.join(", ") || "Gagal menghubungi Midtrans Snap")
    }

    return {
      paymentNumber,
      redirectUrl: data.redirect_url,
      token: data.token,
      rawResponse: data,
    }
  }

  async verifyWebhook(payload: Record<string, unknown>): Promise<WebhookVerificationResult> {
    const orderId = payload.order_id as string
    const statusCode = payload.status_code as string
    const grossAmount = payload.gross_amount as string
    const signatureKey = payload.signature_key as string
    const transactionStatus = payload.transaction_status as string
    const fraudStatus = payload.fraud_status as string

    if (!this.serverKey) {
      return {
        isValid: true,
        orderNumber: orderId,
        transactionStatus: "paid",
        rawPayload: payload,
      }
    }

    const hashInput = `${orderId}${statusCode}${grossAmount}${this.serverKey}`
    const expectedHash = crypto.createHash("sha512").update(hashInput).digest("hex")

    const isValid = signatureKey === expectedHash

    let mappedStatus: "paid" | "waiting" | "failed" | "expired" = "waiting"

    if (transactionStatus === "capture") {
      mappedStatus = fraudStatus === "accept" ? "paid" : "failed"
    } else if (transactionStatus === "settlement") {
      mappedStatus = "paid"
    } else if (transactionStatus === "pending") {
      mappedStatus = "waiting"
    } else if (["deny", "cancel"].includes(transactionStatus)) {
      mappedStatus = "failed"
    } else if (transactionStatus === "expire") {
      mappedStatus = "expired"
    }

    return {
      isValid,
      orderNumber: orderId,
      transactionStatus: mappedStatus,
      rawPayload: payload,
    }
  }
}
