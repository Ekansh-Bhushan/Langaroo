"use client";

import { usePracticeModal } from "@/store/use-practice-modal ";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";



export const PracticeModal = () => {
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = usePracticeModal();

    useEffect(() => setIsClient(true), []);

    if(!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image src='/heart.svg' alt='heart' height={100} width={100}/>
                        
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Practice Lesson
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Use practice session to regain hearts and points. you can not loose hearts in practice session.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full text-center" size="lg" onClick={close}>
                            I understand
                        </Button>
                    </div>       
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}