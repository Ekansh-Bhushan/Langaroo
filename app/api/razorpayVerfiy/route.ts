import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addMonths } from "date-fns";
import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    const currentPeriodEnd = addMonths(new Date(), 1);
    const razorpayPlanId = process.env.RAZORPAY_PLAN_ID!;
    const razorpayCustomerId = orderId;
    const razorpaySubscriptionId = paymentId;
    await db
    .insert(userSubscription)
    .values({
      userId,
      razorpayCustomerId,
      razorpaySubscriptionId,
      razorpayPlanId,
      razorpayCurrentPeriodEnd: currentPeriodEnd,
    })
    .onConflictDoUpdate({
      target: userSubscription.userId,
      set: {
        razorpayCustomerId,
        razorpaySubscriptionId,
        razorpayPlanId,
        razorpayCurrentPeriodEnd: currentPeriodEnd,
      },
    });
    return NextResponse.json({ success: true, message: "Payment verified" });
  } else {
    return new NextResponse("Invalid signature", { status: 400 });
  }
}