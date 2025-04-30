// app/api/razorpay/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  
    const { userId } = await auth(); 

    if(!userId) {
        return;
    }

    const planID = process.env.RAZORPAY_PLAN_ID
    const amount = 10;


    const options = {
      amount: amount*100, // amount in paisa
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    
    try {

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    return new NextResponse("Order creation failed", { status: 500 });
  }
}


