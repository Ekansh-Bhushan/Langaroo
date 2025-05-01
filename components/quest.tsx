"use client";

import { quest } from "@/constants";
import { Button } from "./ui/button";
import Link from "next/link";
import { Progress } from "./ui/progress";
import Image from "next/image";

type Props = {
    points: number
}

export const Quests = ({points} : Props) => {
    return (
        <div className="border-2 rounded-xl p-4 gap-y-4">
            <div className="spac-y-2">
                <div className="flex items-center gap-y-2 justify-between w-full">


                    <h3 className="font-bold text-lg">
                        Quest
                    </h3>

                    <Button
                        asChild
                        variant="primaryOutline"

                        size="sm"
                    >
                        <Link href="/quest">
                            View All
                        </Link>
                    </Button>
                </div>

                <ul className="w-full space-y-4">
                    {quest.map((quest) => {
                        const progress = (points/ quest.value) *100;
                        return (
                            <div
                                className="flex items-center w-full p-4 gap-x-3 border-t-2"
                                key={quest.title}
                            >   
                            <Image
                                src="/points.svg"
                                alt = "point"
                                height={30}
                                width={30}
                             />

                             <div className="flex flex-col gap-y-2 w-full">
                                <p className="text-neutral-700 text-xl font-bold">
                                    {quest.title}
                                </p>
                                <Progress value={progress} className="h-2"/>
                             </div>

                            </div>
                        )
                    })}
                </ul>

            </div>

        </div>
    )
}