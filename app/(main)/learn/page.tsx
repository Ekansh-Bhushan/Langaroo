import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { title } from "process";

const Learn = () => {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={{title: "Punjabi", imageSrc : "/flag.svg"}} 
                    heart={5} 
                    points={200} 
                    haveActiveSubscription={false} 
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title="Punjabi"/>
                <div className="space-y-4">
                    <div className="h-[700px] bg-blue-500 w-full"/>
                </div>
            </FeedWrapper>
        </div>
    )
}
export default Learn;