import { describe, it, expect, beforeEach, afterEach } from "vitest"
import crypto from "crypto"
import { MidtransAdapter } from "./gateways/midtrans"

describe("MidtransAdapter Webhook Verification", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("verifies signature with timing safe SHA512 hash", async () => {
    const serverKey = "test_server_key_12345"
    process.env.MIDTRANS_SERVER_KEY = serverKey

    const adapter = new MidtransAdapter()
    const orderId = "ORD-2026-TEST"
    const statusCode = "200"
    const grossAmount = "150000.00"

    const validHash = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex")

    const result = await adapter.verifyWebhook({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: validHash,
      transaction_status: "settlement",
    })

    expect(result.isValid).toBe(true)
    expect(result.orderNumber).toBe(orderId)
    expect(result.transactionStatus).toBe("paid")
  })

  it("rejects forged or invalid signature", async () => {
    process.env.MIDTRANS_SERVER_KEY = "test_server_key_12345"
    const adapter = new MidtransAdapter()

    const result = await adapter.verifyWebhook({
      order_id: "ORD-2026-TEST",
      status_code: "200",
      gross_amount: "150000.00",
      signature_key: "0".repeat(128),
      transaction_status: "settlement",
    })

    expect(result.isValid).toBe(false)
  })

  it("maps transaction statuses correctly", async () => {
    const serverKey = "test_key"
    process.env.MIDTRANS_SERVER_KEY = serverKey
    const adapter = new MidtransAdapter()

    function createSignedPayload(status: string, fraudStatus?: string) {
      const orderId = "ORD-TEST"
      const statusCode = "200"
      const grossAmount = "100000"
      const hash = crypto
        .createHash("sha512")
        .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
        .digest("hex")

      return {
        order_id: orderId,
        status_code: statusCode,
        gross_amount: grossAmount,
        signature_key: hash,
        transaction_status: status,
        fraud_status: fraudStatus,
      }
    }

    const captureAccept = await adapter.verifyWebhook(createSignedPayload("capture", "accept"))
    expect(captureAccept.transactionStatus).toBe("paid")

    const captureDeny = await adapter.verifyWebhook(createSignedPayload("capture", "challenge"))
    expect(captureDeny.transactionStatus).toBe("failed")

    const pending = await adapter.verifyWebhook(createSignedPayload("pending"))
    expect(pending.transactionStatus).toBe("waiting")

    const expired = await adapter.verifyWebhook(createSignedPayload("expire"))
    expect(expired.transactionStatus).toBe("expired")

    const cancel = await adapter.verifyWebhook(createSignedPayload("cancel"))
    expect(cancel.transactionStatus).toBe("failed")
  })
})
