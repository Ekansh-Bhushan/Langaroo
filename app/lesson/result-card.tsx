import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
    value: number;
    variant : "points" | "hearts";
}

export const ResultCard = ({ value, variant } : Props ) => {
    const imageSrc = variant === "hearts" ? "/heart.svg" : "points.svg";

    return (
        <div className={cn(
            "rounded-2xl border-2 w-full",
            variant === "points" && "bg-orange-400 border-orange-400",
            variant === "hearts" && "bg-rose-500 border-rose-500"
        )}>
            <div className={cn(
                "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
                variant === "points" && "bg-orange-500",
                variant === "hearts" && "bg-rose-600"
            )}>
                {variant === "hearts" ? "hearts left" : "total XP"}

            </div>

            <div className={cn(
                "rounded-2xl bg-white items-center justify-center flex p-6 font-bold text-lg",
                variant === "points" && "text-orange-500",
                variant === "hearts" && "text-rose-600"
            )}>
                <Image
                    src={imageSrc}
                    alt= "Icon"
                    height={30}
                    width={30}
                    className="mr-1.5"
                />
                {value}
            </div>
        </div>
    )
}