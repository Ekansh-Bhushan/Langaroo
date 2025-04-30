"use client";

import { useHeartModal } from "@/store/use-heart-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";



export const HeartModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useHeartModal();

    useEffect(() => setIsClient(true), []);

    const onClick =() => {
        close();
        router.push('/store');
    }

    if(!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src='/mascotbad.png' alt='mascot' height={80} width={80}/>
                        
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        You ran out of Hearts
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Get pro for unlimited hearts
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full text-center" size="lg" onClick={onClick}>
                            Get Pro
                        </Button>
                        <Button variant="primaryOutline" className="w-full text-center" size="lg" onClick={close}>
                            No thanks
                        </Button>
                    </div>       
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}