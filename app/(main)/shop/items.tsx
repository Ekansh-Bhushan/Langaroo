"use client";

import { refillHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useTransition } from "react";
import axios from "axios";
import { toast } from "sonner";
import { POINTS_TO_REFILL } from "@/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    hearts : number;
    points : number;
    hasActiveSubscription : boolean;
}

export const Items = ({ hearts, points, hasActiveSubscription } : Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [isSubscribed, setIsSubscribed] = useState(hasActiveSubscription); 
    const loadScript = (src: string)=> {
        return new Promise((resolve)=> {
            const script =document.createElement('script');
            script.src= src;
            script.onload = () => {
                resolve(true)
            }

            script.onerror=()=>{
                resolve(false)
            }

            document.body.appendChild(script)
        })
    }

    const onPayment = async () => {
        try {
          // 1. Create the order from your backend
          const res = await axios.post("http://localhost:3000/api/razorpay");
          const data = res.data;
      
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // use NEXT_PUBLIC for frontend access
            order_id: data.id, // Razorpay order ID
            ...data,
            handler: async function (response: any) {
              
              const verificationPayload = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              };
      
              try {
                const verificationRes = await axios.post(
                  "http://localhost:3000/api/razorpayVerfiy",
                  verificationPayload
                );

                setIsSubscribed(true);
        toast.success("Subscription activated!");
        router.refresh();
              } catch (err) {
                console.error("Verification Failed:", err);
                toast.error("Verification failed. Please try again.");
              }
            },
          };
      
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } catch (err) {
          console.error("Order Creation Failed:", err);
        }
      };
      

    useEffect(()=>{
        loadScript('https://checkout.razorpay.com/v1/checkout.js')
    },[])

    const onRefillHearts = () => {
        if(pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }

        startTransition(() => {
            refillHearts()
                .catch(() => toast.error("Something went wrong"))
        })
    }

    const onUpgrade = async () => {
        startTransition(() => {
            onPayment();
        })
    }
      

    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image
                    src= "/heart.svg"
                    alt = "hearts"
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-lg font-bold">
                        Refill Hearts
                    </p>
                </div>
                <Button 
                    onClick={onRefillHearts}
                    disabled={ pending || hearts === 5 || points < POINTS_TO_REFILL}
                >
                    {hearts === 5
                        ? "full" 
                        : (
                            <div className="flex items-center">
                                <Image
                                    src= "/points.svg"
                                    alt = "points"
                                    height={20}
                                    width={20}
                                />
                                <p>
                                    {POINTS_TO_REFILL}
                                </p>
                            </div>
                        )
                    }
                </Button>
            </div>
            <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
                <Image
                    src= "/premium.svg"
                    alt="pro"
                    height={60}
                    width={60}
                />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-lg font-bold">
                        Unlimite heart
                    </p>
                </div>
                <Button
                    onClick={onUpgrade}
                    disabled= {pending || isSubscribed}
                >
                    {isSubscribed ? "active" : "upgrade"}
                </Button>
            </div>
        </ul>
    )
}