import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { userId } = await auth(); // No need to await this
  const user = await currentUser();

  if (!userId || !user) throw new Error("User not found");

  const body = await req.json();
  const { orderId, paymentId, signature } = body;

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === signature) {
    // Payment verified and do the DB operation
    return NextResponse.json({ success: true, message: "Payment verified" });
  } else {
    return new NextResponse("Invalid signature", { status: 400 });
  }
}
